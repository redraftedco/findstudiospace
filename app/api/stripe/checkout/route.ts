import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { checkOrigin } from '@/lib/security'

const PRICE_IDS: Record<string, string | undefined> = {
  monthly: process.env.STRIPE_PRICE_PRO_MONTHLY_ID,
  annual: process.env.STRIPE_PRICE_PRO_ANNUAL_ID,
}

export async function POST(req: NextRequest) {
  const originError = checkOrigin(req)
  if (originError) return originError

  try {
    const body = await req.json()
    const { listing_id, email, interval } = body

    if (!listing_id) {
      return NextResponse.json(
        { error: 'listing_id is required' },
        { status: 400 }
      )
    }

    const plan = interval === 'annual' ? 'annual' : 'monthly'
    const priceId = PRICE_IDS[plan]

    if (!priceId) {
      return NextResponse.json(
        { error: 'This plan is not available yet.' },
        { status: 400 }
      )
    }

    const siteUrl = 'https://www.findstudiospace.com'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      ...(email ? { customer_email: email } : {}),
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 30,
      },
      metadata: {
        listing_id: String(listing_id),
        tier: 'pro',
      },
      success_url: `${siteUrl}/claim?listing_id=${listing_id}&success=true`,
      cancel_url: `${siteUrl}/claim?listing_id=${listing_id}&canceled=true`,
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
