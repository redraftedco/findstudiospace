import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

const TYPE_MAP: Record<string, string> = {
  'Art Studio': 'art',
  'Workshop': 'workshop',
  'Office': 'office',
  'Photo Studio': 'photo',
  'Retail': 'retail',
  'Fitness & Dance': 'fitness',
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { host_name, email, title, type, neighborhood, price_monthly, square_footage, description, amenities } = body

    if (!title || !email || !type || !neighborhood || !description || !price_monthly) {
      return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 })
    }

    const { error } = await supabaseServer.from('listings').insert([{
      title,
      description,
      type: TYPE_MAP[type] ?? type.toLowerCase(),
      neighborhood,
      price_monthly: Number(price_monthly),
      price_display: `$${price_monthly}/mo`,
      square_footage: square_footage ? Number(square_footage) : null,
      amenities: amenities ?? [],
      submitted_by_email: email,
      contact_email: email,
      directory_id: process.env.NEXT_PUBLIC_DIRECTORY_ID || 'findstudiospace',
      city: 'Portland',
      status: 'pending',
    }])

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
