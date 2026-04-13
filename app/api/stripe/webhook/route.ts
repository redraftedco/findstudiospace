import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const listing_id = session.metadata?.listing_id
        const tier = session.metadata?.tier
        const subscription_id = session.subscription as string
        const customer_id = session.customer as string

        if (!listing_id || !tier) break

        const is_featured = tier === 'featured'
        const featured_expires_at = is_featured
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : null

        await supabase
          .from('listings')
          .update({
            is_featured,
            featured_expires_at,
            stripe_customer_id: customer_id,
            stripe_subscription_id: subscription_id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', parseInt(listing_id))

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        await supabase
          .from('listings')
          .update({
            is_featured: false,
            featured_expires_at: null,
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const is_active = subscription.status === 'active'

        if (!is_active) {
          await supabase
            .from('listings')
            .update({
              is_featured: false,
              featured_expires_at: null,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id)
        }

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
