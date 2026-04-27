/**
 * lib/scraper/policy.ts
 *
 * Ethical scraping policy layer:
 *   - Branded User-Agent
 *   - robots.txt compliance (fetched per domain per invocation)
 *   - Per-domain in-memory throttle (1 req / 1000ms within a single run)
 *
 * Designed for nightly Vercel cron routes. In-memory state does not persist
 * between invocations — that is acceptable at 20–100 requests/night.
 *
 * Usage:
 *   const policy = new ScraperPolicy()
 *   if (!await policy.isAllowed('https://example.com/contact')) return
 *   await policy.throttle('https://example.com')
 *   const html = await fetchHtml(url, signal)
 */

export const BOT_UA =
  'FindStudioSpaceBot/1.0 (+https://findstudiospace.com/bot; contact: hello@findstudiospace.com)'

// ── robots.txt parser (User-agent: * rules only) ───────────────────────────

type RobotsRules = { disallowed: string[] }
const ROBOTS_CACHE = new Map<string, RobotsRules>()

async function fetchRobots(origin: string): Promise<RobotsRules> {
  const cached = ROBOTS_CACHE.get(origin)
  if (cached) return cached

  const rules: RobotsRules = { disallowed: [] }

  try {
    const res = await fetch(`${origin}/robots.txt`, {
      headers: { 'User-Agent': BOT_UA },
      signal: AbortSignal.timeout(5_000),
    })
    if (!res.ok) {
      ROBOTS_CACHE.set(origin, rules)
      return rules
    }

    const text = await res.text()
    let inWildcard = false

    for (const raw of text.split('\n')) {
      const line = raw.trim()
      if (line.startsWith('#') || !line) { inWildcard = false; continue }

      if (line.toLowerCase().startsWith('user-agent:')) {
        const ua = line.slice('user-agent:'.length).trim()
        inWildcard = ua === '*' || ua.toLowerCase().includes('findstudiospace')
        continue
      }

      if (inWildcard && line.toLowerCase().startsWith('disallow:')) {
        const path = line.slice('disallow:'.length).trim()
        if (path) rules.disallowed.push(path)
      }
    }
  } catch {
    // Network error — assume allowed (fail open, conservative but practical)
  }

  ROBOTS_CACHE.set(origin, rules)
  return rules
}

// ── Per-domain throttle ────────────────────────────────────────────────────

const LAST_REQUEST: Map<string, number> = new Map()
const MIN_GAP_MS = 1_000

// ── Public API ─────────────────────────────────────────────────────────────

export class ScraperPolicy {
  /**
   * Returns true if robots.txt allows scraping the given URL.
   * Always true for paths not mentioned in robots.txt.
   */
  async isAllowed(url: string): Promise<boolean> {
    try {
      const parsed = new URL(url)
      const rules = await fetchRobots(parsed.origin)
      const path  = parsed.pathname

      for (const disallowed of rules.disallowed) {
        if (disallowed === '/' || path.startsWith(disallowed)) return false
      }
      return true
    } catch {
      return true // malformed URL — let downstream handle it
    }
  }

  /**
   * Waits until the per-domain throttle allows a new request.
   * Guarantees at least MIN_GAP_MS between requests to the same domain.
   */
  async throttle(url: string): Promise<void> {
    try {
      const domain = new URL(url).hostname
      const last   = LAST_REQUEST.get(domain) ?? 0
      const wait   = Math.max(0, MIN_GAP_MS - (Date.now() - last))
      if (wait > 0) await new Promise(r => setTimeout(r, wait))
      LAST_REQUEST.set(domain, Date.now())
    } catch {
      // malformed URL — skip throttle
    }
  }

  /** Returns the branded User-Agent string. */
  get userAgent(): string { return BOT_UA }
}
