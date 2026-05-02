import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { safeEqual } from '@/lib/security'
import { Resend } from 'resend'

// Monthly performance digest to ALL landlords with a contact_email.
// Triggered by Vercel Cron on the 1st of each month at 09:00 UTC (see vercel.json).
//
// Audience split:
//   - pro tier  → stats + dashboard link (retention)
//   - free/other → stats + upgrade CTA (upsell)
//
// Security:
// - Vercel sends `Authorization: Bearer ${CRON_SECRET}` when CRON_SECRET env is set.
// - Any request without a matching secret returns 401.
// - Never logs email addresses or any PII — only aggregate counts.
//
// Dry-run: append `?dry_run=1` to get counts without sending.
//
// CAN-SPAM physical address: set POSTAL_ADDRESS in production.
// Fallback keeps the footer compliant in local/dev dry runs without exposing secrets.

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL ?? 'hello@findstudiospace.com'
const SITE_URL = 'https://www.findstudiospace.com'
// Physical address for CAN-SPAM footer (required by CAN-SPAM for commercial email).
const POSTAL_ADDRESS = process.env.POSTAL_ADDRESS ?? 'findstudiospace, 9169 W State St #1791, Garden City, ID 83714'

type Listing = {
  id: number
  title: string | null
  contact_email: string | null
  tier: string | null
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
  isPro: boolean
}) {
  const { studioName, listingId, views30d, inquiries30d, isPro } = args
  const safeName = escapeHtml(studioName)
  const dashboardUrl = `${SITE_URL}/dashboard/${listingId}`
  const upgradeUrl = `${SITE_URL}/pricing`

  const viewsLabel = views30d === 1 ? 'view' : 'views'
  const inquiriesLabel = inquiries30d === 1 ? 'inquiry' : 'inquiries'

  // CTA block differs by tier
  const ctaText = isPro
    ? `View your dashboard: ${dashboardUrl}`
    : [
        `View your listing: ${SITE_URL}/listing/${listingId}`,
        '',
        `Upgrade to Pro for featured placement and priority search ranking: ${upgradeUrl}`,
      ].join('\n')

  const ctaHtml = isPro
    ? `<p style="font-size:14px;margin:0 0 12px;"><a href="${dashboardUrl}" style="color:#1A6B3C;text-decoration:none;">View your dashboard →</a></p>`
    : `<p style="font-size:14px;margin:0 0 8px;"><a href="${SITE_URL}/listing/${listingId}" style="color:#1A6B3C;text-decoration:none;">View your listing →</a></p>
<p style="font-size:14px;margin:0 0 24px;padding:12px 16px;background:#F5F5F0;border-left:3px solid #1A6B3C;">Upgrade to <strong>Pro</strong> for featured placement and priority search ranking. <a href="${upgradeUrl}" style="color:#1A6B3C;text-decoration:none;">See plans →</a></p>`

  const postalLine = POSTAL_ADDRESS
    ? `<p style="font-size:11px;color:#6E7582;margin:4px 0 0;">${escapeHtml(POSTAL_ADDRESS)}</p>`
    : ''
  const postalText = POSTAL_ADDRESS ? `\n${POSTAL_ADDRESS}` : ''

  const text = [
    `Your ${studioName} listing — monthly update`,
    '',
    `Last 30 days:`,
    `  ${views30d} ${viewsLabel}`,
    `  ${inquiries30d} ${inquiriesLabel}`,
    '',
    ctaText,
    '',
    `To stop these monthly updates, reply 'unsubscribe' to this email — we'll remove you within 48 hours.`,
    `— FindStudioSpace · findstudiospace.com${postalText}`,
  ].join('\n')

  const html = `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#1A1D23;line-height:1.6;max-width:560px;margin:0 auto;padding:24px;">
<p style="font-size:16px;margin:0 0 20px;">Your <strong>${safeName}</strong> listing — monthly update</p>
<p style="font-size:14px;color:#6E7582;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.08em;">Last 30 days</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 24px;">
<tr><td style="padding:8px 16px 8px 0;font-size:28px;font-weight:600;color:#1A1D23;">${views30d}</td><td style="padding:8px 0;font-size:14px;color:#6E7582;">${viewsLabel}</td></tr>
<tr><td style="padding:8px 16px 8px 0;font-size:28px;font-weight:600;color:#1A1D23;">${inquiries30d}</td><td style="padding:8px 0;font-size:14px;color:#6E7582;">${inquiriesLabel}</td></tr>
</table>
${ctaHtml}
<p style="font-size:12px;color:#6E7582;margin:24px 0 0;border-top:1px solid #D8D3C8;padding-top:16px;">To stop these monthly updates, reply &#39;unsubscribe&#39; to this email — we&#39;ll remove you within 48 hours.</p>
<p style="font-size:12px;color:#6E7582;margin:8px 0 0;">— FindStudioSpace · <a href="${SITE_URL}" style="color:#6E7582;">findstudiospace.com</a></p>
${postalLine}
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

  // All active listings with a contact_email — free and pro both get a digest.
  // Pro gets dashboard link (retention); free gets upgrade CTA (upsell).
  const { data: listings, error } = await supabaseServer
    .from('listings')
    .select('id, title, contact_email, tier')
    .eq('status', 'active')
    .not('contact_email', 'is', null)

  if (error) {
    console.error('[monthly-digest] listings query failed:', error.message)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  const eligible = (listings as Listing[] | null ?? []).filter(
    (l) => l.contact_email && l.contact_email.trim().length > 0,
  )

  if (isDryRun) {
    const proCount = eligible.filter((l) => l.tier === 'pro').length
    const freeCount = eligible.length - proCount
    console.log(`[monthly-digest] dry_run: would send ${eligible.length} (pro=${proCount} free=${freeCount})`)
    return NextResponse.json({ would_send: eligible.length, pro: proCount, free: freeCount })
  }

  if (eligible.length === 0) {
    console.log('[monthly-digest] no eligible listings; nothing to send')
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
      const isPro = listing.tier === 'pro'
      const { text, html } = buildEmail({
        studioName,
        listingId: listing.id,
        views30d,
        inquiries30d,
        isPro,
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
      console.log(`[monthly-digest] sent listing_id=${listing.id} tier=${listing.tier ?? 'free'} views=${views30d} inquiries=${inquiries30d}`)
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
