import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient } from '@/lib/supabase-auth'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

const BUCKET = 'generated-assets'
const MAX_BYTES = 10 * 1024 * 1024  // 10 MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { auth: { persistSession: false } },
  )
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const listingId = parseInt(id, 10)
  if (isNaN(listingId)) return NextResponse.json({ error: 'Invalid listing ID' }, { status: 400 })

  // Auth
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = serviceClient()

  // Ownership + tier check
  const { data: listing } = await db
    .from('listings')
    .select('id, owner_user_id, tier, images')
    .eq('id', listingId)
    .eq('status', 'active')
    .single()

  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  if (listing.owner_user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (listing.tier !== 'pro') return NextResponse.json({ error: 'Photo uploads require Studio Pro' }, { status: 403 })

  // Parse multipart form
  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })

  const file = form.get('photo')
  if (!(file instanceof File)) return NextResponse.json({ error: 'photo field required' }, { status: 400 })

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, and WebP are accepted' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 400 })
  }

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const filePath = `listing-photos/${listingId}/${randomUUID()}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await db.storage
    .from(BUCKET)
    .upload(filePath, arrayBuffer, { contentType: file.type, upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 })
  }

  const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(filePath)
  const photoUrl = urlData.publicUrl

  // Append URL to listings.images
  const existing: string[] = Array.isArray(listing.images)
    ? (listing.images as unknown[]).map(x => typeof x === 'string' ? x : (x as Record<string, string>)?.url ?? '').filter(Boolean)
    : []
  const updated = [...existing, photoUrl]

  const { error: dbError } = await db
    .from('listings')
    .update({ images: updated })
    .eq('id', listingId)

  if (dbError) {
    return NextResponse.json({ error: `DB update failed: ${dbError.message}` }, { status: 500 })
  }

  return NextResponse.json({ url: photoUrl })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const listingId = parseInt(id, 10)
  if (isNaN(listingId)) return NextResponse.json({ error: 'Invalid listing ID' }, { status: 400 })

  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = serviceClient()

  const { data: listing } = await db
    .from('listings')
    .select('id, owner_user_id, images')
    .eq('id', listingId)
    .single()

  if (!listing || listing.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { url } = await req.json() as { url?: string }
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })

  const existing: string[] = Array.isArray(listing.images)
    ? (listing.images as unknown[]).map(x => typeof x === 'string' ? x : (x as Record<string, string>)?.url ?? '').filter(Boolean)
    : []
  const updated = existing.filter(u => u !== url)

  await db.from('listings').update({ images: updated }).eq('id', listingId)

  return NextResponse.json({ ok: true })
}
