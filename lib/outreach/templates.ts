/**
 * lib/outreach/templates.ts
 *
 * Cold outreach email templates for acquisition_targets.
 *
 * Rules applied to every template:
 *   - Peer voice: working creative talking to another working creative
 *   - Specific: mention listing URL, category, real value prop
 *   - Short: 3–5 sentences max per section
 *   - CAN-SPAM: mailing address + unsubscribe in every footer
 *   - No banned words: solutions, leverage, empower, seamless, unlock, streamline
 *
 * Template slugs (stored in acquisition_targets.outreach_template):
 *   photo-v1      photography / production studios
 *   maker-v1      makerspaces, workshops, fab labs
 *   event-v1      event venues, breweries, rooftop spaces
 *   podcast-v1    podcast / recording / content studios
 *   generic-v1    art studios, office/cowork, creative space (catch-all)
 */

import { getMailingAddress } from '@/lib/outreach/canSpamGate'

export type TemplateSlug = 'photo-v1' | 'maker-v1' | 'event-v1' | 'podcast-v1' | 'generic-v1'

export type AcqCategory = 'photo' | 'maker' | 'event' | 'brewery' | 'rooftop' | 'podcast' | 'other'

export type OutreachEmailArgs = {
  businessName: string
  listingId:    number          // promoted listing ID on FSS (if exists), else 0
  websiteUrl:   string | null
  city:         string
  neighborhood: string | null
}

export type OutreachEmail = {
  subject: string
  text:    string
  html:    string
  slug:    TemplateSlug
}

// ── Template selector ──────────────────────────────────────────────────────

export function templateSlugForCategory(category: AcqCategory): TemplateSlug {
  switch (category) {
    case 'photo':    return 'photo-v1'
    case 'maker':    return 'maker-v1'
    case 'event':
    case 'brewery':
    case 'rooftop':  return 'event-v1'
    case 'podcast':  return 'podcast-v1'
    default:         return 'generic-v1'
  }
}

// ── Shared footer ──────────────────────────────────────────────────────────

function footerText(): string {
  const addr = getMailingAddress()
  return [
    `— FindStudioSpace · findstudiospace.com`,
    addr,
    ``,
    `To stop messages from FindStudioSpace, reply "unsubscribe" — we'll remove you within 48 hours.`,
  ].join('\n')
}

function footerHtml(): string {
  const addr = escHtml(getMailingAddress())
  return `
<p style="font-size:12px;color:#6E7582;margin:24px 0 0;border-top:1px solid #D8D3C8;padding-top:16px;">
  — FindStudioSpace · <a href="https://www.findstudiospace.com" style="color:#6E7582;">findstudiospace.com</a>
</p>
<p style="font-size:12px;color:#6E7582;margin:4px 0 0;">${addr}</p>
<p style="font-size:12px;color:#6E7582;margin:4px 0 0;">
  To stop messages from FindStudioSpace, reply &ldquo;unsubscribe&rdquo; &mdash; we&rsquo;ll remove you within 48 hours.
</p>`.trim()
}

