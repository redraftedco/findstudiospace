import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { safeEqual } from '@/lib/security'
import { extractEmails } from '@/lib/enrichment/extractEmails'
import { classifyContent, scoreAcquisitionPriority } from '@/lib/enrichment/classifyContent'
import { apolloEnrichFallback } from '@/lib/enrichment/apolloFallback'
import { ScraperPolicy } from '@/lib/scraper/policy'
import { queueHighPriorityTargets } from '@/lib/outreach/queueSequence'

/**
 * GET /api/cron/enrich-targets
 *
 * Nightly 05:00 UTC — runs after prospect-places (03:00) and
 * enrich-contacts (04:00).
 *
 * Enriches acquisition_targets rows discovered by the prospector:
 *   1. Google Places details → website_url (if not yet set)
 *   2. robots.txt check + throttle (ScraperPolicy)
 *   3. Fetch homepage + contact paths → email extraction (extractEmails)
 *   4. Content classification (classifyContent)
 *   5. Priority scoring (scoreAcquisitionPriority)
 *   6. Apollo fallback if no email found (apolloEnrichFallback)
 *   7. Persist results to acquisition_targets
 *   8. Queue high-priority targets for outreach (queueHighPriorityTargets)
 *
 * Auth: Authorization: Bearer <CRON_SECRET>
 */

const BATCH_SIZE         = 20
const LISTING_TIMEOUT_MS = 30_000
const RUN_TIMEOUT_MS     = 4.5 * 60 * 1000
const MAX_HTML_BYTES     = 5 * 1024 * 1024
const PLACES_BASE        = 'https://maps.googleapis.com/maps/api/place'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
)

// ── Types ──────────────────────────────────────────────────────────────────

type TargetRow = {
  id:                  number
  business_name:       string
  city:                string | null
  google_place_id:     string | null
  website_url:         string | null
  rating_average:      number | null
  rating_count:        number | null
  enrichment_attempts: number
}

type RunStats = {
  processed:       number
  success:         number
  no_website:      number
  no_email:        number
  needs_apollo:    number
  failed:          number
  places_api_calls: number
  queued_outreach: number
}

// ── HTML fetcher (same pattern as enrich-contacts) ─────────────────────────

async function fetchHtml(url: string, signal: AbortSignal, ua: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal,
      redirect: 'follow',
      headers: { 'User-Agent': ua },
    })
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

// ── Google Places details helper ───────────────────────────────────────────

async function getPlaceWebsite(
  placeId: string,
  apiKey:  string,
  stats:   RunStats,
  signal:  AbortSignal,
): Promise<string | null> {
  const url =
    `${PLACES_BASE}/details/json` +
    `?place_id=${encodeURIComponent(placeId)}` +
    `&fields=website` +
    `&key=${apiKey}`
  try {
    const res = await fetch(url, { signal })
    stats.places_api_calls++
    if (!res.ok) return null
    const data = await res.json() as { status: string; result?: { website?: string } }
    if (data.status !== 'OK') return null
    return data.result?.website ?? null
  } catch {
    return null
  }
}

