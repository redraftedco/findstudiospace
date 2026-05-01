import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const listingId = searchParams.get('listing_id')
  const siteUrl = 'https://www.findstudiospace.com'

  if (!code || !listingId) {
    return NextResponse.redirect(`${siteUrl}/claim`)
  }

  const id = parseInt(listingId, 10)
  if (isNaN(id)) {
    return NextResponse.redirect(`${siteUrl}/claim`)
  }

  const res = NextResponse.redirect(`${siteUrl}/dashboard/${id}`)

  // Exchange the auth code for a session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !user) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(`${siteUrl}/claim?error=auth_failed`)
  }

  // Set ownership if not already claimed
  const { data: listing } = await supabaseService
    .from('listings')
    .select('owner_user_id, owner_email, contact_email')
    .eq('id', id)
    .eq('status', 'active')
    .single()

  const userEmail = user.email?.toLowerCase() ?? ''
  const ownerEmail = listing?.owner_email ? String(listing.owner_email).toLowerCase() : null
  const contactEmail = listing?.contact_email ? String(listing.contact_email).toLowerCase() : null
  const emailMatches = userEmail !== '' && (userEmail === ownerEmail || userEmail === contactEmail)

  if (listing?.owner_user_id) {
    if (listing.owner_user_id === user.id) return res
    return NextResponse.redirect(`${siteUrl}/claim/${id}?error=ownership_mismatch`)
  }

  if (listing && emailMatches) {
    await supabaseService
      .from('listings')
      .update({
        owner_user_id: user.id,
        owner_email: userEmail,
        claimed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .is('owner_user_id', null)

    return res
  }

  return NextResponse.redirect(`${siteUrl}/claim/${id}?error=ownership_mismatch`)
}
