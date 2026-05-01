import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseServer } from '@/lib/supabase-server'
import { sanitizeText } from '@/lib/validation'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      let listingData: Record<string, unknown> = {}
      try {
        listingData = JSON.parse(session.metadata?.listing_data ?? '{}')
      } catch {
        console.error('Failed to parse listing_data from webhook metadata')
        return NextResponse.json({ error: 'Invalid metadata' }, { status: 400 })
      }

      if (!listingData.title || !listingData.type) {
        console.error('Webhook listing_data missing required fields')
        return NextResponse.json({ error: 'Incomplete listing data' }, { status: 400 })
      }

      const typeMap: Record<string, string> = {
        'Art Studio': 'art', 'Workshop': 'workshop', 'Office': 'office',
        'Photo Studio': 'photo', 'Retail': 'retail', 'Fitness & Dance': 'fitness',
      }

      const rawType = String(listingData.type ?? '')

      await supabaseServer.from('listings').insert([{
        title: sanitizeText(listingData.title),
        description: sanitizeText(listingData.description),
        type: typeMap[rawType] ?? rawType.toLowerCase(),
        neighborhood: sanitizeText(listingData.neighborhood),
        price_display: typeof listingData.price_display === 'string'
          ? listingData.price_display.slice(0, 50)
          : null,
        niche_attributes: typeof listingData.niche_attributes === 'object'
          ? listingData.niche_attributes
          : null,
        submitted_by_email: typeof listingData.email === 'string'
          ? listingData.email.trim().toLowerCase()
          : null,
        contact_email: typeof listingData.email === 'string'
          ? listingData.email.trim().toLowerCase()
          : null,
        directory_id: process.env.NEXT_PUBLIC_DIRECTORY_ID || 'findstudiospace',
        city: 'Portland',
        status: 'pending',
        is_featured: true,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
      }])
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription
      await supabaseServer
        .from('listings')
        .update({ is_featured: false, updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', sub.id)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', (error as Error).message)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
