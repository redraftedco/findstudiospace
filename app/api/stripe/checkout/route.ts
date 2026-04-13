import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tier, listing_id, email } = body

    if (!tier || !listing_id || !email) {
      return NextResponse.json(
        { error: 'tier, listing_id, and email are required' },
        { status: 400 }
      )
    }

    if (!['pro', 'featured'].includes(tier)) {
      return NextResponse.json(
        { error: 'tier must be pro or featured' },
        { status: 400 }
      )
    }

    const priceId = STRIPE_PRICES[tier as 'pro' | 'featured']

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        listing_id: String(listing_id),
        tier: tier,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/for-landlords?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/for-landlords?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
