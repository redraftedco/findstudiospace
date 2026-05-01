import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'
import { supabaseServer } from '@/lib/supabase-server'
import {
  isValidEmail,
  parsePositiveInt,
  isOneOf,
  rateLimit,
  getClientIp,
} from '@/lib/validation'

const VALID_TIERS = ['pro', 'featured'] as const

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`checkout:${ip}`, { windowMs: 15 * 60 * 1000, maxRequests: 5 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
      )
    }

    const body = await req.json()
    const { tier, listing_id, email } = body

    if (!isOneOf(tier, VALID_TIERS)) {
      return NextResponse.json({ error: 'tier must be pro or featured' }, { status: 400 })
    }

    const listingId = parsePositiveInt(listing_id)
    if (!listingId) {
      return NextResponse.json({ error: 'Valid listing_id is required' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
    }

    const { data: listing, error: listingError } = await supabaseServer
      .from('listings')
      .select('id, status, contact_email')
      .eq('id', listingId)
      .eq('status', 'active')
      .single()

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found or not active' }, { status: 404 })
    }

    const priceId = STRIPE_PRICES[tier]

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email.trim().toLowerCase(),
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        listing_id: String(listingId),
        tier,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/for-landlords?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/for-landlords?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', (error as Error).message)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    )
  }
}
