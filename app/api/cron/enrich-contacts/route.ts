import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { extractEmails } from '@/lib/enrichment/extractEmails'

/**
 * GET /api/cron/enrich-contacts
 *
 * Nightly cron (04:00 UTC) that enriches un-contacted listings with website
 * URLs and contact emails via Google Places API + website scraping.
 *
 * Per run: up to BATCH_SIZE listings, each with a LISTING_TIMEOUT_MS budget.
 * Total run budget: RUN_TIMEOUT_MS (Vercel Hobby cron limit is 5 min).
 *
 * Per-listing flow:
 *   1. If website_url is already set, skip Places API.
 *   2. Otherwise: Places findplacefromtext → place details (website field).
 *   3. Fetch origin / /contact / /about — cap at MAX_HTML_BYTES each.
 *   4. Extract emails, prefer domain-matching addresses.
 *   5. Write website_url, contact_email, enrichment_* columns back.
 *
 * Retry logic: enrichment_attempts is incremented on every run regardless
 * of outcome. Listings with enrichment_attempts >= 3 are excluded from
 * future batches.
 *
 * Auth: Authorization: Bearer <CRON_SECRET>
 */

const BATCH_SIZE        = 20
const LISTING_TIMEOUT_MS = 30_000
const RUN_TIMEOUT_MS     = 4.5 * 60 * 1000   // 4 min 30 s — safe margin under Vercel 5-min limit
const MAX_HTML_BYTES     = 5 * 1024 * 1024    // 5 MB per page fetch
const PLACES_BASE        = 'https://maps.googleapis.com/maps/api/place'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
)

// ── Types ─────────────────────────────────────────────────────────────────────

type ListingRow = {
  id: number
  title: string
  business_name: string | null
  city: string | null
  website_url: string | null
  enrichment_attempts: number
}

type RunStats = {
  processed:       number
  success:         number
  no_website:      number
  no_email:        number
  failed:          number
  places_api_calls: number
}

// ── Privacy helpers ───────────────────────────────────────────────────────────

/** Masks an email for safe console logging: "ale...@studiosix.com" */
function maskEmail(email: string): string {
  const atIdx = email.indexOf('@')
  if (atIdx < 0) return '???'
  const local  = email.slice(0, atIdx)
  const domain = email.slice(atIdx + 1)
  return `${local.slice(0, 3)}...@${domain}`
}

// ── HTML fetcher ──────────────────────────────────────────────────────────────

/**
 * Fetch a page as raw HTML. Returns null on:
 *   - non-2xx status
 *   - non text/html content-type
 *   - network / timeout error
 * Caps download at MAX_HTML_BYTES to prevent memory exhaustion.
 */
async function fetchHtml(url: string, signal: AbortSignal): Promise<string | null> {
  try {
    const res = await fetch(url, { signal, redirect: 'follow' })
    if (!res.ok) return null

    const ct = res.headers.get('content-type') ?? ''
    if (!ct.includes('text/html')) return null

    const reader = res.body?.getReader()
    if (!reader) return null

    const chunks: Uint8Array[] = []
    let totalBytes = 0

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        const remaining = MAX_HTML_BYTES - totalBytes
        if (remaining <= 0) { await reader.cancel(); break }
        const slice = value.length <= remaining ? value : value.slice(0, remaining)
        chunks.push(slice)
        totalBytes += slice.length
        if (totalBytes >= MAX_HTML_BYTES) { await reader.cancel(); break }
      }
    }

    const buf = new Uint8Array(totalBytes)
    let offset = 0
    for (const chunk of chunks) { buf.set(chunk, offset); offset += chunk.length }
    return new TextDecoder().decode(buf)
  } catch {
    return null
  }
}

// ── Google Places helpers ─────────────────────────────────────────────────────

/**
 * Find a studio's website URL via Google Places API (legacy endpoints).
 * Returns null if not found or on any API error.
 * Increments stats.places_api_calls for each HTTP call made.
 */
