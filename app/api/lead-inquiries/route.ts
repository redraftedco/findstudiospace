import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

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
      .select('contact_email')
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

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Something went wrong.' }, { status: 500 })
  }
}
