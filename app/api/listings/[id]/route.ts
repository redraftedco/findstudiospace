import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient } from '@/lib/supabase-auth'
import { createClient } from '@supabase/supabase-js'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { auth: { persistSession: false } },
  )
}

// PATCH /api/listings/[id] — update description, contact_email, contact_phone
// Owner only. Only allows safe editable fields.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const listingId = parseInt(id, 10)
  if (isNaN(listingId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = serviceClient()

  const { data: listing } = await db
    .from('listings')
    .select('id, owner_user_id')
    .eq('id', listingId)
    .eq('status', 'active')
    .single()

  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (listing.owner_user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json() as Record<string, unknown>

  // Whitelist editable fields
  const allowed = ['description', 'contact_email', 'contact_phone'] as const
  const patch: Partial<Record<typeof allowed[number], string>> = {}
  for (const field of allowed) {
    if (field in body && typeof body[field] === 'string') {
      patch[field] = (body[field] as string).trim().slice(0, field === 'description' ? 5000 : 200)
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No editable fields provided' }, { status: 400 })
  }

  const { error } = await db.from('listings').update(patch).eq('id', listingId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