// ── Route handler ──────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // ── Auth ─────────────────────────────────────────────────────────────────
  const secret     = process.env.CRON_SECRET
  const auth       = req.headers.get('authorization') ?? ''
  const isCronCall = req.headers.get('x-vercel-cron') === '1'
  if (!secret || !safeEqual(auth, `Bearer ${secret}`) || !isCronCall) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    console.error('[enrich-targets] GOOGLE_PLACES_API_KEY not set')
    return NextResponse.json({ error: 'GOOGLE_PLACES_API_KEY not configured' }, { status: 500 })
  }

  // ── Fetch batch ───────────────────────────────────────────────────────────
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: batchData, error: batchErr } = await supabase
    .from('acquisition_targets')
    .select('id, business_name, city, google_place_id, website_url, rating_average, rating_count, enrichment_attempts')
    .neq('enrichment_status', 'success')
    .lt('enrichment_attempts', 3)
    .or(`enrichment_attempted_at.is.null,enrichment_attempted_at.lt.${sevenDaysAgo}`)
    .order('enrichment_attempted_at', { ascending: true, nullsFirst: true })
    .limit(BATCH_SIZE)

  if (batchErr) {
    console.error('[enrich-targets] batch fetch error:', batchErr.message)
    return NextResponse.json({ error: batchErr.message }, { status: 500 })
  }

  const batch   = (batchData ?? []) as TargetRow[]
  const policy  = new ScraperPolicy()
  const stats: RunStats = {
    processed: 0, success: 0, no_website: 0, no_email: 0,
    needs_apollo: 0, failed: 0, places_api_calls: 0, queued_outreach: 0,
  }
  const runStart = Date.now()

  for (const target of batch) {
    stats.processed++

    const ctrl  = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), LISTING_TIMEOUT_MS)

    let websiteUrl:   string | null = target.website_url ?? null
    let emailFound:   string | null = null
    let newStatus                   = 'failed'
    let signals                     = null

    try {
      // ── Step 1: resolve website from Places if missing ───────────────────
      if (!websiteUrl && target.google_place_id) {
        websiteUrl = await getPlaceWebsite(target.google_place_id, apiKey, stats, ctrl.signal)
      }

      if (!websiteUrl) {
        newStatus = 'no_website'
        stats.no_website++
      } else {
        let origin: string
        try {
          origin = new URL(websiteUrl).origin
        } catch {
          newStatus  = 'no_website'
          websiteUrl = null
          stats.no_website++
          clearTimeout(timer)
          continue
        }

        const domain = new URL(origin).hostname.replace(/^www\./, '')

        // ── Step 2: robots.txt check ─────────────────────────────────────
        const allowed = await policy.isAllowed(`${origin}/`)
        if (!allowed) {
          console.log(`[enrich-targets] ${target.id}: robots.txt disallows scraping ${origin}`)
          newStatus = 'failed'
          stats.failed++
          clearTimeout(timer)
          continue
        }

        // ── Step 3: throttle + fetch pages ───────────────────────────────
        const urls = [
          origin,
          `${origin}/contact`,
          `${origin}/about`,
          `${origin}/booking`,
          `${origin}/rentals`,
          `${origin}/private-events`,
          `${origin}/host`,
          `${origin}/inquiries`,
          `${origin}/get-in-touch`,
        ]

        // Respect per-domain throttle (1 req/sec) within this invocation
        const htmlResults: Array<string | null> = []
        for (const url of urls) {
          await policy.throttle(url)
          const html = await fetchHtml(url, ctrl.signal, policy.userAgent)
          htmlResults.push(html)
        }

        // ── Step 4: classify content ──────────────────────────────────────
        const combinedHtml = htmlResults.filter(Boolean).join('\n')
        if (combinedHtml) {
          signals = classifyContent(combinedHtml)
        }

        // ── Step 5: extract emails ────────────────────────────────────────
        const allEmails: string[] = []
        for (const html of htmlResults) {
          if (html) allEmails.push(...extractEmails(html, domain))
        }
        const unique    = [...new Set(allEmails)]
        const preferred = unique.filter(e => e.endsWith(`@${domain}`) || e.includes(`.${domain}`))
        const others    = unique.filter(e => !preferred.includes(e))
        emailFound      = [...preferred, ...others][0] ?? null

        if (emailFound) {
          newStatus = 'success'
          stats.success++
        } else {
          // ── Step 6: Apollo fallback ─────────────────────────────────────
          const apollo = await apolloEnrichFallback(target.business_name, domain)
          if (apollo.email) {
            emailFound = apollo.email
            newStatus  = 'success'
            stats.success++
          } else {
            newStatus = 'needs_apollo'
            stats.needs_apollo++
          }
        }
      }
    } catch {
      newStatus = 'failed'
      stats.failed++
    } finally {
      clearTimeout(timer)
    }

    // ── Step 7: compute priority + persist ───────────────────────────────
    const priority = scoreAcquisitionPriority({
      rating_count:   target.rating_count,
      rating_average: target.rating_average,
      has_website:    !!websiteUrl,
      signals,
    })

    const update: Record<string, unknown> = {
      enrichment_attempted_at: new Date().toISOString(),
      enrichment_attempts:     (target.enrichment_attempts ?? 0) + 1,
      enrichment_status:       newStatus,
      acquisition_priority:    priority,
    }
    if (websiteUrl && !target.website_url) update.website_url   = websiteUrl
    if (emailFound)                        update.contact_email  = emailFound
    if (signals)                           update.content_signals = signals

    const { error: updateErr } = await supabase
      .from('acquisition_targets')
      .update(update)
      .eq('id', target.id)

    if (updateErr) {
      console.error(`[enrich-targets] update error (${target.id}):`, updateErr.message)
    }

    if (Date.now() - runStart > RUN_TIMEOUT_MS) {
      console.log('[enrich-targets] approaching run timeout — stopping early')
      break
    }
  }

  // ── Step 8: queue high-priority targets for outreach ─────────────────────
  const { queued } = await queueHighPriorityTargets()
  stats.queued_outreach = queued

  console.log('[enrich-targets] run complete:', {
    ...stats,
    elapsed_ms: Date.now() - runStart,
  })
  return NextResponse.json(stats)
}
