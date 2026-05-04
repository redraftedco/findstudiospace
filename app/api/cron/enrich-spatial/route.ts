import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { safeEqual } from '@/lib/security'

/**
 * GET /api/cron/enrich-spatial
 *
 * Re-runs spatial enrichment for listings whose enrichment is stale or missing.
 * Calls enrich_listing_spatial() per listing rather than the bulk variant so
 * Vercel's 60s timeout is not a concern for incremental runs.
 *
 * Schedule: daily at 07:00, after geocode-listings (06:00) and ingest-gis (02:00 Mon).
 * Authorization: Bearer <CRON_SECRET>
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY!
const STALE_HOURS  = 25  // re-enrich if enrichment is older than this
const BATCH_SIZE   = 50

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || !safeEqual(req.headers.get('authorization') ?? '', `Bearer ${secret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createClient(SUPABASE_URL, SERVICE_KEY)

  // listings with no enrichment row or stale enrichment and a known geom
  const staleAfter = new Date(Date.now() - STALE_HOURS * 3600 * 1000).toISOString()
  const { data, error } = await db
    .from('listings')
    .select('id')
    .eq('status', 'active')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .or(`id.not.in.(select listing_id from listing_enrichment where last_enriched_at > '${staleAfter}')`)
    .limit(BATCH_SIZE)
    .returns<{ id: number }[]>()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const listings = data ?? []
  if (!listings.length) return NextResponse.json({ enriched: 0, message: 'nothing to enrich' })

  let enriched = 0
  let failed = 0
  for (const l of listings) {
    const { error: rpcErr } = await db.rpc('enrich_listing_spatial', { p_listing_id: l.id })
    if (rpcErr) { failed++ } else { enriched++ }
  }

  return NextResponse.json({ enriched, failed, total: listings.length })
}
