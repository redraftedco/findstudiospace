import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { checkOrigin } from '@/lib/security'
import { createAuthClient } from '@/lib/supabase-auth'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const originError = checkOrigin(req)
  if (originError) return originError

  try {
    const { listing_id } = await req.json()

    const id = parseInt(listing_id, 10)
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: 'Valid listing_id required' }, { status: 400 })
    }

    const auth = await createAuthClient()
    const { data: { user } } = await auth.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Sign in to manage billing' }, { status: 401 })
    }

    // Look up customer ID server-side — never accept it from the client
    const { data: listing } = await supabaseServer
      .from('listings')
      .select('stripe_customer_id, owner_user_id')
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (listing?.owner_user_id !== user.id) {
      return NextResponse.json({ error: 'You do not own this listing' }, { status: 403 })
    }

    if (!listing?.stripe_customer_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: listing.stripe_customer_id,
      return_url: `https://www.findstudiospace.com/claim?listing_id=${id}`,
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
