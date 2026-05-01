import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import {
  isValidEmail,
  isValidString,
  isValidNumber,
  isOneOf,
  sanitizeText,
  rateLimit,
  getClientIp,
} from '@/lib/validation'

const VALID_TYPES = ['Art Studio', 'Workshop', 'Office', 'Photo Studio', 'Retail', 'Fitness & Dance'] as const

const TYPE_MAP: Record<string, string> = {
  'Art Studio': 'art',
  'Workshop': 'workshop',
  'Office': 'office',
  'Photo Studio': 'photo',
  'Retail': 'retail',
  'Fitness & Dance': 'fitness',
}

const VALID_AMENITIES = ['Parking', '24hr Access', 'Natural Light', 'Utilities Included', 'Private Bathroom', 'WiFi', 'Storage']

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`submit:${ip}`, { windowMs: 60 * 60 * 1000, maxRequests: 3 })
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many submissions. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
      )
    }

    const body = await req.json()
    const { host_name, email, title, type, neighborhood, price_monthly, square_footage, description, amenities } = body

    if (!isValidString(title, { min: 3, max: 200 })) {
      return NextResponse.json({ success: false, error: 'Title must be 3-200 characters.' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'A valid email is required.' }, { status: 400 })
    }
    if (!isOneOf(type, VALID_TYPES)) {
      return NextResponse.json({ success: false, error: 'Invalid space type.' }, { status: 400 })
    }
    if (!isValidString(neighborhood, { min: 1, max: 200 })) {
      return NextResponse.json({ success: false, error: 'Neighborhood is required.' }, { status: 400 })
    }
    if (!isValidString(description, { min: 50, max: 10000 })) {
      return NextResponse.json({ success: false, error: 'Description must be 50-10000 characters.' }, { status: 400 })
    }
    if (!isValidNumber(price_monthly, { min: 0, max: 100000 })) {
      return NextResponse.json({ success: false, error: 'Price must be between $0 and $100,000.' }, { status: 400 })
    }
    if (square_footage !== null && square_footage !== undefined && square_footage !== '') {
      if (!isValidNumber(square_footage, { min: 0, max: 1000000 })) {
        return NextResponse.json({ success: false, error: 'Invalid square footage.' }, { status: 400 })
      }
    }
    if (host_name && !isValidString(host_name, { max: 200 })) {
      return NextResponse.json({ success: false, error: 'Host name is too long.' }, { status: 400 })
    }

    const safeAmenities = Array.isArray(amenities)
      ? amenities.filter((a: unknown) => typeof a === 'string' && VALID_AMENITIES.includes(a))
      : []

    const { error } = await supabaseServer.from('listings').insert([{
      title: sanitizeText(title),
      description: sanitizeText(description),
      type: TYPE_MAP[type] ?? type.toLowerCase(),
      neighborhood: sanitizeText(neighborhood),
      price_numeric: Number(price_monthly),
      price_display: `$${Number(price_monthly)}/mo`,
      square_footage: square_footage ? Number(square_footage) : null,
      amenities: safeAmenities,
      submitted_by_email: email.trim().toLowerCase(),
      contact_email: email.trim().toLowerCase(),
      directory_id: process.env.NEXT_PUBLIC_DIRECTORY_ID || 'findstudiospace',
      city: 'Portland',
      status: 'pending',
    }])

    if (error) {
      console.error('Listing insert error:', error.code)
      return NextResponse.json({ success: false, error: 'Failed to save listing.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
