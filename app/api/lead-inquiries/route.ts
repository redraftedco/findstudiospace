import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { listing_id, name, email, message, website, form_started_at } = await req.json()

    // honeypot
    if (website) return NextResponse.json({ ok: true })

    // bot timing check
    if (!form_started_at || Date.now() - Number(form_started_at) < 3000) {
      return NextResponse.json({ ok: false, error: 'Please wait a moment before submitting.' }, { status: 400 })
    }

    if (!name || !email) {
      return NextResponse.json({ ok: false, error: 'Name and email are required.' }, { status: 400 })
    }

    const { data: listing } = await supabaseServer
      .from('listings')
      .select('contact_email, title')
      .eq('id', listing_id)
      .single()

    const { error } = await supabaseServer.from('lead_inquiries').insert([{
      listing_id,
      name,
      email,
      message,
      host_email: listing?.contact_email ?? null,
      directory_id: process.env.NEXT_PUBLIC_DIRECTORY_ID || 'findstudiospace',
    }])

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

    // Send host notification email — skip silently if contact_email is null
    if (listing?.contact_email) {
      try {
        const listingUrl = `https://www.findstudiospace.com/listing/${listing_id}`
        await resend.emails.send({
          from: 'hello@findstudiospace.com',
          to: listing.contact_email,
          subject: `New inquiry for ${listing.title}`,
          text: [
            `You have a new inquiry for your listing: ${listing.title}`,
            ``,
            `From: ${name}`,
            `Email: ${email}`,
            `Message: ${message || '(no message provided)'}`,
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
