/**
 * lib/enrichment/classifyContent.ts
 *
 * Keyword-based content classifier. Given raw HTML from a venue's website,
 * returns a content_signals object written to acquisition_targets.content_signals.
 *
 * Signals detected:
 *   private_event    — venue explicitly advertises private event hosting
 *   has_pricing      — pricing information visible on the page
 *   accepts_bookings — booking / inquiry CTA present
 *   has_rental_lang  — uses "rent", "rental", or "hire" language (vs. class/membership only)
 *
 * Precision target: ~85% for the Portland creative studio use case.
 * Low-volume (170 targets) — regex MVP is appropriate. No ML needed.
 */

export type ContentSignals = {
  private_event:    boolean
  has_pricing:      boolean
  accepts_bookings: boolean
  has_rental_lang:  boolean
}

// ── Keyword sets ───────────────────────────────────────────────────────────

const PRIVATE_EVENT_KWS = [
  'private event',
  'host your event',
  'venue rental',
  'event hosting',
  'rent our space',
  'book the space',
  'book our venue',
  'book our space',
  'private parties',
  'private hire',
  'corporate event',
  'special events',
  'event rental',
  'book a private',
]

const PRICING_KWS = [
  '/hour', 'per hour', '/hr', 'per hr',
  '/day', 'per day',
  '/month', 'per month',
  'starting at $', 'starting from $',
  'rates from', 'pricing starts',
  'day rate', 'hourly rate', 'half day',
]

const BOOKING_KWS = [
  'book now', 'book a tour', 'schedule a tour',
  'request a quote', 'get a quote', 'check availability',
  'contact us to book', 'inquire now', 'send inquiry',
  'reserve this space', 'request booking',
  'click to book', 'book online',
]

const RENTAL_KWS = [
  'rent ', 'rental', ' hire',
  'available for rent', 'space for rent',
  'studio for rent', 'available to rent',
  'month-to-month', 'monthly rental',
]

// ── Classifier ─────────────────────────────────────────────────────────────

function countMatches(haystack: string, keywords: string[]): number {
  let count = 0
  for (const kw of keywords) {
    if (haystack.includes(kw)) count++
  }
  return count
}

/**
 * Classify a scraped HTML page.
 *
 * @param html  Raw HTML string (homepage / contact / about combined is fine)
 * @returns     ContentSignals — all booleans
 */
export function classifyContent(html: string): ContentSignals {
  // Strip tags and normalise to lowercase for reliable matching.
  // Intentionally simple: no DOM parser needed for keyword extraction.
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()

  return {
    private_event:    countMatches(text, PRIVATE_EVENT_KWS) >= 2,
    has_pricing:      countMatches(text, PRICING_KWS)       >= 1,
    accepts_bookings: countMatches(text, BOOKING_KWS)       >= 1,
    has_rental_lang:  countMatches(text, RENTAL_KWS)        >= 1,
  }
}

/**
 * Score 0–100 for acquisition_priority.
 *
 * Formula: additive bonus on base of 40.
 *   +15  rating_count >= 10 (established business)
 *   +10  rating_average >= 4.0
 *   +15  private_event signal
 *   +10  has_pricing signal
 *   +10  accepts_bookings signal
 *   -20  no website found (enrichment couldn't get website)
 *
 * Result clamped to [0, 100].
 */
export function scoreAcquisitionPriority(opts: {
  rating_count:   number | null
  rating_average: number | null
  has_website:    boolean
  signals:        ContentSignals | null
}): number {
  let score = 40
  if ((opts.rating_count ?? 0) >= 10) score += 15
  if ((opts.rating_average ?? 0) >= 4.0) score += 10
  if (!opts.has_website) score -= 20
  if (opts.signals?.private_event)    score += 15
  if (opts.signals?.has_pricing)      score += 10
  if (opts.signals?.accepts_bookings) score += 10
  return Math.min(100, Math.max(0, score))
}
