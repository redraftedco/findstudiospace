/* eslint-disable */
// Local tool. Not shipped. Run with: node scripts/backfill-photo-niche-attributes.js
//
// Backfills photo-specific niche_attributes keys for known photo studio listings.
// Merges into existing niche_attributes rather than replacing.

const fs = require('node:fs')
const path = require('node:path')
const { createClient } = require('@supabase/supabase-js')

const ROOT = path.resolve(__dirname, '..')
const ENV_PATH = path.join(ROOT, '.env.local')

function loadEnv(keys) {
  if (!fs.existsSync(ENV_PATH)) {
    console.error('ERROR: .env.local not found at ' + ENV_PATH)
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

// Manually reviewed entries only — false-positives (ids 25, 569) excluded.
const BACKFILL = [
  { id: 22, title: 'Suite 225 - Industrial Creative Studio w/ Cyclorama Wall | 801 SF', add: { cyc_wall: true } },
  { id: 73, title: 'Central Eastside Flex (Photo, Art)', add: { product_photography: true } },
  { id: 30, title: 'Ford Building - Office, Esthetics or Photo Studio', add: { product_photography: true } },
]

async function run() {
  let updated = 0
  let skipped = 0

  for (const entry of BACKFILL) {
    // Fetch current niche_attributes to merge into
    const { data, error: fetchErr } = await supabase
      .from('listings')
      .select('niche_attributes')
      .eq('id', entry.id)
      .single()

    if (fetchErr || !data) {
      console.error(`  ERROR fetching id ${entry.id}: ${fetchErr?.message}`)
      skipped++
      continue
    }

    const merged = { ...(data.niche_attributes ?? {}), ...entry.add }

    const { error: updateErr } = await supabase
      .from('listings')
      .update({ niche_attributes: merged })
      .eq('id', entry.id)

    if (updateErr) {
      console.error(`  ERROR updating id ${entry.id}: ${updateErr.message}`)
      skipped++
      continue
    }

    console.log(`  Updated "${entry.title}" (id: ${entry.id}) → ${JSON.stringify(merged)}`)
    updated++
  }

  console.log(`\nDone. Updated: ${updated}  Skipped/errored: ${skipped}`)
  console.log(`Manual review needed: ids 25, 569 (matched "production" — not photo studios)`)
}

run()
