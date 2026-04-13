import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseServer } from '@/lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const listing_data = JSON.parse(session.metadata?.listing_data ?? '{}')

    const typeMap: Record<string, string> = {
      'Art Studio': 'art', 'Workshop': 'workshop', 'Office': 'office',
      'Photo Studio': 'photo', 'Retail': 'retail', 'Fitness & Dance': 'fitness',
    }

    await supabaseServer.from('listings').insert([{
      title: listing_data.title,
      description: listing_data.description,
      type: typeMap[listing_data.type] ?? listing_data.type?.toLowerCase(),
      neighborhood: listing_data.neighborhood,
      price_display: listing_data.price_display,
      niche_attributes: listing_data.niche_attributes,
      submitted_by_email: listing_data.email,
      contact_email: listing_data.email,
      city: 'Portland',
      status: 'active',
      is_featured: true,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
    }])
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await supabaseServer
      .from('listings')
      .update({ is_featured: false })
      .eq('stripe_subscription_id', sub.id)
  }

  return NextResponse.json({ received: true })
}
