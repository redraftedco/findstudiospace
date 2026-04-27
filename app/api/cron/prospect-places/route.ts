import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { safeEqual } from '@/lib/security'

/**
 * GET /api/cron/prospect-places
 *
 * Mon/Wed/Fri 03:00 UTC — runs before enrich-contacts (04:00 UTC).
 *
 * Uses Google Places Text Search to discover Portland creative-space
 * businesses by category and inserts them into acquisition_targets.
 *
 * Flow per run:
 *   1. Rotate through QUERIES (9 keyword × category pairs).
 *   2. For each query: Places textsearch → up to 20 results.
 *   3. Upsert into acquisition_targets (unique index prevents duplicates).
 *   4. No website / email lookup here — enrich-targets handles that.
 *
 * Auth: Authorization: Bearer <CRON_SECRET>
 *
 * Costs: Places Text Search = $0.032/request. 9 queries/run × 3 runs/week
 *        = 27 API calls/week ≈ $0.86/week ≈ $3.44/month. Negligible.
 */

const PLACES_BASE = 'https://maps.googleapis.com/maps/api/place'
const RUN_TIMEOUT_MS = 4.5 * 60 * 1000

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
)

// ── Types ──────────────────────────────────────────────────────────────────

type AcqCategory = 'photo' | 'event' | 'brewery' | 'maker' | 'rooftop' | 'podcast' | 'other'

type PlacesResult = {
  place_id:            string
  name:                string
  formatted_address:   string
  rating?:             number
  user_ratings_total?: number
}

// ── Search queries ─────────────────────────────────────────────────────────
// Each maps a Google search string to an acquisition category.
// Portland, OR scoped via the query string (no radius needed — textsearch
// uses location bias from the query text itself).

const QUERIES: Array<{ query: string; category: AcqCategory }> = [
  { query: 'photography studio rental Portland OR',        category: 'photo'   },
  { query: 'photo studio rental Portland OR',              category: 'photo'   },
  { query: 'podcast studio rental Portland OR',            category: 'podcast' },
  { query: 'recording studio rental Portland OR',          category: 'podcast' },
  { query: 'private event venue Portland OR',              category: 'event'   },
  { query: 'event space rental Portland OR',               category: 'event'   },
  { query: 'brewery private event space Portland OR',      category: 'brewery' },
  { query: 'makerspace Portland OR',                       category: 'maker'   },
  { query: 'rooftop event venue Portland OR',              category: 'rooftop' },
]

// ── Places textsearch helper ───────────────────────────────────────────────

async function textSearch(
  query:  string,
  apiKey: string,
  signal: AbortSignal,
): Promise<PlacesResult[]> {
  const url =
    `${PLACES_BASE}/textsearch/json` +
    `?query=${encodeURIComponent(query)}` +
    `&fields=place_id,name,formatted_address,rating,user_ratings_total` +
    `&key=${apiKey}`

  try {
    const res = await fetch(url, { signal })
    if (!res.ok) return []
    const data = await res.json() as {
      status:  string
      results: PlacesResult[]
    }
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.warn(`[prospect-places] Places API status: ${data.status} for query: ${query}`)
    }
    return data.results ?? []
  } catch {
    return []
  }
}

// ── Route handler ──────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // ── Auth ─────────────────────────────────────────────────────────────────
  const secret = process.env.CRON_SECRET
  const auth   = req.headers.get('authorization') ?? ''
  if (!secret || !safeEqual(auth, `Bearer ${secret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    console.error('[prospect-places] GOOGLE_PLACES_API_KEY not set')
    return NextResponse.json({ error: 'GOOGLE_PLACES_API_KEY not configured' }, { status: 500 })
  }

  const runStart   = Date.now()
  const runSignal  = AbortSignal.timeout(RUN_TIMEOUT_MS)
  const stats      = { queries: 0, discovered: 0, skipped_duplicate: 0, errors: 0 }

  for (const { query, category } of QUERIES) {
    if (Date.now() - runStart > RUN_TIMEOUT_MS) break

    const results = await textSearch(query, apiKey, runSignal)
    stats.queries++

    for (const place of results) {
      // Derive city from formatted_address — Places returns
      // "Business Name, 123 Street, Portland, OR 97201, USA"
      const city = extractCity(place.formatted_address) ?? 'Portland'

      const { error } = await supabase
        .from('acquisition_targets')
        .upsert(
          {
            business_name:      place.name,
            category,
            city,
            google_place_id:    place.place_id,
            rating_average:     place.rating ?? null,
            rating_count:       place.user_ratings_total ?? null,
            acquisition_source: 'places_textsearch',
            enrichment_status:  'pending',
          },
          {
            // uq_acq_place index: deduplicate by place_id
            onConflict:     'google_place_id',
            ignoreDuplicates: true,
          }
        )

      if (error) {
        if (error.code === '23505') {
          // unique_violation — also covered by uq_acq_name_city
          stats.skipped_duplicate++
        } else {
          console.error(`[prospect-places] upsert error (${place.name}):`, error.message)
          stats.errors++
        }
      } else {
        stats.discovered++
      }
    }
  }

  console.log('[prospect-places] run complete:', {
    ...stats,
    elapsed_ms: Date.now() - runStart,
  })
  return NextResponse.json(stats)
}

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Extract city from a Google Places formatted_address string.
 * Format: "Name, Street, City, STATE ZIP, Country" — city is third-to-last
 * comma-separated segment before the state+zip.
 */
function extractCity(address: string): string | null {
  // Remove country (last segment), remove state+zip (second-to-last),
  // then take the next segment as city.
  const parts = address.split(',').map(p => p.trim()).filter(Boolean)
  // Minimum: "Street, City, ST ZIP, Country"
  if (parts.length < 3) return null
  // State+zip is second from end (before country)
  const cityIdx = parts.length - 3
  return parts[cityIdx] ?? null
}
