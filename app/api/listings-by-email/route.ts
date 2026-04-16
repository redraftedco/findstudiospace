import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { checkOrigin, rateLimit, getIP } from '@/lib/security'

export async function POST(req: NextRequest) {
  const originError = checkOrigin(req)
  if (originError) return originError

  const ip = getIP(req)
  if (!rateLimit(`email-lookup:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    )
  }

  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'email is required' }, { status: 400 })
    }

    const cleaned = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from('listings')
      .select('id, title, type, status, is_featured, stripe_subscription_id')
      .or(`submitted_by_email.eq.${cleaned},contact_email.eq.${cleaned}`)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Listings lookup error:', error)
      return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
    }

    return NextResponse.json({ listings: data || [] })
  } catch {
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
  }
}
