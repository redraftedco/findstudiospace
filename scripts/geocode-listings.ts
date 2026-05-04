/**
 * geocode-listings.ts
 *
 * Geocodes studio listings using Nominatim (OSM). Multi-city aware.
 *
 * Three-tier strategy:
 *   1. Extract street/intersection hint from neighborhood field (actual address)
 *      or title pattern
 *   2. Neighborhood centroid (~500m accuracy, no network call)
 *   3. Nominatim query on neighborhood name + city
 *
 * Nominatim policy: 1 req/sec max, real User-Agent.
 *
 * Usage:
 *   npx tsx scripts/geocode-listings.ts                  # all cities, missing only
 *   npx tsx scripts/geocode-listings.ts --city=Atlanta   # specific city
 *   npx tsx scripts/geocode-listings.ts --dry-run
 *   npx tsx scripts/geocode-listings.ts --all            # re-geocode even if set
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
const NOMINATIM  = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'findstudiospace-geocoder/1.0 (Portland studio directory; contact@findstudiospace.com)'

const isDryRun = process.argv.includes('--dry-run')
const reGeoAll = process.argv.includes('--all')
const cityArg  = (process.argv.find(a => a.startsWith('--city=')) ?? '').replace('--city=', '') || null

// City config: display name, state abbr, Nominatim viewbox [minLon, minLat, maxLon, maxLat]
const CITY_META: Record<string, { state: string; viewbox: string }> = {
  portland: { state: 'OR', viewbox: '-122.8360,45.4200,-122.4700,45.6500' },
  seattle:  { state: 'WA', viewbox: '-122.5500,47.4800,-122.2200,47.7400' },
  atlanta:  { state: 'GA', viewbox: '-84.5500,33.6000,-84.2000,34.0000' },
}

const NEIGHBORHOOD_CENTROIDS: Record<string, [number, number]> = {
  'pearl district':        [45.5290, -122.6823],
  'pearl':                 [45.5290, -122.6823],
  'central eastside':      [45.5199, -122.6558],
  'ne portland':           [45.5436, -122.6254],
  'nw portland':           [45.5300, -122.6940],
  'se portland':           [45.5001, -122.6399],
  'n portland':            [45.5680, -122.6774],
  'alberta arts':          [45.5597, -122.6476],
  'alberta arts district': [45.5597, -122.6476],
  'division':              [45.5005, -122.6308],
  'se division':           [45.5005, -122.6308],
  'mississippi':           [45.5618, -122.6763],
  'n mississippi':         [45.5618, -122.6763],
  'sellwood':              [45.4734, -122.6541],
  'slabtown':              [45.5255, -122.6893],
  'goose hollow':          [45.5183, -122.6918],
  'downtown':              [45.5231, -122.6765],
  'kerns':                 [45.5241, -122.6481],
  'st johns':              [45.5950, -122.7538],
  'st. johns':             [45.5950, -122.7538],
  'boise':                 [45.5544, -122.6790],
  'richmond':              [45.5065, -122.6370],
  'buckman':               [45.5200, -122.6540],
  'sunnyside':             [45.5060, -122.6280],
  'hawthorne':             [45.5114, -122.6355],
  'belmont':               [45.5160, -122.6350],
  'clinton':               [45.4990, -122.6350],
  'concordia':             [45.5616, -122.6236],
  'woodstock':             [45.4840, -122.6274],
  'oak grove':             [45.4145, -122.6344],
  'milwaukie':             [45.4473, -122.6390],
}

const STREET_PATTERNS = [
  /(\d{1,5}(?:st|nd|rd|th)?\s+(?:&|and)\s+[A-Z][a-z]+)/i,
  /([NS][EW]?\s+\d{1,5}(?:st|nd|rd|th)?)/i,
  /([NS][EW]\s+[A-Z][a-z]+(?:\s+(?:Ave|Blvd|St|Dr|Rd|Pl|Ct))?)/i,
  /(\d{3,5}\s+[NS][EW]\s+[A-Z][a-z]+)/i,
  /(\d{3,5}\s+[A-Z][a-z]+\s+(?:Ave|St|Blvd|Dr|Rd|Way|Pl))/i,
]

function cityLabel(city: string): string {
  const meta = CITY_META[city.toLowerCase()]
  return meta ? `${city}, ${meta.state}` : city
}

function buildNominatimQuery(title: string, neighborhood: string | null, city: string): string[] {
  const label = cityLabel(city)
  // If neighborhood looks like a real address (has digits), use it directly
  if (neighborhood && /\d/.test(neighborhood)) {
    // Strip "near ..." suffix
    const addr = neighborhood.replace(/\s+near\s+.*/i, '').trim()
    return [`${addr}, ${label}, USA`]
  }
  for (const pattern of STREET_PATTERNS) {
    const match = title.match(pattern)
    if (match) return [`${match[1]}, ${label}`, `${match[1]}, ${label}, USA`]
  }
  if (neighborhood) {
    const norm = neighborhood.toLowerCase().trim()
    if (NEIGHBORHOOD_CENTROIDS[norm]) return []
    return [`${neighborhood}, ${label}, USA`]
  }
  return [`${label}, USA`]
}

