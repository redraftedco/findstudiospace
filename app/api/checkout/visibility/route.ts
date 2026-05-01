import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { stripe } from '@/lib/stripe'
import { supabaseServer } from '@/lib/supabase-server'
import { checkOrigin } from '@/lib/security'
import { PLACEMENT_TYPES, TARGET_TYPES } from '@/lib/placements'

const PRICE_IDS: Record<string, string | undefined> = {
  featured_category:     process.env.STRIPE_PRICE_FEATURED_CATEGORY_ID,
  featured_neighborhood: process.env.STRIPE_PRICE_FEATURED_NEIGHBORHOOD_ID,
  featured_studio:       process.env.STRIPE_PRICE_FEATURED_STUDIO_ID,
}

const BodySchema = z.object({
  listing_id:     z.number().int().positive(),
  placement_type: z.enum(PLACEMENT_TYPES),
  target_type:    z.enum(TARGET_TYPES),
  target_slug:    z.string().min(1).max(100),
})

const SITE_URL = 'https://www.findstudiospace.com'

export async function POST(req: NextRequest) {
  const originError = checkOrigin(req)
  if (originError) return originError

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { listing_id, placement_type, target_type, target_slug } = parsed.data

  // Confirm listing exists and is active before creating anything in Stripe
  const { data: listing } = await supabaseServer
    .from('listings')
    .select('id')
    .eq('id', listing_id)
    .eq('status', 'active')
    .single()

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
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
