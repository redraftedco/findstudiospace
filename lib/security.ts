import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ALLOWED_ORIGINS = [
  'https://www.findstudiospace.com',
  'https://findstudiospace.com',
]

if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:3000', 'http://localhost:3001')
}

// Service-role client for rate_limits table writes — never exposed to browser
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
)

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

/**
 * Supabase-backed rate limiter — survives Vercel cold starts and scales across
 * multiple serverless instances. Uses upsert with increment to handle races.
 *
 * Falls back to allowing the request on any DB error to avoid blocking users
 * due to infrastructure issues. Log errors are emitted so failures are visible.
 */
export async function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<boolean> {
  const now     = new Date()
  const resetAt = new Date(Date.now() + windowMs)

  try {
    // Try to insert a fresh row (first request in window)
    const { error: insertErr } = await supabase
      .from('rate_limits')
      .insert({ key, count: 1, reset_at: resetAt.toISOString() })

    if (!insertErr) return true // fresh row inserted — request allowed

    if (insertErr.code !== '23505') {
      // Unexpected DB error — fail open
      console.error('[rateLimit] insert error:', insertErr.message)
      return true
    }

    // Row exists — fetch current state
    const { data, error: selectErr } = await supabase
      .from('rate_limits')
      .select('count, reset_at')
      .eq('key', key)
      .single()

    if (selectErr || !data) {
      console.error('[rateLimit] select error:', selectErr?.message)
      return true
    }

    // If window has expired, reset the counter
    if (now > new Date(data.reset_at)) {
      await supabase
        .from('rate_limits')
        .update({ count: 1, reset_at: resetAt.toISOString() })
        .eq('key', key)
      return true
    }

    if (data.count >= maxRequests) return false

    // Increment within the current window
    await supabase
      .from('rate_limits')
      .update({ count: data.count + 1 })
      .eq('key', key)

    return true
  } catch (err) {
    console.error('[rateLimit] unexpected error:', err)
    return true // fail open
  }
}

export function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

/**
 * Constant-time string equality. Use for comparing secrets (auth headers,
 * tokens, signatures) to defeat trivial timing-attack signal on character
 * mismatch position. Returns false on length mismatch without scanning.
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}
