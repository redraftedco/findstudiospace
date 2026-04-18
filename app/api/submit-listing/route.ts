import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { checkOrigin } from '@/lib/security'
import { imageCountExceedsTier } from '@/lib/photo-limits'

const TYPE_MAP: Record<string, string> = {
  'Art Studio': 'art',
  'Workshop': 'workshop',
  'Office': 'office',
  'Photo Studio': 'photo',
  'Retail': 'retail',
  'Fitness & Dance': 'fitness',
}

const VALID_TYPES = new Set(Object.values(TYPE_MAP))

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
    const body = await req.json()
    const { host_name, email, title, type, neighborhood, price_monthly, square_footage, description, amenities, images } = body

    // Photo limit guard — new listings submit as free tier, so limit is 5.
    // Body does not currently include images (submission form has no upload
    // UI). Guard is prophylactic for a future upload surface; rejects oversized
    // payloads if anything starts sending them.
    if (images !== undefined && imageCountExceedsTier(images, 'free')) {
      return NextResponse.json({ success: false, error: 'Too many photos for free tier (max 5).' }, { status: 400 })
    }

    if (!title || !email || !type || !neighborhood || !description || !price_monthly) {
      return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address.' }, { status: 400 })
    }

    const mappedType = TYPE_MAP[type] ?? null
    if (!mappedType || !VALID_TYPES.has(mappedType)) {
      return NextResponse.json({ success: false, error: 'Invalid space type.' }, { status: 400 })
    }

    const priceNum = Number(price_monthly)
    if (isNaN(priceNum) || priceNum < 0) {
      return NextResponse.json({ success: false, error: 'Invalid price.' }, { status: 400 })
    }

    // Sanitize text inputs
    const cleanTitle = stripHtml(String(title)).slice(0, 200)
    const cleanDescription = stripHtml(String(description)).slice(0, 5000)
    const cleanNeighborhood = stripHtml(String(neighborhood)).slice(0, 100)
    const cleanEmail = String(email).trim().toLowerCase().slice(0, 200)
    const cleanHostName = host_name ? stripHtml(String(host_name)).slice(0, 100) : null

    const { error } = await supabaseServer.from('listings').insert([{
      title: cleanTitle,
      description: cleanDescription,
      type: mappedType,
      neighborhood: cleanNeighborhood,
      price_numeric: priceNum,
      price_display: `$${priceNum}/mo`,
      square_footage: square_footage ? Number(square_footage) : null,
      amenities: Array.isArray(amenities) ? amenities : [],
      submitted_by_email: cleanEmail,
      contact_email: cleanEmail,
      directory_id: process.env.NEXT_PUBLIC_DIRECTORY_ID || 'findstudiospace',
      city: 'Portland',
      status: 'pending',
    }])

    if (error) return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