async function findPlaceWebsite(
  name: string,
  city: string,
  apiKey: string,
  stats: RunStats,
  signal: AbortSignal,
): Promise<string | null> {
  // Step 1 — findplacefromtext
  const query    = encodeURIComponent(`${name} ${city}`)
  const findUrl  = `${PLACES_BASE}/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id&key=${apiKey}`

  let findData: { status: string; candidates?: { place_id: string }[] }
  try {
    const findRes = await fetch(findUrl, { signal })
    stats.places_api_calls++
    if (!findRes.ok) return null
    findData = await findRes.json() as typeof findData
  } catch {
    return null
  }

  if (findData.status !== 'OK' || !findData.candidates?.length) return null
  const placeId = findData.candidates[0].place_id

  // Step 2 — place details (website only)
  const detailsUrl = `${PLACES_BASE}/details/json?place_id=${encodeURIComponent(placeId)}&fields=website&key=${apiKey}`

  let detailsData: { status: string; result?: { website?: string } }
  try {
    const detailsRes = await fetch(detailsUrl, { signal })
    stats.places_api_calls++
    if (!detailsRes.ok) return null
    detailsData = await detailsRes.json() as typeof detailsData
  } catch {
    return null
  }

  if (detailsData.status !== 'OK') return null
  return detailsData.result?.website ?? null
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── API key guard — fail loudly, not silently ────────────────────────────
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    console.error('[enrich-contacts] GOOGLE_PLACES_API_KEY is not set')
    return NextResponse.json({ error: 'GOOGLE_PLACES_API_KEY not configured' }, { status: 500 })
  }

  // ── Fetch batch ───────────────────────────────────────────────────────────
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: batchData, error: batchErr } = await supabase
    .from('listings')
    .select('id, title, business_name, city, website_url, enrichment_attempts')
    .is('contact_email', null)
    .lt('enrichment_attempts', 3)
    .or(`enrichment_attempted_at.is.null,enrichment_attempted_at.lt.${sevenDaysAgo}`)
    .not('city_id', 'is', null)
    .eq('status', 'active')
    .order('enrichment_attempted_at', { ascending: true, nullsFirst: true })
    .limit(BATCH_SIZE)

  if (batchErr) {
    console.error('[enrich-contacts] batch fetch error:', batchErr.message)
    return NextResponse.json({ error: batchErr.message }, { status: 500 })
  }

  const batch = (batchData ?? []) as ListingRow[]
  const stats: RunStats = { processed: 0, success: 0, no_website: 0, no_email: 0, failed: 0, places_api_calls: 0 }
  const runStart = Date.now()

  // ── Process each listing ──────────────────────────────────────────────────
  for (const listing of batch) {
    stats.processed++

    const listingController = new AbortController()
    const listingTimer = setTimeout(() => listingController.abort(), LISTING_TIMEOUT_MS)

    let websiteUrl: string | null = listing.website_url ?? null
    let emailFound: string | null = null
    let newStatus  = 'failed'

    try {
      // ── Step 1: website URL ──────────────────────────────────────────────
      if (!websiteUrl) {
        const searchName = listing.business_name ?? listing.title
        const cityName   = listing.city ?? 'Portland'
        websiteUrl = await findPlaceWebsite(searchName, cityName, apiKey, stats, listingController.signal)
      }

      if (!websiteUrl) {
        newStatus = 'no_website'
        stats.no_website++
      } else {
        // ── Step 2: validate URL and derive origin ────────────────────────
        let origin: string
        try {
          origin = new URL(websiteUrl).origin
        } catch {
          // Malformed URL from Places API — treat as no website
          newStatus  = 'no_website'
          websiteUrl = null
          stats.no_website++
          clearTimeout(listingTimer)
          continue
        }

        const domain = new URL(origin).hostname.replace(/^www\./, '')

        // ── Step 3: scrape homepage + /contact + /about in parallel ───────
        const [homeResult, contactResult, aboutResult] = await Promise.allSettled([
          fetchHtml(origin,                   listingController.signal),
          fetchHtml(`${origin}/contact`,      listingController.signal),
          fetchHtml(`${origin}/about`,        listingController.signal),
        ])

        // ── Step 4: extract and rank emails ──────────────────────────────
        const allEmails: string[] = []
        for (const result of [homeResult, contactResult, aboutResult]) {
          if (result.status === 'fulfilled' && result.value) {
            allEmails.push(...extractEmails(result.value))
          }
        }

        // Deduplicate then prefer domain-matching addresses
        const unique    = [...new Set(allEmails)]
        const preferred = unique.filter(e => e.endsWith(`@${domain}`) || e.includes(`.${domain}`))
        const others    = unique.filter(e => !preferred.includes(e))
        emailFound = [...preferred, ...others][0] ?? null

        if (emailFound) {
          newStatus = 'success'
          stats.success++
          console.log(`[enrich-contacts] ${listing.id}: ${maskEmail(emailFound)}`)
        } else {
          newStatus = 'no_email'
          stats.no_email++
        }
      }
    } catch {
      // AbortError (timeout) or unexpected network error
      newStatus = 'failed'
      stats.failed++
    } finally {
      clearTimeout(listingTimer)
    }

    // ── Step 5: persist results ───────────────────────────────────────────
    const update: Record<string, unknown> = {
      enrichment_attempted_at: new Date().toISOString(),
      enrichment_attempts:     (listing.enrichment_attempts ?? 0) + 1,
      enrichment_status:       newStatus,
    }
    // Only write website_url if we newly discovered it (don't overwrite existing)
    if (websiteUrl && !listing.website_url) update.website_url = websiteUrl
    if (emailFound) update.contact_email = emailFound

    const { error: updateErr } = await supabase
      .from('listings')
      .update(update)
      .eq('id', listing.id)

    if (updateErr) {
      console.error(`[enrich-contacts] update error listing ${listing.id}:`, updateErr.message)
    }

    // ── Run timeout guard ─────────────────────────────────────────────────
    if (Date.now() - runStart > RUN_TIMEOUT_MS) {
      console.log('[enrich-contacts] approaching run timeout — stopping early')
      break
    }
  }

  console.log('[enrich-contacts] run complete:', {
    ...stats,
    elapsed_ms: Date.now() - runStart,
  })
  return NextResponse.json(stats)
}
