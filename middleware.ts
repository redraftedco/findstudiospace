import { NextRequest, NextResponse } from 'next/server'

type Entry = { count: number; resetAt: number }

const store = new Map<string, Entry>()

const WINDOW_MS = 60_000
const LIMITS: Record<string, number> = {
  '/api/lead-inquiries': 12,
  '/api/claim/send-magic-link': 8,
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function isLimited(pathname: string): boolean {
  return Object.prototype.hasOwnProperty.call(LIMITS, pathname)
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!isLimited(pathname)) return NextResponse.next()

  const limit = LIMITS[pathname]
  const key = `${pathname}:${clientIp(req)}`
  const now = Date.now()
  const current = store.get(key)

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return NextResponse.next()
  }

  if (current.count >= limit) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((current.resetAt - now) / 1000)),
          'Cache-Control': 'no-store',
        },
      },
    )
  }

  current.count += 1
  store.set(key, current)
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/lead-inquiries', '/api/claim/send-magic-link'],
}
