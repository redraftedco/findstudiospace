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

  // PK conflict = already processed
  if (error?.code === '23505') return true
  if (error) {
    console.error('stripe_events insert error:', error)
    // If we can't record the event, don't process — fail safe
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

  // Idempotency: dedup by event.id before any mutation
  if (await isDuplicate(event.id)) {
    return NextResponse.json({ received: true })
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

        await supabase
          .from('listings')
          .update({
            tier: 'pro',
            is_featured: true,
            stripe_customer_id: customer_id,
            stripe_subscription_id: subscription_id,
            current_period_end: periodEndISO,
            updated_at: new Date().toISOString(),
          })
          .eq('id', parseInt(listing_id))

        // Invalidate ISR cache so the new Pro badge / photos 6-15 render immediately.
        // /listing/[id] has `export const revalidate = 3600`; without this call,
        // the first-Pro-upgrade user would see stale-free content for up to an hour.
        revalidatePath(`/listing/${listing_id}`)

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription & { current_period_end: number }
        const isActive = ['active', 'trialing'].includes(subscription.status)

        // .select('id') chained on update returns the affected row ids so we
        // can revalidate each. Defensive: one subscription could theoretically
        // map to multiple listings; iterate whatever came back.
        const updatePayload = isActive
          ? {
              tier: 'pro',
              is_featured: true,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            }
          : {
              tier: 'free',
              is_featured: false,
              current_period_end: null,
              updated_at: new Date().toISOString(),
            }

        const { data: affectedRows } = await supabase
          .from('listings')
          .update(updatePayload)
          .eq('stripe_subscription_id', subscription.id)
          .select('id')

        const rows = Array.isArray(affectedRows) ? affectedRows : []
        if (rows.length === 0) {
          console.warn(
            `[stripe-webhook] subscription.updated matched 0 listings for sub=${subscription.id}; ` +
            `ISR cache not invalidated (will stale up to 1h via revalidate=3600 backstop)`,
          )
        }
        for (const row of rows) {
          revalidatePath(`/listing/${row.id}`)
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        const { data: affectedRows } = await supabase
          .from('listings')
          .update({
            tier: 'free',
            is_featured: false,
            stripe_subscription_id: null,
            current_period_end: null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
          .select('id')

        const rows = Array.isArray(affectedRows) ? affectedRows : []
        if (rows.length === 0) {
          console.warn(
            `[stripe-webhook] subscription.deleted matched 0 listings for sub=${subscription.id}; ` +
            `ISR cache not invalidated (will stale up to 1h via revalidate=3600 backstop)`,
          )
        }
        for (const row of rows) {
          revalidatePath(`/listing/${row.id}`)
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
