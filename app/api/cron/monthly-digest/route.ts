import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { Resend } from 'resend'

// Monthly digest email to Pro subscribers.
// Triggered by Vercel Cron on the 1st of each month at 09:00 UTC (see vercel.json).
//
// Security:
// - Vercel sends `Authorization: Bearer ${CRON_SECRET}` when CRON_SECRET env is set.
// - Any request without a matching secret returns 401.
// - Never logs email addresses or any PII — only aggregate counts.
//
// Dry-run: append `?dry_run=1` to get counts without sending.

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'hello@findstudiospace.com'
// NOTE: RESEND_FROM_EMAIL env var exists but is unused here (matching
// existing hardcoded pattern in app/api/lead-inquiries/route.ts).
// Follow-up: consolidate to single source of truth.

const SITE_URL = 'https://www.findstudiospace.com'

// Constant-time-ish string compare to avoid trivial timing leaks on the secret.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

type ProListing = {
  id: number
  title: string | null
  contact_email: string | null
}

async function thirtyDayCount(
  table: 'listing_views' | 'lead_inquiries',
  listingId: number,
  cutoffIso: string,
): Promise<number> {
  const { count } = await supabaseServer
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', listingId)
    .gte(table === 'listing_views' ? 'viewed_at' : 'created_at', cutoffIso)
  return count ?? 0
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildEmail(args: {
  studioName: string
  listingId: number
  views30d: number
  inquiries30d: number
}) {
  const { studioName, listingId, views30d, inquiries30d } = args
  const safeName = escapeHtml(studioName)
  const dashboardUrl = `${SITE_URL}/dashboard/${listingId}`
  const subscriptionUrl = `${SITE_URL}/claim?listing_id=${listingId}`

  const viewsLabel = views30d === 1 ? 'view' : 'views'
  const inquiriesLabel = inquiries30d === 1 ? 'inquiry' : 'inquiries'

  const text = [
    `Your ${studioName} listing — monthly update`,
    '',
    `Last 30 days:`,
    `  ${views30d} ${viewsLabel}`,
    `  ${inquiries30d} ${inquiriesLabel}`,
    '',
    `View your dashboard: ${dashboardUrl}`,
    `Manage subscription: ${subscriptionUrl}`,
    '',
    `To stop these monthly updates, reply 'unsubscribe' to this email — we'll remove you within 48 hours.`,
    '',
    `— FindStudioSpace`,
  ].join('\n')

  const html = `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#1A1D23;line-height:1.6;max-width:560px;margin:0 auto;padding:24px;">
<p style="font-size:16px;margin:0 0 20px;">Your <strong>${safeName}</strong> listing — monthly update</p>
<p style="font-size:14px;color:#6E7582;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.08em;">Last 30 days</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 24px;">
<tr><td style="padding:8px 16px 8px 0;font-size:28px;font-weight:600;color:#1A1D23;">${views30d}</td><td style="padding:8px 0;font-size:14px;color:#6E7582;">${viewsLabel}</td></tr>
<tr><td style="padding:8px 16px 8px 0;font-size:28px;font-weight:600;color:#1A1D23;">${inquiries30d}</td><td style="padding:8px 0;font-size:14px;color:#6E7582;">${inquiriesLabel}</td></tr>
</table>
<p style="font-size:14px;margin:0 0 12px;"><a href="${dashboardUrl}" style="color:#D4724E;text-decoration:none;">View your dashboard →</a></p>
<p style="font-size:14px;margin:0 0 24px;"><a href="${subscriptionUrl}" style="color:#D4724E;text-decoration:none;">Manage subscription →</a></p>
<p style="font-size:12px;color:#6E7582;margin:24px 0 0;border-top:1px solid #D8D3C8;padding-top:16px;">To stop these monthly updates, reply &#39;unsubscribe&#39; to this email — we&#39;ll remove you within 48 hours.</p>
<p style="font-size:12px;color:#6E7582;margin:8px 0 0;">— FindStudioSpace</p>
</body></html>`

  return { text, html }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''
  const expected = `Bearer ${process.env.CRON_SECRET ?? ''}`

  if (!process.env.CRON_SECRET || !safeEqual(auth, expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const isDryRun = url.searchParams.get('dry_run') === '1'

  // Fetch Pro listings with contact_email
  const { data: proListings, error } = await supabaseServer
    .from('listings')
    .select('id, title, contact_email')
    .eq('tier', 'pro')
    .eq('status', 'active')
    .not('contact_email', 'is', null)

  if (error) {
    console.error('[monthly-digest] listings query failed:', error.message)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  const eligible = (proListings as ProListing[] | null ?? []).filter(
    (l) => l.contact_email && l.contact_email.trim().length > 0,
  )

  if (isDryRun) {
    console.log(`[monthly-digest] dry_run: would send ${eligible.length}`)
    return NextResponse.json({ would_send: eligible.length })
  }

  if (eligible.length === 0) {
    console.log('[monthly-digest] no eligible Pro listings; nothing to send')
    return NextResponse.json({ sent: 0, skipped: 0 })
  }

  const cutoffIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const shouldDelay = eligible.length > 10

  let sent = 0
  let skipped = 0

  for (const listing of eligible) {
    try {
      const [views30d, inquiries30d] = await Promise.all([
        thirtyDayCount('listing_views', listing.id, cutoffIso),
        thirtyDayCount('lead_inquiries', listing.id, cutoffIso),
      ])

      const studioName = listing.title ?? 'your studio'
      const { text, html } = buildEmail({
        studioName,
        listingId: listing.id,
        views30d,
        inquiries30d,
      })

      await resend.emails.send({
        from: FROM,
        to: listing.contact_email!,
        replyTo: FROM,
        subject: `Your ${studioName} listing — monthly update`,
        html,
        text,
      })

      sent++
      console.log(`[monthly-digest] sent listing_id=${listing.id} views=${views30d} inquiries=${inquiries30d}`)
    } catch (err) {
      skipped++
      const msg = err instanceof Error ? err.message : 'unknown'
      console.error(`[monthly-digest] send failed listing_id=${listing.id}: ${msg}`)
    }

    if (shouldDelay) {
      await new Promise((r) => setTimeout(r, 100))
    }
  }

  console.log(`[monthly-digest] complete sent=${sent} skipped=${skipped}`)
  return NextResponse.json({ sent, skipped })
}
