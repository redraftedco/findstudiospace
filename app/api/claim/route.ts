import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const listing_id = searchParams.get('listing_id')

  if (!listing_id || isNaN(parseInt(listing_id))) {
    return NextResponse.json(
      { error: 'Valid listing_id is required' },
      { status: 400 }
    )
  }

  // Get the listing
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id, title, neighborhood, type, status')
    .eq('id', parseInt(listing_id))
    .eq('status', 'active')
    .single()

  if (listingError || !listing) {
    return NextResponse.json(
      { error: 'Listing not found' },
      { status: 404 }
    )
  }

  // Count inquiries for this listing
  const { count, error: countError } = await supabase
    .from('lead_inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('listing_id', parseInt(listing_id))

  if (countError) {
    return NextResponse.json(
      { error: 'Failed to fetch inquiry count' },
      { status: 500 }
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
