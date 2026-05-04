import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, listing_id } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const id = parseInt(listing_id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Valid listing_id required' }, { status: 400 })
    }

    // Check listing exists and is not already claimed
    const { data: listing } = await supabaseService
      .from('listings')
      .select('id, owner_user_id, owner_email, contact_email')
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (listing.owner_user_id) {
      return NextResponse.json(
        { error: 'This listing has already been claimed. If you\'re the rightful owner, contact hello@findstudiospace.com.' },
        { status: 409 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    const ownerEmail = listing.owner_email ? String(listing.owner_email).toLowerCase() : null
    const contactEmail = listing.contact_email ? String(listing.contact_email).toLowerCase() : null
    const canVerify = ownerEmail || contactEmail

    if (!canVerify) {
      return NextResponse.json(
        { error: 'This listing cannot be claimed online yet. Contact hello@findstudiospace.com.' },
        { status: 403 }
      )
    }

    const siteUrl = 'https://www.findstudiospace.com'

    // Don't reveal whether the email matched — prevents enumeration of emails on file.
    // If no match, silently succeed so both branches look identical to the caller.
    if (normalizedEmail !== ownerEmail && normalizedEmail !== contactEmail) {
      return NextResponse.json({ sent: true })
    }

    // Send magic link via Supabase Auth (uses built-in 60s rate limit per email)
    const { error } = await supabaseAnon.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?listing_id=${id}`,
      },
    })

    if (error) {
      console.error('Magic link error:', error)
      if (error.message?.includes('rate') || error.status === 429) {
        return NextResponse.json(
          { error: 'Please wait a minute before requesting another link.' },
          { status: 429 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to send magic link. Try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sent: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
