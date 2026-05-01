import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

async function isDuplicate(eventId: string): Promise<boolean> {
  const { error } = await supabase
    .from('stripe_events')
    .insert({ event_id: eventId })
  if (error?.code === '23505') return true
  if (error) {
    console.error('stripe_events insert error:', error)
    return true
  }
  return false
}

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

  if (await isDuplicate(event.id)) {
    return NextResponse.json({ received: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const placementIdStr = session.metadata?.placement_id
        const listingIdStr   = session.metadata?.listing_id

        if (!placementIdStr || !listingIdStr) {
          console.warn('[webhook] checkout.session.completed: missing placement_id or listing_id in metadata — skipping')
          break
        }

        const placementId = parseInt(placementIdStr, 10)
        const listingId   = parseInt(listingIdStr, 10)

        if (isNaN(placementId) || isNaN(listingId)) {
          console.warn('[webhook] checkout.session.completed: non-integer placement_id or listing_id — skipping')
          break
        }

        await supabase
          .from('visibility_placements')
          .update({
            stripe_customer_id:     session.customer as string,
            stripe_subscription_id: session.subscription as string,
            updated_at: new Date().toISOString(),
            // status stays 'pending' — admin must approve before placement goes live
          })
          .eq('id', placementId)

        revalidatePath(`/listing/${listingId}`)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const isActive = ['active', 'trialing'].includes(subscription.status)

        // Only act on transitions to an inactive state. Admin controls pending→active;
        // we don't auto-activate on renewal so admin approval is preserved.
        if (!isActive) {
          const { data: rows } = await supabase
            .from('visibility_placements')
            .update({
              status: 'cancelled',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id)
            .select('listing_id, target_type, target_slug')

          for (const row of (rows ?? [])) {
            revalidatePath(`/listing/${row.listing_id}`)
            revalidatePath(`/portland/${row.target_slug}`)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        const { data: rows } = await supabase
          .from('visibility_placements')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
          .select('listing_id, target_type, target_slug')

        for (const row of (rows ?? [])) {
          revalidatePath(`/listing/${row.listing_id}`)
          revalidatePath(`/portland/${row.target_slug}`)
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
