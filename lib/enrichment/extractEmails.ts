/**
 * lib/enrichment/extractEmails.ts
 *
 * Pure function: given raw HTML and an optional preferred domain, returns up
 * to 3 candidate contact email addresses found in the page content.
 *
 * Handles common obfuscation patterns:
 *   [at] (at) &#64; &#x40;   → @
 *   [dot] (dot)               → .
 *   "user at domain dot com"  → user@domain.com  (context-anchored)
 *
 * Filters obvious garbage: noreply, mailer-daemon, WordPress admin,
 * sentry.io, example.com, and similar service addresses.
 *
 * preferDomain sorts emails whose domain matches the studio's own site first,
 * so "hello@studiosix.com" ranks above "info@gmail.com" when
 * preferDomain = "studiosix.com".
 */

// RFC 5321-compatible email regex (no lookbehind for broad Node compat)
const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g

// Local-part prefixes that are never actionable contact addresses
const BLOCKED_LOCAL =
  /^(noreply|no-reply|donotreply|do-not-reply|postmaster|mailer-daemon|abuse|bounce|wordpress|admin|root|info-noreply)$/i

// Service / transactional / placeholder domains
const BLOCKED_DOMAIN =
  /\b(sentry\.io|ingest\.sentry\.io|example\.(com|org|net)|test\.(com|org|net)|mailchimp\.com|list-manage\.com|constantcontact\.com|sendgrid\.net|gravatar\.com|wpengine\.com|akismet\.com|wpcf7\.com|squarespace\.com)\b/i

// ── Obfuscation normalizer ────────────────────────────────────────────────────

function normalizeObfuscations(text: string): string {
  return (
    text
      // HTML character references
      .replace(/&#64;/g, '@')
      .replace(/&#x40;/gi, '@')
      .replace(/&amp;/gi, '&')
      // Bracket / paren variants — safe to replace globally
      .replace(/\[at\]/gi, '@')
      .replace(/\(at\)/gi, '@')
      .replace(/\[dot\]/gi, '.')
      .replace(/\(dot\)/gi, '.')
      // Spaced-word variants anchored to email-like context to avoid false
      // positives (e.g. "look at the studio" must NOT become "look@the studio")
      .replace(
        /([a-zA-Z0-9._%+\-]+)\s+at\s+([a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/gi,
        '$1@$2',
      )
      .replace(
        /([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9\-]+)\s+dot\s+([a-zA-Z]{2,})/gi,
        '$1.$2',
      )
  )
}

// ── High-signal extractors ─────────────────────────────────────────────────

/**
 * Parse mailto: href attributes from raw HTML.
 * These are the highest-signal emails — explicitly linked by the site owner.
 *
 * Handles: href="mailto:info@studio.com" and href="mailto:info@studio.com?subject=..."
 */
const MAILTO_RE = /href=["']mailto:([^"'?\s]+)/gi

function parseMailtoHrefs(html: string): string[] {
  const results: string[] = []
  let m: RegExpExecArray | null
  // Reset lastIndex before loop (global regex)
  MAILTO_RE.lastIndex = 0
  while ((m = MAILTO_RE.exec(html)) !== null) {
    const raw = m[1].toLowerCase().trim()
    if (raw && raw.includes('@')) results.push(raw)
  }
  return results
}

/**
 * Extract text content from the <footer> element only.
 * Emails in page footers are the second-highest signal — intentionally placed
 * contact info rather than incidental mentions in body copy.
 */
function extractFooterHtml(html: string): string {
  const lower = html.toLowerCase()
  const start = lower.indexOf('<footer')
  if (start === -1) return ''
  const end = lower.indexOf('</footer>', start)
  return end === -1 ? html.slice(start) : html.slice(start, end + 9)
}

// ── Shared validator ───────────────────────────────────────────────────────

function validateEmail(candidate: string): string | null {
  const email = candidate.toLowerCase().trim()
  if (email.length > 254) return null
  const atIdx = email.lastIndexOf('@')
  if (atIdx < 1) return null
  const local  = email.slice(0, atIdx)
  const domain = email.slice(atIdx + 1)
  const tld    = domain.split('.').pop()
  if (!tld || tld.length < 2 || !/^[a-z]+$/.test(tld)) return null
  if (BLOCKED_LOCAL.test(local))   return null
  if (BLOCKED_DOMAIN.test(domain)) return null
  return email
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Extract valid contact emails from raw HTML.
 *
 * Priority order (highest signal first):
 *   1. mailto: href attributes — explicitly linked by the site owner
 *   2. Emails found in the <footer> element
 *   3. All other emails found in body text
 *
 * @param html          Raw HTML string (up to 5 MB recommended)
 * @param preferDomain  Bare hostname, e.g. "studiosix.com". Matching emails
 *                      are promoted within each tier.
 * @returns             Up to 3 unique, validated candidate email strings
 *                      (all lower-cased).
 */
export function extractEmails(html: string, preferDomain?: string): string[] {
  const normalized = normalizeObfuscations(html)

  // Tier 1 — mailto: hrefs
  const mailtoEmails = parseMailtoHrefs(normalized)
    .map(validateEmail)
    .filter((e): e is string => e !== null)

  // Tier 2 — footer text
  const footerHtml   = extractFooterHtml(normalized)
  const footerEmails = (footerHtml.match(EMAIL_RE) ?? [])
    .map(validateEmail)
    .filter((e): e is string => e !== null)

  // Tier 3 — full page body
  const bodyEmails = (normalized.match(EMAIL_RE) ?? [])
    .map(validateEmail)
    .filter((e): e is string => e !== null)

  // Merge in priority order, deduplicated
  const seen  = new Set<string>()
  const valid: string[] = []
  for (const e of [...mailtoEmails, ...footerEmails, ...bodyEmails]) {
    if (!seen.has(e)) { seen.add(e); valid.push(e) }
  }

  if (!preferDomain) return valid.slice(0, 3)

  const preferred = valid.filter(
    e => e.endsWith(`@${preferDomain}`) || e.includes(`.${preferDomain}`),
  )
  const others = valid.filter(e => !preferred.includes(e))
  return [...preferred, ...others].slice(0, 3)
}
