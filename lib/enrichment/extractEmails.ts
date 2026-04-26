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

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Extract valid contact emails from raw HTML.
 *
 * @param html          Raw HTML string (up to 5 MB recommended)
 * @param preferDomain  Bare hostname, e.g. "studiosix.com". Matching emails
 *                      are promoted to the front of the returned array.
 * @returns             Up to 3 unique, validated candidate email strings
 *                      (all lower-cased).
 */
export function extractEmails(html: string, preferDomain?: string): string[] {
  const normalized = normalizeObfuscations(html)
  const raw = normalized.match(EMAIL_RE) ?? []

  const seen = new Set<string>()
  const valid: string[] = []

  for (const candidate of raw) {
    const email = candidate.toLowerCase()
    if (seen.has(email)) continue
    seen.add(email)

    // RFC 5321 max length
    if (email.length > 254) continue

    const atIdx = email.lastIndexOf('@')
    if (atIdx < 1) continue

    const local  = email.slice(0, atIdx)
    const domain = email.slice(atIdx + 1)

    // TLD must be 2+ alpha chars
    const tld = domain.split('.').pop()
    if (!tld || tld.length < 2 || !/^[a-z]+$/.test(tld)) continue

    if (BLOCKED_LOCAL.test(local))   continue
    if (BLOCKED_DOMAIN.test(domain)) continue

    valid.push(email)
  }

  if (!preferDomain) return valid.slice(0, 3)

  const preferred = valid.filter(
    e => e.endsWith(`@${preferDomain}`) || e.includes(`.${preferDomain}`),
  )
  const others = valid.filter(e => !preferred.includes(e))
  return [...preferred, ...others].slice(0, 3)
}
