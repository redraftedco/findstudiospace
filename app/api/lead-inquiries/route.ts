import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { Resend } from 'resend'
import {
  isValidEmail,
  isValidString,
  sanitizeText,
  parsePositiveInt,
  rateLimit,
  getClientIp,
} from '@/lib/validation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`inquiry:${ip}`, { windowMs: 15 * 60 * 1000, maxRequests: 5 })
    if (!rl.allowed) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
      )
    }

    const body = await req.json()
    const { listing_id, name, email, message, website, form_started_at } = body

    if (website) return NextResponse.json({ ok: true })

    const startedAt = Number(form_started_at)
    if (!Number.isFinite(startedAt) || startedAt > Date.now() || Date.now() - startedAt < 2000) {
      return NextResponse.json(
        { ok: false, error: 'Please wait a moment before submitting.' },
        { status: 400 },
      )
    }

    if (!isValidString(name, { min: 1, max: 200 })) {
      return NextResponse.json({ ok: false, error: 'A valid name is required.' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'A valid email is required.' }, { status: 400 })
    }
    if (message && !isValidString(message, { max: 5000 })) {
      return NextResponse.json({ ok: false, error: 'Message is too long.' }, { status: 400 })
    }

    const listingId = parsePositiveInt(listing_id)
    if (!listingId) {
      return NextResponse.json({ ok: false, error: 'Valid listing ID is required.' }, { status: 400 })
    }

    const sanitizedName = sanitizeText(name)
    const sanitizedMessage = sanitizeText(message)

    const { data: listing } = await supabaseServer
      .from('listings')
      .select('contact_email, title')
      .eq('id', listingId)
      .single()

    if (!listing) {
      return NextResponse.json({ ok: false, error: 'Listing not found.' }, { status: 404 })
    }

    const { error } = await supabaseServer.from('lead_inquiries').insert([{
      listing_id: listingId,
      name: sanitizedName,
      email: email.trim().toLowerCase(),
      message: sanitizedMessage,
      host_email: listing.contact_email ?? null,
      directory_id: process.env.NEXT_PUBLIC_DIRECTORY_ID || 'findstudiospace',
    }])

    if (error) {
      console.error('Lead inquiry insert error:', error.code)
      return NextResponse.json({ ok: false, error: 'Failed to save inquiry.' }, { status: 500 })
    }

    if (listing.contact_email) {
      try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.findstudiospace.com'
        const listingUrl = `${siteUrl}/listing/${listingId}`
        await resend.emails.send({
          from: 'hello@findstudiospace.com',
          to: listing.contact_email,
          subject: `New inquiry for ${listing.title}`,
          text: [
            `You have a new inquiry for your listing: ${listing.title}`,
            ``,
            `From: ${sanitizedName}`,
            `Email: ${email}`,
            `Message: ${sanitizedMessage || '(no message provided)'}`,
            ``,
            `View your listing: ${listingUrl}`,
          ].join('\n'),
        })
      } catch {
        // Email failure must never block the inquiry from being saved
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Something went wrong.' }, { status: 500 })
  }
}
