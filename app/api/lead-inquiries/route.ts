import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { Resend } from 'resend'
import { checkOrigin } from '@/lib/security'

const resend = new Resend(process.env.RESEND_API_KEY)

// In-memory rate limiter — resets on server restart
// Limit: 3 submissions per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3
const RATE_WINDOW_MS = 10 * 60 * 1000

function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }

  if (record.count >= RATE_LIMIT) return false

  record.count++
  return true
}

function stripHtml(str: string): string {
  return str.replace(/(<([^>]+)>)/gi, '').trim()
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  const originError = checkOrigin(req)
  if (originError) return originError

  try {
    // Rate limit check
    const ip = getIP(req)
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please wait before submitting again.' },
        { status: 429 }
      )
    }

    const { listing_id, name, email, message, website, form_started_at, utm_source, utm_medium, utm_campaign } = await req.json()

    // Honeypot
    if (website) return NextResponse.json({ ok: true })

    // Bot timing check
    if (!form_started_at || Date.now() - Number(form_started_at) < 3000) {
      return NextResponse.json({ ok: false, error: 'Please wait a moment before submitting.' }, { status: 400 })
    }

    // Input validation
    if (!name || !email) {
      return NextResponse.json({ ok: false, error: 'Name and email are required.' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email address.' }, { status: 400 })
    }

    if (!listing_id || isNaN(parseInt(listing_id))) {
      return NextResponse.json({ ok: false, error: 'Invalid listing.' }, { status: 400 })
    }

    // Sanitize inputs
    const cleanName = stripHtml(String(name)).slice(0, 100)
    const cleanEmail = String(email).trim().toLowerCase().slice(0, 200)
    const cleanMessage = message ? stripHtml(String(message)).slice(0, 2000) : ''

    const { data: listing } = await supabaseServer
      .from('listings')
      .select('contact_email, owner_email, title, tier, type')
      .eq('id', parseInt(listing_id))
      .single()

    // Lead routing policy:
    // - Pro listing with verified owner email => exclusive lead delivery.
    // - Free/unknown tier => shared delivery (host + platform copy).
    const PLATFORM_EMAIL = 'redraftedco@gmail.com'
    const recipientEmail = listing?.owner_email || listing?.contact_email || null
    const isProExclusive = listing?.tier === 'pro' && !!listing?.owner_email
    const leadRouteMode = isProExclusive ? 'exclusive' : 'shared'
    const notifyRecipients = Array.from(new Set(
      leadRouteMode === 'exclusive'
        ? [listing?.owner_email].filter(Boolean)
        : [recipientEmail, PLATFORM_EMAIL].filter(Boolean)
    ))

    const { error } = await supabaseServer.from('lead_inquiries').insert([{
      listing_id: parseInt(listing_id),
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      host_email: recipientEmail,
      directory_id: process.env.NEXT_PUBLIC_DIRECTORY_ID || 'findstudiospace',
      utm_source: utm_source ? String(utm_source).slice(0, 100) : null,
      utm_medium: utm_medium ? String(utm_medium).slice(0, 100) : null,
      utm_campaign: utm_campaign ? String(utm_campaign).slice(0, 100) : null,
    }])

    if (error) return NextResponse.json({ ok: false, error: 'Something went wrong.' }, { status: 500 })

    const listingTitle = listing?.title ?? 'your listing'
    const listingUrl = `https://www.findstudiospace.com/listing/${listing_id}`

    // Host notification — always fires (platform email if no host email on file)
    try {
      await resend.emails.send({
        from: 'hello@findstudiospace.com',
        to: notifyRecipients,
        subject: `New inquiry for ${listingTitle}`,
        text: [
          recipientEmail ? `You have a new inquiry for your listing: ${listingTitle}` : `[No host email on file — forward manually]\nNew inquiry for: ${listingTitle}`,
          `Lead routing: ${leadRouteMode}`,
          `Listing type: ${listing?.type ?? 'unknown'}`,
          ``,
          `From: ${cleanName}`,
          `Email: ${cleanEmail}`,
          `Message: ${cleanMessage || '(no message provided)'}`,
          ``,
          `View listing: ${listingUrl}`,
        ].join('\n'),
      })
    } catch {
      // Email failure must never block the inquiry from being saved
    }

    // Renter confirmation
    try {
      await resend.emails.send({
        from: 'hello@findstudiospace.com',
        to: cleanEmail,
        subject: `We got your inquiry for ${listingTitle}`,
        text: [
          `Hi ${cleanName},`,
          ``,
          `Got it — we'll connect you with ${listingTitle} within 24 hours.`,
          ``,
          `Your message: ${cleanMessage || '(none)'}`,
          ``,
          `— FindStudioSpace`,
          `https://www.findstudiospace.com`,
        ].join('\n'),
      })
    } catch {
      // Email failure must never block the inquiry from being saved
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Something went wrong.' }, { status: 500 })
  }
}
