import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { parsePositiveInt, rateLimit, getClientIp } from '@/lib/validation'

export async function GET(req: NextRequest) {
  const ip = getClientIp(req)
  const rl = rateLimit(`claim:${ip}`, { windowMs: 15 * 60 * 1000, maxRequests: 10 })
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    )
  }

  const { searchParams } = new URL(req.url)
  const listingId = parsePositiveInt(searchParams.get('listing_id'))

  if (!listingId) {
    return NextResponse.json(
      { error: 'Valid listing_id is required' },
      { status: 400 },
    )
  }

  const { data: listing, error: listingError } = await supabaseServer
    .from('listings')
    .select('id, title, neighborhood, type, status')
    .eq('id', listingId)
    .eq('status', 'active')
    .single()

  if (listingError || !listing) {
    return NextResponse.json(
      { error: 'Listing not found' },
      { status: 404 },
    )
  }

  const { count, error: countError } = await supabaseServer
    .from('lead_inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('listing_id', listingId)

  if (countError) {
    return NextResponse.json(
      { error: 'Failed to fetch inquiry count' },
      { status: 500 },
    )
  }

  return NextResponse.json({
    listing_id: listing.id,
    title: listing.title,
    neighborhood: listing.neighborhood,
    type: listing.type,
    inquiry_count: count ?? 0,
  })
}
