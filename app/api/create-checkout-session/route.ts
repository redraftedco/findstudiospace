import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { isValidEmail, rateLimit, getClientIp } from '@/lib/validation'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`legacy-checkout:${ip}`, { windowMs: 15 * 60 * 1000, maxRequests: 5 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
      )
    }

    const { email, listing_data } = await req.json()

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
    }

    if (!listing_data || typeof listing_data !== 'object') {
      return NextResponse.json({ error: 'Listing data is required.' }, { status: 400 })
    }

    let serialized: string
    try {
      serialized = JSON.stringify(listing_data)
      if (serialized.length > 500) {
        serialized = serialized.slice(0, 500)
      }
    } catch {
      return NextResponse.json({ error: 'Invalid listing data.' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email.trim().toLowerCase(),
      line_items: [{
        price_data: {
          currency: 'usd',
          recurring: { interval: 'month' },
          product_data: { name: 'Featured Studio Listing' },
          unit_amount: 2900,
        },
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/list-your-space/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/list-your-space`,
      metadata: {
        listing_data: serialized,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json({ error: 'Failed to create checkout session.' }, { status: 500 })
  }
}