function getNeighborhoodCentroid(neighborhood: string | null): [number, number] | null {
  if (!neighborhood) return null
  return NEIGHBORHOOD_CENTROIDS[neighborhood.toLowerCase().trim()] ?? null
}

type GeoResult = { lat: number; lon: number; tier: 'street' | 'neighborhood' | 'city' }

async function geocodeNominatim(query: string, viewbox?: string): Promise<{ lat: number; lon: number } | null> {
  const url = new URL(NOMINATIM)
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')
  url.searchParams.set('countrycodes', 'us')
  if (viewbox) url.searchParams.set('viewbox', viewbox)
  url.searchParams.set('bounded', '0')
  try {
    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'en' },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    const data = await res.json() as Array<{ lat: string; lon: string }>
    return data.length ? { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) } : null
  } catch { return null }
}

async function resolveGeoResult(title: string, neighborhood: string | null, city: string): Promise<GeoResult | null> {
  const meta = CITY_META[city.toLowerCase()]
  const viewbox = meta?.viewbox
  const queries = buildNominatimQuery(title, neighborhood, city)

  for (const q of queries) {
    const result = await geocodeNominatim(q, viewbox)
    await sleep(1100)
    if (result) return { ...result, tier: 'street' }
  }

  const centroid = getNeighborhoodCentroid(neighborhood)
  if (centroid) return { lat: centroid[0], lon: centroid[1], tier: 'neighborhood' }

  if (neighborhood && !queries.some(q => q.includes(neighborhood))) {
    const result = await geocodeNominatim(`${neighborhood}, ${cityLabel(city)}, USA`, viewbox)
    await sleep(1100)
    if (result) return { ...result, tier: 'neighborhood' }
  }

  return null
}

type ListingRow = { id: number; title: string | null; neighborhood: string | null; city: string | null }

async function main() {
  let query = db.from('listings').select('id, title, neighborhood, city').eq('status', 'active')
  if (!reGeoAll) query = query.or('latitude.is.null,longitude.is.null')
  if (cityArg) query = (query as ReturnType<typeof query.eq>).ilike('city', cityArg)

  const { data, error } = await query.returns<ListingRow[]>()
  if (error) { console.error('DB error:', error.message); process.exit(1) }

  const listings = data ?? []
  const cityLabel2 = cityArg ? ` for ${cityArg}` : ' (all cities)'
  console.log(`[geocode] ${listings.length} listings to geocode${cityLabel2}${isDryRun ? ' (dry-run)' : ''}`)
  if (!listings.length) { console.log('[geocode] nothing to do'); return }

  const stats = { street: 0, neighborhood: 0, city: 0, failed: 0 }

  for (const listing of listings) {
    const city = listing.city ?? 'Portland'
    const result = await resolveGeoResult(listing.title ?? '', listing.neighborhood, city)
    if (!result) {
      console.log(`  ✗ #${listing.id}: ${(listing.title ?? '').slice(0, 50)} — no match`)
      stats.failed++
      continue
    }
    console.log(`  ✓ #${listing.id} [${result.tier}]: ${result.lat.toFixed(4)},${result.lon.toFixed(4)} — ${(listing.title ?? '').slice(0, 40)}`)
    stats[result.tier]++

    if (!isDryRun) {
      await db.from('listings').update({ latitude: result.lat, longitude: result.lon }).eq('id', listing.id)
      await db.rpc('exec_sql' as never, {
        sql: `UPDATE public.listings SET geom = ST_SetSRID(ST_MakePoint(${result.lon},${result.lat}),4326) WHERE id = ${listing.id}`
      } as never)
      await db.rpc('enrich_listing_spatial', { p_listing_id: listing.id })
    }
  }

  console.log(`\n[geocode] ✅ street=${stats.street} neighborhood=${stats.neighborhood} city=${stats.city} failed=${stats.failed}`)
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

main().catch(err => { console.error(err); process.exit(1) })
