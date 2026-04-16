import 'server-only'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGINS = [
  'https://www.findstudiospace.com',
  'https://findstudiospace.com',
]

if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:3000', 'http://localhost:3001')
}

/**
 * Validates the request origin against allowed origins.
 * Returns a NextResponse with 403 if the origin is not allowed, or null if OK.
 */
export function checkOrigin(req: NextRequest): NextResponse | null {
  const origin = req.headers.get('origin')
  const referer = req.headers.get('referer')

  // Stripe webhooks have no origin/referer — they use signature verification instead
  if (!origin && !referer) return null

  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!origin && referer) {
    const refOrigin = new URL(referer).origin
    if (!ALLOWED_ORIGINS.includes(refOrigin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  return null
}

// In-memory rate limiter
const rateLimits = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now()
  const record = rateLimits.get(key)

  if (!record || now > record.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) return false
  record.count++
  return true
}

export function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}
