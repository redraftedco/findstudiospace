// Never import this in client components — service key is server-only
import { createClient } from '@supabase/supabase-js'
import { STORAGE_BUCKET, STORAGE_PATH_PREFIX, MAP_FILE_EXT } from './constants'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY!

function getServiceClient() {
  if (!SUPABASE_URL || !SERVICE_KEY) throw new Error('Missing Supabase env vars')
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  })
}

export async function uploadSiteAnalysisMap(
  listingId: number,
  version: string,
  buffer: Buffer,
): Promise<string> {
  const db = getServiceClient()
  const filePath = `${STORAGE_PATH_PREFIX}/${listingId}/${version}.${MAP_FILE_EXT}`

  const { error } = await db.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, buffer, {
      contentType: 'image/svg+xml',
      upsert: true,
    })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)

  const { data: urlData } = db.storage.from(STORAGE_BUCKET).getPublicUrl(filePath)
  if (!urlData?.publicUrl) throw new Error('Could not get public URL after upload')

  return urlData.publicUrl
}
