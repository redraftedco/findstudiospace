import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAuthClient } from '@/lib/supabase-auth'
import { supabaseServer } from '@/lib/supabase-server'
import { checkOrigin } from '@/lib/security'
import { PLACEMENT_TYPES, TARGET_TYPES, type PlacementType, type TargetType } from '@/lib/placements'

const PRICE_IDS: Record<string, string | undefined> = {
  featured_category:     process.env.STRIPE_PRICE_FEATURED_CATEGORY_ID,
  featured_neighborhood: process.env.STRIPE_PRICE_FEATURED_NEIGHBORHOOD_ID,
  featured_studio:       process.env.STRIPE_PRICE_FEATURED_STUDIO_ID,
}

const SITE_URL = 'https://www.findstudiospace.com'

type CheckoutBody = {
  listing_id: number
  placement_type: PlacementType
  target_type: TargetType
  target_slug: string
}

function parseCheckoutBody(body: unknown): CheckoutBody | null {
  if (!body || typeof body !== 'object') return null

  const raw = body as Record<string, unknown>
  const listingId = raw.listing_id
  const placementType = raw.placement_type
  const targetType = raw.target_type
  const targetSlug = raw.target_slug

  if (typeof listingId !== 'number' || !Number.isInteger(listingId) || listingId <= 0) return null
  if (typeof placementType !== 'string' || !PLACEMENT_TYPES.includes(placementType as PlacementType)) return null
  if (typeof targetType !== 'string' || !TARGET_TYPES.includes(targetType as TargetType)) return null
  if (typeof targetSlug !== 'string' || targetSlug.length < 1 || targetSlug.length > 100) return null

  return {
    listing_id: listingId,
    placement_type: placementType as PlacementType,
    target_type: targetType as TargetType,
    target_slug: targetSlug,
  }
}

export async function POST(req: NextRequest) {
  const originError = checkOrigin(req)
  if (originError) return originError

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = parseCheckoutBody(body)
  if (!parsed) {
    return NextResponse.json({ error: 'Invalid checkout request' }, { status: 400 })
  }

  const { listing_id, placement_type, target_type, target_slug } = parsed

  const auth = await createAuthClient()
  const { data: { user } } = await auth.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Sign in to manage this listing' }, { status: 401 })
  }

  const { data: listing } = await supabaseServer
    .from('listings')
    .select('id, owner_user_id')
    .eq('id', listing_id)
    .eq('status', 'active')
    .single()

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  if (listing.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'You do not own this listing' }, { status: 403 })
  }

  const priceId = PRICE_IDS[placement_type]
  if (!priceId) {
    return NextResponse.json({ error: 'Placement type unavailable' }, { status: 400 })
  }

  // Insert pending placement row first so placement_id exists to pass into
  // Stripe metadata — the webhook uses it to find and update this exact row.
  const { data: placement, error: insertError } = await supabaseServer
    .from('visibility_placements')
    .insert({
      listing_id,
      placement_type,
      target_type,
      target_slug,
      status: 'pending',
      stripe_price_id: priceId,
    })
    .select('id')
    .single()

  if (insertError || !placement) {
    console.error('visibility_placements insert error:', insertError)
    return NextResponse.json({ error: 'Could not create placement' }, { status: 500 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        placement_id:   String(placement.id),
        listing_id:     String(listing_id),
        placement_type,
        target_type,
        target_slug,
      },
      success_url: `${SITE_URL}/listing/${listing_id}?placement=success`,
      cancel_url:  `${SITE_URL}/advertise?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    // Remove the pending row so it doesn't accumulate on retries
    await supabaseServer.from('visibility_placements').delete().eq('id', placement.id)
    return NextResponse.json({ error: 'Could not start checkout' }, { status: 500 })
  }
}
