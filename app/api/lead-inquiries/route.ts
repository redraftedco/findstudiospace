import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const MIN_FORM_FILL_MS = 3000

type InquiryPayload = {
  listing_id?: string
  name?: string
  email?: string
  message?: string
  website?: string
  form_started_at?: number | null
}

export async function POST(request: Request) {
  const body = (await request.json()) as InquiryPayload

  const { listing_id, name, email, message, website, form_started_at } = body

  if (website && website.trim().length > 0) {
    return NextResponse.json({ message: 'Inquiry sent successfully.' }, { status: 200 })
  }

  if (!listing_id || !name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  if (!form_started_at || Date.now() - form_started_at < MIN_FORM_FILL_MS) {
    return NextResponse.json({ error: 'Please wait a moment before submitting.' }, { status: 400 })
  }

  const { error } = await supabase.from('lead_inquiries').insert({
    listing_id,
    name,
    email,
    message,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Inquiry sent successfully.' }, { status: 200 })
}
