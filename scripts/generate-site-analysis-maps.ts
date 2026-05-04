/**
 * generate-site-analysis-maps.ts
 *
 * Generates Site Analysis Map SVGs for eligible listings and uploads them
 * to Supabase Storage. Reads from listing_enrichment — does NOT call GIS APIs.
 *
 * Usage:
 *   npx tsx scripts/generate-site-analysis-maps.ts
 *   npx tsx scripts/generate-site-analysis-maps.ts --listing-id=42
 *   npx tsx scripts/generate-site-analysis-maps.ts --limit=10
 *   npx tsx scripts/generate-site-analysis-maps.ts --force   (regenerate existing)
 *
 * Env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

import { createClient } from '@supabase/supabase-js'
import { buildSiteAnalysisData } from '../lib/maps/site-analysis/buildSiteAnalysisData'
import { renderSiteAnalysisMapSvg } from '../lib/maps/site-analysis/renderSiteAnalysisMap'
import { uploadSiteAnalysisMap } from '../lib/maps/site-analysis/uploadSiteAnalysisMap'
import type { SiteAnalysisMapData } from '../lib/maps/site-analysis/types'
import { SITE_ANALYSIS_MAP_VERSION, STORAGE_BUCKET } from '../lib/maps/site-analysis/constants'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://vnjsczhqhnzrplrdkolb.supabase.co'
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY
if (!SERVICE_KEY) { console.error('SUPABASE_SERVICE_KEY required'); process.exit(1) }

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

const args = process.argv.slice(2)
const singleId = args.find(a => a.startsWith('--listing-id='))?.split('=')[1]
const limitArg = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] ?? '50', 10)
const force = args.includes('--force')

async function checkBucket(): Promise<void> {
  const { data: buckets, error } = await db.storage.listBuckets()
  if (error) { console.error('Cannot list storage buckets:', error.message); process.exit(1) }
  const exists = buckets?.some(b => b.name === STORAGE_BUCKET)
  if (!exists) {
    console.error(`\nSTOP — Supabase Storage bucket "${STORAGE_BUCKET}" does not exist.`)
    console.error('Create it in the Supabase dashboard: Storage → New bucket')
    console.error(`  Name: ${STORAGE_BUCKET}`)
    console.error('  Public: yes')
    process.exit(1)
  }
}

async function fetchRows(listingId?: string) {
  const enrichSelect = [
    'listing_id', 'lat', 'lon', 'zoning_base', 'fema_flood_zone',
    'dist_to_max_meters', 'dist_to_bus_meters', 'business_district',
    'parking_permit_zone', 'landslide_hazard', 'wildfire_hazard',
    'last_enriched_at', 'site_analysis_map_status', 'site_analysis_map_version',
  ].join(',')

  const listingSelect = [
    'id', 'title', 'neighborhood', 'type', 'latitude', 'longitude',
    'ceiling_height_ft', 'niche_attributes',
  ].join(',')

  if (listingId) {
    const { data: listing } = await db.from('listings').select(listingSelect).eq('id', listingId).single()
    const { data: enrichment } = await db.from('listing_enrichment').select(enrichSelect).eq('listing_id', listingId).maybeSingle()
    return listing ? [{ listing: listing as unknown as Record<string, unknown>, enrichment: enrichment as unknown as Record<string, unknown> | null }] : []
  }

  // Fetch enriched active listings
  let enrichQuery = db
    .from('listing_enrichment')
    .select(enrichSelect)
    .not('lat', 'is', null)

  if (!force) {
    enrichQuery = enrichQuery.or(
      `site_analysis_map_status.is.null,site_analysis_map_version.neq.${SITE_ANALYSIS_MAP_VERSION}`
    )
  }

  const { data: rawEnrichments, error: eErr } = await enrichQuery.limit(limitArg)
  if (eErr) { console.error('Enrichment query error:', eErr.message); process.exit(1) }
  const enrichments = (rawEnrichments ?? []) as unknown as Array<Record<string, unknown>>
  if (!enrichments.length) return []

  const listingIds = enrichments.map(e => e.listing_id as number)
  const { data: rawListings, error: lErr } = await db
    .from('listings')
    .select(listingSelect)
    .in('id', listingIds)
    .eq('status', 'active')

  if (lErr) { console.error('Listings query error:', lErr.message); process.exit(1) }
  const listings = (rawListings ?? []) as unknown as Array<Record<string, unknown>>

  const listingMap = new Map(listings.map(l => [l.id as number, l]))
  return enrichments
    .filter(e => listingMap.has(e.listing_id as number))
    .map(e => ({ listing: listingMap.get(e.listing_id as number)!, enrichment: e }))
}

async function processOne(listing: Record<string, unknown>, enrichment: Record<string, unknown> | null): Promise<'generated' | 'skipped' | 'failed' | 'existing'> {
  const id = listing.id as number

  const result = buildSiteAnalysisData(
    listing as Parameters<typeof buildSiteAnalysisData>[0],
    enrichment as Parameters<typeof buildSiteAnalysisData>[1],
  )

  // buildSiteAnalysisData returns either SiteAnalysisMapData or SiteAnalysisGenerationResult
  if ('status' in result && result.status === 'skipped') {
    console.log(`  skip #${id}: ${result.skipReason}`)
    await db.from('listing_enrichment').update({
      site_analysis_map_status: 'skipped',
      site_analysis_map_error: result.skipReason ?? null,
      site_analysis_map_version: SITE_ANALYSIS_MAP_VERSION,
    }).eq('listing_id', id)
    return 'skipped'
  }

  const data = result as SiteAnalysisMapData

  try {
    const buffer = renderSiteAnalysisMapSvg(data)
    const url = await uploadSiteAnalysisMap(id, SITE_ANALYSIS_MAP_VERSION, buffer)

    await db.from('listing_enrichment').update({
      site_analysis_map_url: url,
      site_analysis_map_status: 'generated',
      site_analysis_map_version: SITE_ANALYSIS_MAP_VERSION,
      site_analysis_map_generated_at: new Date().toISOString(),
      site_analysis_map_error: null,
    }).eq('listing_id', id)

    console.log(`  ✓ #${id}: ${url.split('/').pop()}`)
    return 'generated'
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`  ✗ #${id}: ${msg}`)
    await db.from('listing_enrichment').update({
      site_analysis_map_status: 'failed',
      site_analysis_map_error: msg.slice(0, 200),
    }).eq('listing_id', id)
    return 'failed'
  }
}

async function main() {
  console.log('[site-analysis-maps] checking storage bucket…')
  await checkBucket()

  console.log(`[site-analysis-maps] fetching rows (force=${force}, limit=${limitArg})…`)
  const rows = await fetchRows(singleId)
  console.log(`[site-analysis-maps] ${rows.length} listings to process\n`)

  const counts = { generated: 0, skipped: 0, failed: 0 }

  for (const { listing, enrichment } of rows) {
    const result = await processOne(listing, enrichment as Record<string, unknown> | null)
    if (result !== 'existing') counts[result]++
  }

  console.log(`\n[site-analysis-maps] ✅ generated=${counts.generated} skipped=${counts.skipped} failed=${counts.failed}`)
}

main().catch(err => { console.error(err); process.exit(1) })
