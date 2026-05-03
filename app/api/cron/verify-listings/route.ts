import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { safeEqual } from '@/lib/security'

/**
 * GET /api/cron/verify-listings
 *
 * Processes up to BATCH_SIZE listings per run, picking those with the
 * oldest last_verified_at (NULLs first). For each listing:
 *   - Fetches external_url, checks HTTP status
 *   - 200 → resets verification_fails, updates last_verified_at
 *   - Non-200 / error → increments verification_fails
 *   - verification_fails >= FAIL_THRESHOLD → sets indexable=false
 *
 * Triggered by Vercel cron (vercel.json). Requests must include:
 *   Authorization: Bearer <CRON_SECRET>
 *
 * Response size guard: body reads capped at MAX_RESPONSE_BYTES to prevent
 * memory exhaustion from unexpectedly large upstream responses.
 */

const BATCH_SIZE       = 50
const FAIL_THRESHOLD   = 3
const MAX_RESPONSE_BYTES = 5 * 1024 * 1024  // 5 MB
const FETCH_TIMEOUT_MS  = 10_000            // 10s per listing

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
)

export async function GET(req: NextRequest) {
  const authHeader  = req.headers.get('authorization') ?? ''
  const secret      = process.env.CRON_SECRET
  if (!secret || !safeEqual(authHeader, `Bearer ${secret}`) || !isCronCall) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Fetch batch ───────────────────────────────────────────────────────────
  const { data: batch, error: fetchErr } = await supabase
    .from('listings')
    .select('id, external_url, indexable, verification_fails')
    .eq('status', 'active')
    .not('external_url', 'is', null)
    .order('last_verified_at', { ascending: true, nullsFirst: true })
    .limit(BATCH_SIZE)

  if (fetchErr) {
    console.error('[verify-listings] DB fetch error:', fetchErr.message)
    return NextResponse.json({ error: fetchErr.message }, { status: 500 })
  }

  const listings = batch ?? []
  const results = { processed: 0, alive: 0, degraded: 0, deindexed: 0, errors: 0 }

  // ── Process each listing ──────────────────────────────────────────────────
  for (const listing of listings) {
    results.processed++

    if (!listing.external_url) continue

    let alive = false
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

      const res = await fetch(listing.external_url, {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'follow',
      })
      clearTimeout(timer)

      // Guard response size on HEAD — HEAD has no body but we verify the status
      // If HEAD is disallowed, fall back to GET with a size cap
      if (res.status === 405) {
        const getRes = await fetch(listing.external_url, {
          method: 'GET',
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
          redirect: 'follow',
        })
        // Consume only up to MAX_RESPONSE_BYTES to avoid memory exhaustion
        const reader = getRes.body?.getReader()
        if (reader) {
          let bytes = 0
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            bytes += value?.length ?? 0
            if (bytes > MAX_RESPONSE_BYTES) { reader.cancel(); break }
          }
        }
        alive = getRes.ok
      } else {
        alive = res.ok
      }
    } catch {
      alive = false
      results.errors++
    }

    const newFails = alive ? 0 : Math.min((listing.verification_fails ?? 0) + 1, FAIL_THRESHOLD)
    const deindex  = newFails >= FAIL_THRESHOLD && listing.indexable

    const update: Record<string, unknown> = {
      verification_fails: newFails,
      last_verified_at:   new Date().toISOString(),
    }
    if (deindex) update.indexable = false
    if (alive)   update.last_verified_at = new Date().toISOString()

    const { error: updateErr } = await supabase
      .from('listings')
      .update(update)
      .eq('id', listing.id)

    if (updateErr) {
      console.error(`[verify-listings] update error for listing ${listing.id}:`, updateErr.message)
    }

    if (alive)   results.alive++
    else if (deindex) results.deindexed++
    else results.degraded++
  }

  console.log('[verify-listings] run complete:', results)
  return NextResponse.json(results)
}
