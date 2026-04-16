import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'
import { checkOrigin } from '@/lib/security'

export async function POST(req: NextRequest) {
  const originError = checkOrigin(req)
  if (originError) return originError

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

    let siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.findstudiospace.com').trim()
    if (!/^https?:\/\//i.test(siteUrl)) {
      siteUrl = `https://${siteUrl}`
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        listing_id: String(listing_id),
        tier: tier,
      },
      success_url: `${siteUrl}/for-landlords?success=true`,
      cancel_url: `${siteUrl}/for-landlords?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to create checkout session'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
