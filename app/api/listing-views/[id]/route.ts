import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import { signToken, verifyToken, hashIP } from '@/lib/views'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const COOKIE_NAME = 'fss_vt'
const DEDUP_MINUTES = 30

type RouteContext = { params: Promise<{ id: string }> }

/** POST — record a view, set dedup cookie, return 204 */
export async function POST(req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params
  const listingId = parseInt(id, 10)
  if (isNaN(listingId)) {
    return new NextResponse(null, { status: 400 })
  }

  // Read or generate visitor token
  const rawCookie = req.cookies.get(COOKIE_NAME)?.value
  let visitorToken = rawCookie ? verifyToken(rawCookie) : null
  const isNewVisitor = !visitorToken
  if (!visitorToken) {
    visitorToken = randomUUID()
  }

  // Hash IP for secondary dedup
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  const ipHash = hashIP(ip)

  // Dedup: check if this visitor OR this IP viewed this listing in last 30 min
  const cutoff = new Date(Date.now() - DEDUP_MINUTES * 60 * 1000).toISOString()

  const { data: existing } = await supabase
    .from('listing_views')
    .select('id')
    .eq('listing_id', listingId)
    .gte('viewed_at', cutoff)
    .or(`visitor_token.eq.${visitorToken},ip_hash.eq.${ipHash}`)
    .limit(1)

  if (!existing || existing.length === 0) {
    await supabase.from('listing_views').insert({
      listing_id: listingId,
      visitor_token: visitorToken,
      ip_hash: ipHash,
    })
  }

  // Set or refresh the signed cookie
  const res = new NextResponse(null, { status: 204 })
  if (isNewVisitor || !rawCookie) {
    res.cookies.set(COOKIE_NAME, signToken(visitorToken), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    })
  }

  return res
}

/** GET — return view count for last 30 days, cached 60s */
export async function GET(_req: NextRequest, ctx: RouteContext) {
  const { id } = await ctx.params
  const listingId = parseInt(id, 10)
  if (isNaN(listingId)) {
    return NextResponse.json({ count: 0 }, { status: 400 })
  }

  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const { count } = await supabase
    .from('listing_views')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', listingId)
    .gte('viewed_at', cutoff)

  return NextResponse.json(
    { count: count ?? 0 },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    }
  )
}
