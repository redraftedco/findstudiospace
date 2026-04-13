import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { host_name, email, title, type, neighborhood, price_display, niche_attributes, description } = body

    if (!title || !email || !type || !description) {
      return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 })
    }

    const typeMap: Record<string, string> = {
      'Art Studio': 'art',
      'Workshop': 'workshop',
      'Office': 'office',
      'Photo Studio': 'photo',
      'Retail': 'retail',
      'Fitness & Dance': 'fitness',
    }

    const { error } = await supabaseServer.from('listings').insert([{
      title,
      description,
      type: typeMap[type] ?? type.toLowerCase(),
      neighborhood,
      price_display,
      niche_attributes,
      submitted_by_email: email,
      contact_email: email,
      city: 'Portland',
      status: 'pending',
      is_featured: false,
    }])

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
