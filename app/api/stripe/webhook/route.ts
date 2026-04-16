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
        if (!listing_id) break

        const subscription_id = session.subscription as string
        const customer_id = session.customer as string

        // Fetch subscription to get current_period_end
        const subResponse = await stripe.subscriptions.retrieve(subscription_id)
        const periodEnd = (subResponse as unknown as { current_period_end: number }).current_period_end
        const periodEndISO = new Date(periodEnd * 1000).toISOString()

        // Idempotency: skip if already set to this subscription
        const { data: existing } = await supabase
          .from('listings')
          .select('stripe_subscription_id, current_period_end')
          .eq('id', parseInt(listing_id))
          .single()

        if (
          existing?.stripe_subscription_id === subscription_id &&
          existing?.current_period_end === periodEndISO
        ) {
          break // Already processed
        }

        await supabase
          .from('listings')
          .update({
            tier: 'pro',
            stripe_customer_id: customer_id,
            stripe_subscription_id: subscription_id,
            current_period_end: periodEndISO,
            updated_at: new Date().toISOString(),
          })
          .eq('id', parseInt(listing_id))

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription & { current_period_end: number }
        const isActive = ['active', 'trialing'].includes(subscription.status)

        if (isActive) {
          await supabase
            .from('listings')
            .update({
              tier: 'pro',
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id)
        } else {
          await supabase
            .from('listings')
            .update({
              tier: 'free',
              current_period_end: null,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id)
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        await supabase
          .from('listings')
          .update({
            tier: 'free',
            stripe_subscription_id: null,
            current_period_end: null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

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
