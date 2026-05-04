import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { safeEqual } from '@/lib/security'

/**
 * GET /api/cron/geocode-listings
 *
 * Geocodes up to BATCH_SIZE listings per run using the U.S. Census batch
 * geocoder (free, no key). Processes listings with null lat/lon, oldest-first.
 * Falls back to Nominatim for Census misses (1 req/sec).
 *
 * After geocoding, calls enrich_listing_spatial() for each updated listing.
 * Authorization: Bearer <CRON_SECRET>
 */

const SUPABASE_URL    = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY     = process.env.SUPABASE_SERVICE_KEY!
const CENSUS_GEOCODER = 'https://geocoding.geo.census.gov/geocoder/locations/addressbatch'
const NOMINATIM_BASE  = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT      = 'findstudiospace-geocoder/1.0 (Portland studio directory)'
const BATCH_SIZE      = 100

type ListingRow = { id: number; address: string | null; city: string | null; state: string | null; zip_code: string | null }

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? ''
  const secret = process.env.CRON_SECRET
  if (!secret || !safeEqual(authHeader, `Bearer ${secret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createClient(SUPABASE_URL, SERVICE_KEY)

  const { data, error } = await db
    .from('listings')
    .select('id, address, city, state, zip_code')
    .eq('status', 'active')
    .not('address', 'is', null)
    .or('latitude.is.null,longitude.is.null')
    .order('created_at', { ascending: true })
    .limit(BATCH_SIZE)
    .returns<ListingRow[]>()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const listings = data ?? []
  if (listings.length === 0) return NextResponse.json({ geocoded: 0, message: 'nothing to geocode' })

  const results: Record<number, { lat: number; lon: number; source: string }> = {}

  // Census batch
  const csvRows = listings.map(l =>
    `${l.id},"${(l.address ?? '').replace(/"/g, '')}","${l.city ?? 'Portland'}","${l.state ?? 'OR'}","${l.zip_code ?? ''}"`
  ).join('\n')

  const form = new FormData()
  form.append('addressFile', new Blob([csvRows], { type: 'text/plain' }), 'addresses.csv')
  form.append('benchmark', 'Public_AR_Current')
  form.append('returntype', 'locations')

  try {
    const res = await fetch(CENSUS_GEOCODER, {
      method: 'POST',
      headers: { 'User-Agent': USER_AGENT },
      body: form,
      signal: AbortSignal.timeout(90_000),
    })
    if (res.ok) {
      const text = await res.text()
      for (const line of text.split('\n')) {
        const parts = line.split(',')
        if (parts.length < 7) continue
        const id  = parseInt(parts[0], 10)
        const ok  = (parts[2] ?? '').trim().toLowerCase() === 'match'
        const lon = parseFloat(parts[5] ?? '')
        const lat = parseFloat(parts[6] ?? '')
        if (!isNaN(id) && ok && !isNaN(lat) && !isNaN(lon)) {
          results[id] = { lat, lon, source: 'census' }
        }
      }
    }
  } catch { /* Nominatim will catch the rest */ }

  // Nominatim fallback
  const missed = listings.filter(l => !results[l.id])
  for (const l of missed) {
    const q = [l.address, l.city ?? 'Portland', l.state ?? 'OR', 'USA'].filter(Boolean).join(', ')
    const url = new URL(NOMINATIM_BASE)
    url.searchParams.set('q', q); url.searchParams.set('format', 'json')
    url.searchParams.set('limit', '1'); url.searchParams.set('countrycodes', 'us')
    try {
      const r = await fetch(url.toString(), { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(8_000) })
      if (r.ok) {
        const d = await r.json() as Array<{ lat: string; lon: string }>
        if (d.length) results[l.id] = { lat: parseFloat(d[0].lat), lon: parseFloat(d[0].lon), source: 'nominatim' }
      }
    } catch { /* skip */ }
    await new Promise(r => setTimeout(r, 1100)) // 1 req/sec
  }

  // Persist & enrich
  let saved = 0
  for (const [idStr, geo] of Object.entries(results)) {
    const id = parseInt(idStr, 10)
    await db.from('listings').update({ latitude: geo.lat, longitude: geo.lon }).eq('id', id)
    await db.rpc('exec_sql' as never, {
      sql: `UPDATE public.listings SET geom = ST_SetSRID(ST_MakePoint(${geo.lon},${geo.lat}),4326) WHERE id = ${id}`
    } as never)
    await db.rpc('enrich_listing_spatial', { p_listing_id: id })
    saved++
  }

  return NextResponse.json({ geocoded: saved, total: listings.length, census: Object.values(results).filter(r => r.source === 'census').length })
}
