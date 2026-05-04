/**
 * geocode-listings.ts
 *
 * Geocodes listings that have an address but no lat/lon using:
 *   1. U.S. Census Batch Geocoder (free, 10k/batch, no key)
 *   2. Nominatim (OSM) fallback — 1 req/sec, for Census failures only
 *
 * After geocoding, updates listings.latitude, listings.longitude, and
 * listings.geom (PostGIS POINT) in Supabase, then calls
 * enrich_listing_spatial() for each newly geocoded listing.
 *
 * Usage:
 *   npx tsx scripts/geocode-listings.ts
 *   npx tsx scripts/geocode-listings.ts --dry-run    (print only, no writes)
 *   npx tsx scripts/geocode-listings.ts --all        (re-geocode everything)
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

const CENSUS_GEOCODER = 'https://geocoding.geo.census.gov/geocoder/locations/addressbatch'
const NOMINATIM_BASE  = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT      = 'findstudiospace-geocoder/1.0 (Portland studio directory; contact@findstudiospace.com)'

const isDryRun = process.argv.includes('--dry-run')
const reGeoAll = process.argv.includes('--all')

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ListingRow = {
  id: number
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  latitude: number | null
  longitude: number | null
}

type GeoResult = {
  id: number
  lat: number
  lon: number
  source: 'census' | 'nominatim'
  matchType?: string
}

// ---------------------------------------------------------------------------
// 1. Census batch geocoder
// ---------------------------------------------------------------------------

async function geocodeCensusBatch(listings: ListingRow[]): Promise<Map<number, GeoResult>> {
  const results = new Map<number, GeoResult>()
  if (listings.length === 0) return results

  // Build CSV: Unique ID, Street, City, State, ZIP
  const rows = listings.map(l => {
    const street = (l.address ?? '').replace(/,/g, ' ')
    const city   = (l.city   ?? 'Portland').replace(/,/g, ' ')
    const state  = l.state ?? 'OR'
    const zip    = l.zip_code ?? ''
    return `${l.id},"${street}","${city}","${state}","${zip}"`
  })
  const csvBody = rows.join('\n')

  console.log(`  Census batch: submitting ${listings.length} addresses…`)

  const form = new FormData()
  form.append('addressFile', new Blob([csvBody], { type: 'text/plain' }), 'addresses.csv')
  form.append('benchmark', 'Public_AR_Current')
  form.append('returntype', 'locations')

  try {
    const res = await fetch(CENSUS_GEOCODER, {
      method: 'POST',
      headers: { 'User-Agent': USER_AGENT },
      body: form,
      signal: AbortSignal.timeout(120_000), // Census can be slow on large batches
    })
    if (!res.ok) throw new Error(`Census HTTP ${res.status}`)

    const text = await res.text()
    for (const line of text.split('\n')) {
      const parts = line.split(',')
      // Response columns: ID, input_address, match, matchType, outputAddress, lon,lat, ...
      if (parts.length < 7) continue
      const id      = parseInt(parts[0], 10)
      const match   = (parts[2] ?? '').trim().toLowerCase()
      const lonStr  = parts[5] ?? ''
      const latStr  = parts[6] ?? ''

      if (match !== 'match') continue
      if (isNaN(id)) continue

      const lon = parseFloat(lonStr.replace(/"/g, ''))
      const lat = parseFloat(latStr.replace(/"/g, ''))
      if (isNaN(lat) || isNaN(lon)) continue

      results.set(id, { id, lat, lon, source: 'census', matchType: parts[3]?.trim() })
    }

    console.log(`  Census: matched ${results.size}/${listings.length}`)
  } catch (err) {
    console.warn('  Census batch error:', err instanceof Error ? err.message : err)
  }

  return results
}

// ---------------------------------------------------------------------------
// 2. Nominatim fallback (1 req/sec, cache misses from Census)
// ---------------------------------------------------------------------------

async function geocodeNominatim(listing: ListingRow): Promise<GeoResult | null> {
  const query = [
    listing.address,
    listing.city ?? 'Portland',
    listing.state ?? 'OR',
    'USA',
  ].filter(Boolean).join(', ')

  const url = new URL(NOMINATIM_BASE)
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')
  url.searchParams.set('countrycodes', 'us')

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept-Language': 'en',
      },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null

    const data = await res.json() as Array<{ lat: string; lon: string }>
    if (!data.length) return null

    return {
      id: listing.id,
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      source: 'nominatim',
    }
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// 3. Write geocoded coordinates to DB
// ---------------------------------------------------------------------------

async function persistGeoResult(result: GeoResult): Promise<void> {
  if (isDryRun) {
    console.log(`  [dry-run] listing ${result.id}: lat=${result.lat}, lon=${result.lon} (${result.source})`)
    return
  }

  const { error: updateErr } = await db.from('listings').update({
    latitude:  result.lat,
    longitude: result.lon,
  }).eq('id', result.id)

  if (updateErr) {
    console.warn(`  listing ${result.id}: update error`, updateErr.message)
    return
  }

  // Update PostGIS geom column
  await db.rpc('exec_sql' as never, {
    sql: `UPDATE public.listings SET geom = ST_SetSRID(ST_MakePoint(${result.lon}, ${result.lat}), 4326) WHERE id = ${result.id}`
  } as never)

  // Trigger spatial enrichment now that we have a geom
  await db.rpc('enrich_listing_spatial', { p_listing_id: result.id })
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Fetch listings that need geocoding
  let query = db
    .from('listings')
    .select('id, address, city, state, zip_code, latitude, longitude')
    .eq('status', 'active')
    .not('address', 'is', null)

  if (!reGeoAll) {
    query = query.or('latitude.is.null,longitude.is.null')
  }

  const { data, error } = await query.returns<ListingRow[]>()
  if (error) { console.error('DB fetch error:', error.message); process.exit(1) }

  const listings = data ?? []
  console.log(`[geocode] ${listings.length} listings to geocode${isDryRun ? ' (dry-run)' : ''}`)
  if (listings.length === 0) { console.log('[geocode] nothing to do'); return }

  // Process in batches of 1000 (Census limit per call is 10k but smaller = faster)
  const CENSUS_BATCH = 1000
  const allResults = new Map<number, GeoResult>()

  for (let i = 0; i < listings.length; i += CENSUS_BATCH) {
    const batch = listings.slice(i, i + CENSUS_BATCH)
    const censusResults = await geocodeCensusBatch(batch)
    censusResults.forEach((v, k) => allResults.set(k, v))
    if (i + CENSUS_BATCH < listings.length) await sleep(2000)
  }

  // Nominatim fallback for Census misses — 1 req/sec
  const missed = listings.filter(l => !allResults.has(l.id))
  console.log(`\n[geocode] Nominatim fallback for ${missed.length} unmatched addresses`)
  for (const listing of missed) {
    const result = await geocodeNominatim(listing)
    if (result) {
      allResults.set(listing.id, result)
      console.log(`  ✓ listing ${listing.id} (nominatim)`)
    } else {
      console.log(`  ✗ listing ${listing.id}: no match`)
    }
    await sleep(1100) // 1 req/sec per Nominatim policy
  }

  // Persist results
  console.log(`\n[geocode] Persisting ${allResults.size} geocoded results…`)
  let saved = 0
  for (const result of allResults.values()) {
    await persistGeoResult(result)
    saved++
  }

  console.log(`[geocode] ✅ complete — ${saved} listings geocoded`)
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

main().catch(err => { console.error(err); process.exit(1) })
