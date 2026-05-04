/**
 * geocode-listings.ts
 *
 * Geocodes Portland studio listings using Nominatim (OSM) since listings have
 * no street addresses — only titles and neighborhoods from Craigslist scrapes.
 *
 * Strategy (three tiers, in order):
 *   1. Extract Portland street/intersection hints from the title
 *      ("SE Belmont", "11th & Flanders", "NW 23rd Ave") → precise geocode
 *   2. Neighborhood name → neighborhood centroid (~500m accuracy)
 *   3. Portland, OR → city centroid (last resort)
 *
 * Nominatim policy: 1 req/sec max, real User-Agent, cache every result.
 * At 1 req/sec, 119 listings takes ~2 min.
 *
 * After geocoding, updates listings.latitude, listings.longitude, listings.geom
 * and calls enrich_listing_spatial() for each updated listing.
 *
 * Usage:
 *   npx tsx scripts/geocode-listings.ts
 *   npx tsx scripts/geocode-listings.ts --dry-run
 *   npx tsx scripts/geocode-listings.ts --all   (re-geocode even if lat/lon set)
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
const NOMINATIM = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'findstudiospace-geocoder/1.0 (Portland studio directory; contact@findstudiospace.com)'

const isDryRun = process.argv.includes('--dry-run')
const reGeoAll = process.argv.includes('--all')

// ---------------------------------------------------------------------------
// Portland neighborhood centroids — fallback when Nominatim fails
// Coordinates are representative centroids, not official boundaries.
// ---------------------------------------------------------------------------
const NEIGHBORHOOD_CENTROIDS: Record<string, [number, number]> = {
  'pearl district':     [45.5290, -122.6823],
  'pearl':              [45.5290, -122.6823],
  'central eastside':   [45.5199, -122.6558],
  'ne portland':        [45.5436, -122.6254],
  'nw portland':        [45.5300, -122.6940],
  'se portland':        [45.5001, -122.6399],
  'n portland':         [45.5680, -122.6774],
  'alberta arts':       [45.5597, -122.6476],
  'alberta arts district': [45.5597, -122.6476],
  'division':           [45.5005, -122.6308],
  'se division':        [45.5005, -122.6308],
  'mississippi':        [45.5618, -122.6763],
  'n mississippi':      [45.5618, -122.6763],
  'sellwood':           [45.4734, -122.6541],
  'slabtown':           [45.5255, -122.6893],
  'goose hollow':       [45.5183, -122.6918],
  'downtown':           [45.5231, -122.6765],
  'kerns':              [45.5241, -122.6481],
  'st johns':           [45.5950, -122.7538],
  'st. johns':          [45.5950, -122.7538],
  'boise':              [45.5544, -122.6790],
  'richmond':           [45.5065, -122.6370],
  'buckman':            [45.5200, -122.6540],
  'sunnyside':          [45.5060, -122.6280],
  'hawthorne':          [45.5114, -122.6355],
  'belmont':            [45.5160, -122.6350],
  'clinton':            [45.4990, -122.6350],
  'concordia':          [45.5616, -122.6236],
  'woodstock':          [45.4840, -122.6274],
  'oak grove':          [45.4145, -122.6344],
  'milwaukie':          [45.4473, -122.6390],
}

// ---------------------------------------------------------------------------
// Extract best Nominatim query from listing title + neighborhood
// ---------------------------------------------------------------------------

// Patterns that indicate a real Portland street reference in the title
const STREET_PATTERNS = [
  /(\d{1,5}(?:st|nd|rd|th)?\s+(?:&|and)\s+[A-Z][a-z]+)/i,  // "11th & Flanders"
  /([NS][EW]?\s+\d{1,5}(?:st|nd|rd|th)?)/i,                  // "NE 23rd"
  /([NS][EW]\s+[A-Z][a-z]+(?:\s+(?:Ave|Blvd|St|Dr|Rd|Pl|Ct))?)/i, // "SE Belmont", "SW Broadway"
  /(\d{3,5}\s+[NS][EW]\s+[A-Z][a-z]+)/i,                     // "1234 NE Broadway"
  /(\d{3,5}\s+[A-Z][a-z]+\s+(?:Ave|St|Blvd|Dr|Rd|Way|Pl))/i, // "1234 Main St"
]

function buildNominatimQuery(title: string, neighborhood: string | null): string[] {
  // Tier 1: try to extract a street reference from the title
  for (const pattern of STREET_PATTERNS) {
    const match = title.match(pattern)
    if (match) {
      return [`${match[1]}, Portland, OR`, `${match[1]}, Portland, Oregon, USA`]
    }
  }

  // Tier 2: neighborhood centroid query
  if (neighborhood) {
    const norm = neighborhood.toLowerCase().trim()
    if (NEIGHBORHOOD_CENTROIDS[norm]) {
      return [] // handled separately — no network call needed
    }
    return [`${neighborhood}, Portland, OR, USA`]
  }

  return ['Portland, OR, USA']
}

function getNeighborhoodCentroid(neighborhood: string | null): [number, number] | null {
  if (!neighborhood) return null
  const norm = neighborhood.toLowerCase().trim()
  return NEIGHBORHOOD_CENTROIDS[norm] ?? null
}

// ---------------------------------------------------------------------------
// Nominatim geocode — 1 req/sec
// ---------------------------------------------------------------------------

type GeoResult = { lat: number; lon: number; tier: 'street' | 'neighborhood' | 'city' }

async function geocodeNominatim(query: string): Promise<{ lat: number; lon: number } | null> {
  const url = new URL(NOMINATIM)
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')
  url.searchParams.set('countrycodes', 'us')
  url.searchParams.set('viewbox', '-122.8360,45.4200,-122.4700,45.6500') // Portland bounding box
  url.searchParams.set('bounded', '0')

  try {
    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'en' },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    const data = await res.json() as Array<{ lat: string; lon: string }>
    if (!data.length) return null
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
  } catch {
    return null
  }
}

async function resolveGeoResult(
  title: string,
  neighborhood: string | null,
): Promise<GeoResult | null> {
  const queries = buildNominatimQuery(title, neighborhood)

  // Tier 1: street-level Nominatim
  for (const q of queries) {
    const result = await geocodeNominatim(q)
    await sleep(1100) // Nominatim 1 req/sec
    if (result) return { ...result, tier: 'street' }
  }

  // Tier 2: neighborhood centroid (no network call)
  const centroid = getNeighborhoodCentroid(neighborhood)
  if (centroid) return { lat: centroid[0], lon: centroid[1], tier: 'neighborhood' }

  // Tier 3: neighborhood Nominatim query
  if (neighborhood && queries.length > 0) {
    // already tried above; if all failed, try one more time with just neighborhood
    const result = await geocodeNominatim(`${neighborhood}, Portland, OR, USA`)
    await sleep(1100)
    if (result) return { ...result, tier: 'neighborhood' }
  }

  return null
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

type ListingRow = { id: number; title: string | null; neighborhood: string | null }

async function main() {
  let query = db
    .from('listings')
    .select('id, title, neighborhood')
    .eq('status', 'active')

  if (!reGeoAll) {
    query = query.or('latitude.is.null,longitude.is.null')
  }

  const { data, error } = await query.returns<ListingRow[]>()
  if (error) { console.error('DB error:', error.message); process.exit(1) }

  const listings = data ?? []
  console.log(`[geocode] ${listings.length} listings to geocode${isDryRun ? ' (dry-run)' : ''}`)
  if (!listings.length) { console.log('[geocode] nothing to do'); return }

  const stats = { street: 0, neighborhood: 0, city: 0, failed: 0 }

  for (const listing of listings) {
    const title = listing.title ?? ''
    const result = await resolveGeoResult(title, listing.neighborhood)

    if (!result) {
      console.log(`  ✗ #${listing.id}: ${title.slice(0, 50)} — no match`)
      stats.failed++
      continue
    }

    console.log(`  ✓ #${listing.id} [${result.tier}]: ${result.lat.toFixed(4)},${result.lon.toFixed(4)} — ${title.slice(0, 40)}`)
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
