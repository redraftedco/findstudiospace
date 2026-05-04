/**
 * enrich-spatial.ts
 *
 * Runs spatial enrichment for all geocoded Portland listings by calling
 * the enrich_listing_spatial() PostGIS function for each. Populates the
 * listing_enrichment table with zoning, noise, flood, transit, etc.
 *
 * Run this AFTER:
 *   1. ingest-gis-layers.ts  (loads GIS overlay tables)
 *   2. geocode-listings.ts   (sets listings.geom)
 *
 * Usage:
 *   npx tsx scripts/enrich-spatial.ts
 *   npx tsx scripts/enrich-spatial.ts --listing-id 42   (single listing)
 *   npx tsx scripts/enrich-spatial.ts --stale 7         (re-enrich >7 days old)
 *
 * Env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://vnjsczhqhnzrplrdkolb.supabase.co'
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY
if (!SERVICE_KEY) { console.error('SUPABASE_SERVICE_KEY required'); process.exit(1) }

const db = createClient(SUPABASE_URL, SERVICE_KEY)

const args = process.argv.slice(2)
const singleId    = args.find(a => a.startsWith('--listing-id='))?.split('=')[1]
const staleDays   = parseInt(args.find(a => a.startsWith('--stale='))?.split('=')[1] ?? '0', 10)

async function main() {
  if (singleId) {
    console.log(`[enrich-spatial] enriching listing ${singleId}`)
    const { error } = await db.rpc('enrich_listing_spatial', { p_listing_id: parseInt(singleId, 10) })
    if (error) { console.error(error.message); process.exit(1) }
    console.log('[enrich-spatial] ✅ done')
    return
  }

  // Bulk: call enrich_all_listings_spatial which loops in Postgres
  console.log('[enrich-spatial] running bulk spatial enrichment via enrich_all_listings_spatial()…')
  const { data, error } = await db.rpc('enrich_all_listings_spatial')
  if (error) {
    console.error('[enrich-spatial] bulk function error:', error.message)
    // Fallback: do it row by row from Node
    await enrichRowByRow(staleDays)
    return
  }

  const result = Array.isArray(data) ? data[0] : data
  console.log(`[enrich-spatial] ✅ enriched=${result?.enriched ?? '?'} skipped=${result?.skipped ?? '?'}`)
}

async function enrichRowByRow(staleDays: number): Promise<void> {
  console.log('[enrich-spatial] falling back to row-by-row enrichment')

  // Listings that are geocoded
  const { data, error } = await db
    .from('listings')
    .select('id')
    .eq('status', 'active')
    .not('latitude', 'is', null)
  if (error) { console.error(error.message); return }

  let ids = (data ?? []).map(r => r.id)

  // Skip listings whose enrichment is fresh (last_enriched_at lives on listing_enrichment)
  if (staleDays > 0 && ids.length > 0) {
    const cutoff = new Date(Date.now() - staleDays * 86400_000).toISOString()
    const { data: freshRows } = await db
      .from('listing_enrichment')
      .select('listing_id')
      .in('listing_id', ids)
      .gt('last_enriched_at', cutoff)
    const freshSet = new Set((freshRows ?? []).map(r => r.listing_id))
    ids = ids.filter(id => !freshSet.has(id))
  }

  const listings = ids.map(id => ({ id }))
  console.log(`  ${listings.length} listings to enrich`)

  let enriched = 0
  for (const row of listings) {
    const { error: e } = await db.rpc('enrich_listing_spatial', { p_listing_id: row.id })
    if (e) console.warn(`  listing ${row.id}: ${e.message}`)
    else enriched++

    if (enriched % 20 === 0) process.stdout.write(`  ${enriched}/${listings.length}…\r`)
  }

  console.log(`\n[enrich-spatial] ✅ enriched ${enriched}/${listings.length}`)
}

main().catch(err => { console.error(err); process.exit(1) })
