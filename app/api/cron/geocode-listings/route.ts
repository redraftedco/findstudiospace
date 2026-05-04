import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { safeEqual } from '@/lib/security'

/**
 * GET /api/cron/geocode-listings
 *
 * Geocodes listings that have no lat/lon using Nominatim (OSM).
 * Since all listings are Craigslist scrapes with no street addresses,
 * geocodes in three tiers:
 *   1. Street/intersection extracted from title ("SE Belmont", "11th & Flanders")
 *   2. Neighborhood centroid (hardcoded Portland neighborhood coords)
 *   3. Nominatim query on neighborhood name
 *
 * Rate: 1 req/sec (Nominatim policy). Processes up to BATCH_SIZE per run.
 * After geocoding, calls enrich_listing_spatial() for each updated listing.
 * Authorization: Bearer <CRON_SECRET>
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY!
const NOMINATIM    = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT   = 'findstudiospace-geocoder/1.0 (Portland studio directory)'
const BATCH_SIZE   = 30  // 30 listings × 1 req/sec = ~30s, well under Vercel 60s limit

const CENTROIDS: Record<string, [number, number]> = {
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
  /(\d{3,5}\s+[A-Z][a-z]+\s+(?:Ave|St|Blvd|Dr|Rd|Way|Pl))/i,
]

function extractStreet(title: string): string | null {
  for (const p of STREET_PATTERNS) {
    const m = title.match(p)
    if (m) return m[1]
  }
  return null
}

async function nominatim(query: string): Promise<{ lat: number; lon: number } | null> {
  const url = new URL(NOMINATIM)
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')
  url.searchParams.set('countrycodes', 'us')
  url.searchParams.set('viewbox', '-122.8360,45.4200,-122.4700,45.6500')
  url.searchParams.set('bounded', '0')
  try {
    const r = await fetch(url.toString(), {
      headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'en' },
      signal: AbortSignal.timeout(8_000),
    })
    if (!r.ok) return null
    const d = await r.json() as Array<{ lat: string; lon: string }>
    return d.length ? { lat: parseFloat(d[0].lat), lon: parseFloat(d[0].lon) } : null
  } catch { return null }
}

type ListingRow = { id: number; title: string | null; neighborhood: string | null }

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || !safeEqual(req.headers.get('authorization') ?? '', `Bearer ${secret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createClient(SUPABASE_URL, SERVICE_KEY)

  const { data, error } = await db
    .from('listings')
    .select('id, title, neighborhood')
    .eq('status', 'active')
    .or('latitude.is.null,longitude.is.null')
    .order('created_at', { ascending: true })
    .limit(BATCH_SIZE)
    .returns<ListingRow[]>()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const listings = data ?? []
  if (!listings.length) return NextResponse.json({ geocoded: 0, message: 'nothing to geocode' })

  let street = 0, neighborhood = 0, failed = 0

  for (const l of listings) {
    const title = l.title ?? ''
    const hood  = (l.neighborhood ?? '').toLowerCase().trim()
    let lat: number | null = null
    let lon: number | null = null
    let tier = 'failed'

    const streetHint = extractStreet(title)
    if (streetHint) {
      const r = await nominatim(`${streetHint}, Portland, OR`)
      await sleep(1100)
      if (r) { lat = r.lat; lon = r.lon; tier = 'street' }
    }

    if (lat === null && CENTROIDS[hood]) {
      ;[lat, lon] = CENTROIDS[hood]
      tier = 'neighborhood'
    }

    if (lat === null && l.neighborhood) {
      const r = await nominatim(`${l.neighborhood}, Portland, OR, USA`)
      await sleep(1100)
      if (r) { lat = r.lat; lon = r.lon; tier = 'neighborhood' }
    }

    if (lat === null || lon === null) { failed++; continue }

    if (tier === 'street') { street++ } else { neighborhood++ }

    await db.from('listings').update({ latitude: lat, longitude: lon }).eq('id', l.id)
    await db.rpc('exec_sql' as never, {
      sql: `UPDATE public.listings SET geom = ST_SetSRID(ST_MakePoint(${lon},${lat}),4326) WHERE id = ${l.id}`
    } as never)
    await db.rpc('enrich_listing_spatial', { p_listing_id: l.id })
  }

  return NextResponse.json({ geocoded: street + neighborhood, street, neighborhood, failed, total: listings.length })
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}
