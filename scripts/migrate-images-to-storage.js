/* eslint-disable */
// One-time migration. Run with:
//   node scripts/migrate-images-to-storage.js           -- dry run (default, no writes)
//   node scripts/migrate-images-to-storage.js --execute -- actually download + update DB
//
// Downloads all images.craigslist.org images, uploads to Supabase Storage
// under listing-images/{listing_id}/{filename}, and updates the images column.
// Resume-safe: skips any URL that already points to Supabase Storage.

const fs = require('node:fs')
const path = require('node:path')
const { createClient } = require('@supabase/supabase-js')

const DRY_RUN = !process.argv.includes('--execute')
const BUCKET = 'listing-images'
const BATCH_DELAY_MS = 150
const ROOT = path.resolve(__dirname, '..')

// Walk up from ROOT to find .env.local (handles git worktrees where .env.local
// sits in the main repo dir rather than the worktree dir)
function findEnvFile() {
  let dir = ROOT
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(dir, '.env.local')
    if (fs.existsSync(candidate)) return candidate
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}

const ENV_PATH = findEnvFile()

function loadEnv(keys) {
  if (!ENV_PATH) {
    console.error('ERROR: .env.local not found (searched up from ' + ROOT + ')')
    process.exit(1)
  }
  const raw = fs.readFileSync(ENV_PATH, 'utf8')
  const result = {}
  for (const key of keys) {
    const match = raw.match(new RegExp(`^${key}=(.+)$`, 'm'))
    if (match) result[key] = match[1].trim()
  }
  return result
}

const env = loadEnv(['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_KEY'])
if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
  console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_KEY)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function storageUrl(storagePath) {
  return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === BUCKET)
  if (!exists) {
    if (DRY_RUN) {
      console.log(`[DRY RUN] Would create public bucket: ${BUCKET}`)
      return
    }
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true })
    if (error) {
      console.error('ERROR creating bucket:', error.message)
      process.exit(1)
    }
    console.log(`Created bucket: ${BUCKET}`)
  } else {
    console.log(`Bucket exists: ${BUCKET}`)
  }
}

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FindStudioSpace/1.0)' },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) return null
  const buf = await res.arrayBuffer()
  return Buffer.from(buf)
}

function contentType(url) {
  if (url.endsWith('.png')) return 'image/png'
  if (url.endsWith('.webp')) return 'image/webp'
  if (url.endsWith('.gif')) return 'image/gif'
  return 'image/jpeg'
}

function filename(url) {
  return path.basename(new URL(url).pathname)
}

async function migrateImage(listingId, url) {
  const supabaseHost = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname
  if (url.includes(supabaseHost)) return url // already migrated

  const name = filename(url)
  const storagePath = `${listingId}/${name}`
  const newUrl = storageUrl(storagePath)

  if (DRY_RUN) {
    console.log(`  [DRY RUN] ${url.slice(0, 60)}... -> ${storagePath}`)
    return newUrl
  }

  // Check if already uploaded
  const { data: existing } = await supabase.storage.from(BUCKET).list(String(listingId), {
    search: name,
  })
  if (existing?.some(f => f.name === name)) {
    console.log(`  SKIP (exists): ${storagePath}`)
    return newUrl
  }

  const buf = await downloadImage(url)
  if (!buf) {
    console.log(`  SKIP (404/error): ${url}`)
    return url // keep original so listing doesn't go imageless
  }

  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buf, {
    contentType: contentType(url),
    upsert: false,
  })
  if (error) {
    console.log(`  ERROR uploading ${storagePath}: ${error.message}`)
    return url
  }

  console.log(`  OK: ${storagePath} (${(buf.length / 1024).toFixed(0)}kb)`)
  return newUrl
}

async function run() {
  console.log(DRY_RUN ? '=== DRY RUN (pass --execute to write) ===' : '=== EXECUTE MODE ===')

  await ensureBucket()

  const { data: listings, error } = await supabase
    .from('listings')
    .select('id, images')
    .eq('status', 'active')
    .not('images', 'is', null)
    .neq('images', '[]')

  if (error) {
    console.error('ERROR fetching listings:', error.message)
    process.exit(1)
  }

  const toMigrate = listings.filter(l =>
    Array.isArray(l.images) && l.images.some(u => typeof u === 'string' && u.includes('craigslist'))
  )

  console.log(`\nListings to migrate: ${toMigrate.length}`)
  console.log(`Total images: ${toMigrate.reduce((n, l) => n + l.images.length, 0)}\n`)

  let migrated = 0
  let skipped = 0
  let errors = 0

  for (const listing of toMigrate) {
    console.log(`Listing ${listing.id} (${listing.images.length} image${listing.images.length > 1 ? 's' : ''})`)

    const newImages = []
    for (const url of listing.images) {
      if (typeof url !== 'string') { newImages.push(url); continue }
      const newUrl = await migrateImage(listing.id, url)
      newImages.push(newUrl)
      if (newUrl !== url) migrated++
      else skipped++
    }

    if (!DRY_RUN) {
      const { error: updateError } = await supabase
        .from('listings')
        .update({ images: newImages })
        .eq('id', listing.id)
      if (updateError) {
        console.log(`  ERROR updating listing ${listing.id}: ${updateError.message}`)
        errors++
      }
    }

    await sleep(BATCH_DELAY_MS)
  }

  console.log(`\n--- Done ---`)
  console.log(`Migrated: ${migrated}`)
  console.log(`Skipped:  ${skipped}`)
  console.log(`Errors:   ${errors}`)
  if (DRY_RUN) console.log('\nRe-run with --execute to apply changes.')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
