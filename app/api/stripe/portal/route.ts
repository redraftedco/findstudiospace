import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { checkOrigin } from '@/lib/security'

export async function POST(req: NextRequest) {
  const originError = checkOrigin(req)
  if (originError) return originError

  try {
    const { customer_id, listing_id } = await req.json()

    if (!customer_id) {
      return NextResponse.json({ error: 'Missing customer_id' }, { status: 400 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customer_id,
      return_url: `https://www.findstudiospace.com/claim?listing_id=${listing_id || ''}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    console.error('Portal session error:', error)
    return NextResponse.json(
      { error: 'Could not create portal session' },
      { status: 500 }
    )
  }
}