function wrapHtml(body: string): string {
  return `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1A1D23;line-height:1.65;max-width:560px;margin:0 auto;padding:24px 24px 32px;">
${body}
${footerHtml()}
</body></html>`
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function listingUrl(id: number): string {
  return id > 0 ? `https://www.findstudiospace.com/listing/${id}` : 'https://www.findstudiospace.com'
}

function claimUrl(id: number): string {
  return id > 0 ? `https://www.findstudiospace.com/claim/${id}` : 'https://www.findstudiospace.com/claim'
}

// ── Templates ──────────────────────────────────────────────────────────────

function photoTemplate(args: OutreachEmailArgs): OutreachEmail {
  const { businessName, listingId, city } = args
  const url   = listingUrl(listingId)
  const claim = claimUrl(listingId)
  const location = city === 'Portland' ? 'Portland' : city

  const subject = `${businessName} — your photo studio listing on FindStudioSpace`

  const text = [
    `Hi,`,
    ``,
    `I run FindStudioSpace, a directory where photographers and production crews in ${location} search for photo studio rentals. Your studio is listed at ${url}.`,
    ``,
    `We get photographer inquiries daily — I want to make sure your listing has accurate pricing, availability, and a direct contact so inquiries reach you.`,
    ``,
    `Claiming your listing is free and takes about five minutes: ${claim}`,
    ``,
    `If you'd rather I just update something specific, reply here and I'll handle it.`,
    ``,
    footerText(),
  ].join('\n')

  const html = wrapHtml(`
<p style="font-size:15px;margin:0 0 16px;">Hi,</p>
<p style="font-size:15px;margin:0 0 16px;">
  I run FindStudioSpace, a directory where photographers and production crews in ${escHtml(location)} search for photo studio rentals. Your studio is listed at
  <a href="${url}" style="color:#1A6B3C;">${url}</a>.
</p>
<p style="font-size:15px;margin:0 0 16px;">
  We get photographer inquiries daily — I want to make sure your listing has accurate pricing, availability, and a direct contact so inquiries reach you.
</p>
<p style="font-size:15px;margin:0 0 16px;">
  Claiming your listing is free and takes about five minutes:
  <a href="${claim}" style="color:#1A6B3C;">${claim}</a>
</p>
<p style="font-size:15px;margin:0 0 0;">
  If you'd rather I just update something specific, reply here and I'll handle it.
</p>`)

  return { subject, text, html, slug: 'photo-v1' }
}

function makerTemplate(args: OutreachEmailArgs): OutreachEmail {
  const { businessName, listingId, city } = args
  const url   = listingUrl(listingId)
  const claim = claimUrl(listingId)
  const location = city === 'Portland' ? 'Portland' : city

  const subject = `${businessName} — your workshop listing on FindStudioSpace`

  const text = [
    `Hi,`,
    ``,
    `I run FindStudioSpace, a directory where makers, builders, and craftspeople in ${location} search for shared workshop and studio space. You're listed at ${url}.`,
    ``,
    `Monthly workspace inquiries come through the site regularly. I'd like to make sure your listing reflects what you actually have available — tools, hours, membership types, pricing.`,
    ``,
    `Claim your listing free: ${claim}`,
    ``,
    `Or just reply here if you'd like me to update anything directly.`,
    ``,
    footerText(),
  ].join('\n')

  const html = wrapHtml(`
<p style="font-size:15px;margin:0 0 16px;">Hi,</p>
<p style="font-size:15px;margin:0 0 16px;">
  I run FindStudioSpace, a directory where makers, builders, and craftspeople in ${escHtml(location)} search for shared workshop and studio space. You're listed at
  <a href="${url}" style="color:#1A6B3C;">${url}</a>.
</p>
<p style="font-size:15px;margin:0 0 16px;">
  Monthly workspace inquiries come through the site regularly. I'd like to make sure your listing reflects what you actually have available — tools, hours, membership types, pricing.
</p>
<p style="font-size:15px;margin:0 0 16px;">
  Claim your listing free: <a href="${claim}" style="color:#1A6B3C;">${claim}</a>
</p>
<p style="font-size:15px;margin:0 0 0;">
  Or just reply here if you'd like me to update anything directly.
</p>`)

  return { subject, text, html, slug: 'maker-v1' }
}

function eventTemplate(args: OutreachEmailArgs): OutreachEmail {
  const { businessName, listingId, city } = args
  const url   = listingUrl(listingId)
  const claim = claimUrl(listingId)
  const location = city === 'Portland' ? 'Portland' : city

  const subject = `${businessName} — your event space listing on FindStudioSpace`

  const text = [
    `Hi,`,
    ``,
    `I run FindStudioSpace — a directory where people in ${location} search for private event space, photo shoots, and creative workspace. Your venue is listed at ${url}.`,
    ``,
    `If you rent your space for private events, photo shoots, or productions, I'd like to make sure your listing is accurate and routing inquiries to the right contact.`,
    ``,
    `Claim your listing free: ${claim}`,
    ``,
    `Happy to update details directly if you reply here instead.`,
    ``,
    footerText(),
  ].join('\n')

  const html = wrapHtml(`
<p style="font-size:15px;margin:0 0 16px;">Hi,</p>
<p style="font-size:15px;margin:0 0 16px;">
  I run FindStudioSpace — a directory where people in ${escHtml(location)} search for private event space, photo shoots, and creative workspace. Your venue is listed at
  <a href="${url}" style="color:#1A6B3C;">${url}</a>.
</p>
<p style="font-size:15px;margin:0 0 16px;">
  If you rent your space for private events, photo shoots, or productions, I'd like to make sure your listing is accurate and routing inquiries to the right contact.
</p>
<p style="font-size:15px;margin:0 0 16px;">
  Claim your listing free: <a href="${claim}" style="color:#1A6B3C;">${claim}</a>
</p>
<p style="font-size:15px;margin:0 0 0;">
  Happy to update details directly if you reply here instead.
</p>`)

  return { subject, text, html, slug: 'event-v1' }
}

function podcastTemplate(args: OutreachEmailArgs): OutreachEmail {
  const { businessName, listingId, city } = args
  const url   = listingUrl(listingId)
  const claim = claimUrl(listingId)
  const location = city === 'Portland' ? 'Portland' : city

  const subject = `${businessName} — your podcast studio listing on FindStudioSpace`

  const text = [
    `Hi,`,
    ``,
    `I run FindStudioSpace — a directory where podcasters and content creators in ${location} search for recording studio and sound booth rentals. You're listed at ${url}.`,
    ``,
    `Searches for "podcast studio Portland" and "podcast recording studio near me" drive several hundred visitors a month to the site. I want to make sure your listing has the right contact and pricing.`,
    ``,
    `Claim your listing free: ${claim}`,
    ``,
    `Or reply here if you'd prefer I update it directly.`,
    ``,
    footerText(),
  ].join('\n')

  const html = wrapHtml(`
<p style="font-size:15px;margin:0 0 16px;">Hi,</p>
<p style="font-size:15px;margin:0 0 16px;">
  I run FindStudioSpace — a directory where podcasters and content creators in ${escHtml(location)} search for recording studio and sound booth rentals. You're listed at
  <a href="${url}" style="color:#1A6B3C;">${url}</a>.
</p>
<p style="font-size:15px;margin:0 0 16px;">
  Searches for &ldquo;podcast studio Portland&rdquo; drive several hundred visitors a month to the site. I want to make sure your listing has the right contact and pricing.
</p>
<p style="font-size:15px;margin:0 0 16px;">
  Claim your listing free: <a href="${claim}" style="color:#1A6B3C;">${claim}</a>
</p>
<p style="font-size:15px;margin:0 0 0;">
  Or reply here if you'd prefer I update it directly.
</p>`)

  return { subject, text, html, slug: 'podcast-v1' }
}

function genericTemplate(args: OutreachEmailArgs): OutreachEmail {
  const { businessName, listingId, city } = args
  const url   = listingUrl(listingId)
  const claim = claimUrl(listingId)
  const location = city === 'Portland' ? 'Portland' : city

  const subject = `${businessName} — your studio listing on FindStudioSpace`

  const text = [
    `Hi,`,
    ``,
    `I run FindStudioSpace, a directory where artists, makers, and small businesses in ${location} search for monthly studio and workspace rentals. You're listed at ${url}.`,
    ``,
    `I'd like to make sure your listing is accurate and that rental inquiries are going to the right place.`,
    ``,
    `Claim your listing free: ${claim}`,
    ``,
    `Or reply here if it's easier.`,
    ``,
    footerText(),
  ].join('\n')

  const html = wrapHtml(`
<p style="font-size:15px;margin:0 0 16px;">Hi,</p>
<p style="font-size:15px;margin:0 0 16px;">
  I run FindStudioSpace, a directory where artists, makers, and small businesses in ${escHtml(location)} search for monthly studio and workspace rentals. You're listed at
  <a href="${url}" style="color:#1A6B3C;">${url}</a>.
</p>
<p style="font-size:15px;margin:0 0 16px;">
  I'd like to make sure your listing is accurate and that rental inquiries are going to the right place.
</p>
<p style="font-size:15px;margin:0 0 16px;">
  Claim your listing free: <a href="${claim}" style="color:#1A6B3C;">${claim}</a>
</p>
<p style="font-size:15px;margin:0 0 0;">
  Or reply here if it's easier.
</p>`)

  return { subject, text, html, slug: 'generic-v1' }
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Build a cold outreach email for a given template slug.
 * Requires assertCanSpamCompliant() to have passed before calling —
 * getMailingAddress() will throw if address isn't configured.
 */
export function buildOutreachEmail(
  slug: TemplateSlug,
  args: OutreachEmailArgs,
): OutreachEmail {
  switch (slug) {
    case 'photo-v1':   return photoTemplate(args)
    case 'maker-v1':   return makerTemplate(args)
    case 'event-v1':   return eventTemplate(args)
    case 'podcast-v1': return podcastTemplate(args)
    default:           return genericTemplate(args)
  }
}
