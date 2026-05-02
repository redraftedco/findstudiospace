import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { safeEqual } from '@/lib/security'
import { assertCanSpamCompliant } from '@/lib/outreach/canSpamGate'
import {
  buildOutreachEmail,
  templateSlugForCategory,
  type AcqCategory,
} from '@/lib/outreach/templates'

/**
 * GET /api/cron/send-outreach
 *
 * Manual trigger only — NOT on the Vercel cron schedule.
 * Run after enrich-targets populates outreach_status='pending' rows.
 *
 * Sends cold outreach emails to acquisition_targets that are:
 *   - outreach_status = 'pending'
 *   - contact_email IS NOT NULL
 *   - Ordered by acquisition_priority DESC (best leads first)
 *
 * Cap: 20 emails per run to stay well inside Resend's daily limit.
 * Override via OUTREACH_DAILY_CAP env var.
 *
 * CAN-SPAM gate: assertCanSpamCompliant() hard-throws if POSTAL_ADDRESS
 * is not set, blocking all sends until a physical address is configured.
 *
 * Auth: Authorization: Bearer <CRON_SECRET>
 *
 * Dry-run: append ?dry_run=1 to preview without sending.
 */

const DAILY_SEND_CAP = parseInt(process.env.OUTREACH_DAILY_CAP ?? '20', 10)
const SEND_DELAY_MS  = 150   // pace between Resend API calls

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
)

const FROM = process.env.RESEND_FROM_EMAIL ?? 'hello@findstudiospace.com'

// ── Types ──────────────────────────────────────────────────────────────────

type TargetRow = {
  id:                   number
  business_name:        string
  category:             string | null
  city:                 string | null
  neighborhood:         string | null
  contact_email:        string
  website_url:          string | null
  promoted_listing_id:  number | null
  acquisition_priority: number | null
}

type RunStats = {
  eligible: number
  sent:     number
  skipped:  number
  dry_run:  boolean
}

// ── Route handler ──────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // ── Auth — require Bearer token + x-vercel-cron header (defense-in-depth) ─
  const secret     = process.env.CRON_SECRET
  const auth       = req.headers.get('authorization') ?? ''
  const isCronCall = req.headers.get('x-vercel-cron') === '1'
  if (!secret || !safeEqual(auth, `Bearer ${secret}`) || !isCronCall) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── CAN-SPAM gate — throws if address not configured ──────────────────────
  try {
    assertCanSpamCompliant()
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'CAN-SPAM gate failed'
    console.error('[send-outreach]', msg)
    return NextResponse.json({ error: msg }, { status: 503 })
  }

  // ── Resend client ─────────────────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.error('[send-outreach] RESEND_API_KEY not set')
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
  }
  const resend = new Resend(resendKey)

  // ── Dry-run flag ──────────────────────────────────────────────────────────
  const url      = new URL(req.url)
  const isDryRun = url.searchParams.get('dry_run') === '1'

  // ── Fetch approved targets ────────────────────────────────────────────────
  // Hard gate: only rows explicitly set to outreach_status='approved' are sent.
  // Enrichment sets 'review'; you must approve in Supabase before anything sends.
  const { data, error: fetchErr } = await supabase
    .from('acquisition_targets')
    .select(
      'id, business_name, category, city, neighborhood, contact_email, website_url, promoted_listing_id, acquisition_priority',
    )
    .eq('outreach_status', 'approved')
    .not('contact_email', 'is', null)
    .order('acquisition_priority', { ascending: false })
    .limit(DAILY_SEND_CAP)

  if (fetchErr) {
    console.error('[send-outreach] fetch error:', fetchErr.message)
    return NextResponse.json({ error: fetchErr.message }, { status: 500 })
  }

  const targets = (data ?? []) as TargetRow[]
  const stats: RunStats = {
    eligible: targets.length,
    sent:     0,
    skipped:  0,
    dry_run:  isDryRun,
  }

  if (isDryRun) {
    console.log('[send-outreach] dry_run: would send', targets.length, 'emails')
    return NextResponse.json(stats)
  }

  if (targets.length === 0) {
    console.log('[send-outreach] no pending targets')
    return NextResponse.json(stats)
  }

  // ── Send loop ─────────────────────────────────────────────────────────────
  for (const target of targets) {
    const category  = (target.category ?? 'other') as AcqCategory
    const slug      = templateSlugForCategory(category)
    const email     = buildOutreachEmail(slug, {
      businessName: target.business_name,
      listingId:    target.promoted_listing_id ?? 0,
      websiteUrl:   target.website_url,
      city:         target.city ?? 'Portland',
      neighborhood: target.neighborhood,
    })

    try {
      await resend.emails.send({
        from:    FROM,
        to:      target.contact_email,
        replyTo: FROM,
        subject: email.subject,
        html:    email.html,
        text:    email.text,
      })

      const { error: updateErr } = await supabase
        .from('acquisition_targets')
        .update({
          outreach_status:   'sent',
          outreach_sent_at:  new Date().toISOString(),
          outreach_template: slug,
        })
        .eq('id', target.id)

      if (updateErr) {
        console.error(`[send-outreach] update failed (${target.id}):`, updateErr.message)
      }

      stats.sent++
      console.log(
        `[send-outreach] sent id=${target.id} slug=${slug} priority=${target.acquisition_priority ?? '?'}`,
      )
    } catch (err) {
      stats.skipped++
      const msg = err instanceof Error ? err.message : 'unknown'
      console.error(`[send-outreach] send failed id=${target.id}: ${msg}`)
    }

    await new Promise(r => setTimeout(r, SEND_DELAY_MS))
  }

  console.log('[send-outreach] complete', stats)
  return NextResponse.json(stats)
}
