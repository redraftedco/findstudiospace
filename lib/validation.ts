const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length <= 254 && EMAIL_RE.test(email)
}

export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return ''
  return input.replace(/<[^>]*>/g, '').trim()
}

export function isValidString(
  value: unknown,
  opts: { min?: number; max?: number } = {},
): value is string {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (opts.min !== undefined && trimmed.length < opts.min) return false
  if (opts.max !== undefined && trimmed.length > opts.max) return false
  return true
}

export function parsePositiveInt(value: unknown): number | null {
  if (value === null || value === undefined) return null
  const num = typeof value === 'number' ? value : parseInt(String(value), 10)
  if (!Number.isFinite(num) || num < 1 || !Number.isInteger(num)) return null
  return num
}

export function isValidNumber(
  value: unknown,
  opts: { min?: number; max?: number } = {},
): boolean {
  const num = Number(value)
  if (!Number.isFinite(num)) return false
  if (opts.min !== undefined && num < opts.min) return false
  if (opts.max !== undefined && num > opts.max) return false
  return true
}

export function isOneOf<T>(value: unknown, allowed: readonly T[]): value is T {
  return allowed.includes(value as T)
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(
  key: string,
  opts: { windowMs: number; maxRequests: number },
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now >= entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + opts.windowMs })
    return { allowed: true, retryAfterMs: 0 }
  }

  if (entry.count >= opts.maxRequests) {
    return { allowed: false, retryAfterMs: entry.resetAt - now }
  }

  entry.count++
  return { allowed: true, retryAfterMs: 0 }
}

setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore) {
    if (now >= entry.resetAt) rateLimitStore.delete(key)
  }
}, 60_000).unref?.()

export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}
