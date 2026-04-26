// Publish a city: flip is_indexable=true, set indexable=true on qualifying listings.
//
// Usage:
//   CONFIRM=YES node --env-file=.env.local scripts/publish-city.js <city-slug>
//
// Example:
//   CONFIRM=YES node --env-file=.env.local scripts/publish-city.js nashville
//
// Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local
// Safety gate: exits with error if CONFIRM env var is not exactly "YES".

'use strict'

const { createClient } = require('@supabase/supabase-js')

const MIN_LISTING_COUNT = 4
const MIN_PHOTO_RATIO = 0.5

// ── Safety gate ─────────────────────────────────────────────────────────────
const citySlug = process.argv[2]

if (!citySlug) {
  console.error('ERROR: city slug is required.')
  console.error('Usage: CONFIRM=YES node --env-file=.env.local scripts/publish-city.js <city-slug>')
  process.exit(1)
}

if (process.env.CONFIRM !== 'YES') {
  console.error('ERROR: Set CONFIRM=YES to proceed.')
  console.error('This will make listings publicly indexable on findstudiospace.com.')
  console.error(`Run: CONFIRM=YES node --env-file=.env.local scripts/publish-city.js ${citySlug}`)
  process.exit(1)
}

// ── Supabase client (service role) ──────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
)

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  // 1. Fetch city
  const { data: city, error: cityErr } = await supabase
    .from('cities')
    .select('id, slug, name, state, is_active, is_indexable')
    .eq('slug', citySlug)
    .maybeSingle()

  if (cityErr) { console.error('DB error fetching city:', cityErr.message); process.exit(1) }
  if (!city)   { console.error(`City "${citySlug}" not found in cities table.`); process.exit(1) }
  if (!city.is_active) {
    console.error(`City "${citySlug}" is not active (is_active = false). Set is_active=true first.`)
    process.exit(1)
  }

  console.log(`\nPublishing ${city.name}, ${city.state}...`)
  if (city.is_indexable) {
    console.log('  Note: city is already is_indexable=true — re-running will re-evaluate listings.')
  }

  // 2. Fetch all listings for this city
  const { data: listings, error: listingsErr } = await supabase
    .from('listings')
    .select('id, status, images')
    .eq('city_id', city.id)

  if (listingsErr) { console.error('DB error fetching listings:', listingsErr.message); process.exit(1) }

  const allListings = listings ?? []
  const active = allListings.filter(l => l.status === 'active')
  console.log(`  Total listings: ${allListings.length} (${active.length} active)`)

  // 3. City-level quality gate
  if (active.length < MIN_LISTING_COUNT) {
    console.error(`  GATE FAIL: only ${active.length} active listings — need ≥ ${MIN_LISTING_COUNT}.`)
    console.error('  Aborting. Add more listings before publishing.')
    process.exit(1)
  }

  const withPhotos = active.filter(l => {
    const imgs = Array.isArray(l.images) ? l.images : []
    return imgs.length > 0
  })
  const photoRatio = active.length > 0 ? withPhotos.length / active.length : 0

  if (photoRatio < MIN_PHOTO_RATIO) {
    console.warn(
      `  WARNING: only ${Math.round(photoRatio * 100)}% of active listings have photos ` +
      `(threshold: ${Math.round(MIN_PHOTO_RATIO * 100)}%). ` +
      `Proceeding — listings without photos will be set indexable=false individually.`,
    )
  }

  // 4. Classify listings
  const eligible = active.filter(l => {
    const imgs = Array.isArray(l.images) ? l.images : []
    return imgs.length > 0
  })
  const rejected = active.filter(l => {
    const imgs = Array.isArray(l.images) ? l.images : []
    return imgs.length === 0
  })
  const inactive = allListings.filter(l => l.status !== 'active')

  // 5. Mark eligible listings indexable=true, published=true
  if (eligible.length > 0) {
    const { error: upErr } = await supabase
      .from('listings')
      .update({ indexable: true, published: true })
      .in('id', eligible.map(l => l.id))
    if (upErr) { console.error('DB error updating eligible listings:', upErr.message); process.exit(1) }
  }

  // 6. Ensure rejected/inactive listings are indexable=false
  const notEligible = [...rejected, ...inactive]
  if (notEligible.length > 0) {
    const { error: downErr } = await supabase
      .from('listings')
      .update({ indexable: false })
      .in('id', notEligible.map(l => l.id))
    if (downErr) { console.error('DB error downgrading listings:', downErr.message); process.exit(1) }
  }

  // 7. Flip city
  const { error: cityUpErr } = await supabase
    .from('cities')
    .update({ is_indexable: true, seo_published_at: new Date().toISOString() })
    .eq('id', city.id)
  if (cityUpErr) { console.error('DB error updating city:', cityUpErr.message); process.exit(1) }

  // 8. Summary
  console.log('\n✓ Done.')
  console.log(`  City:                  ${city.name} → is_indexable=true`)
  console.log(`  Made indexable:        ${eligible.length} listings`)
  console.log(`  Rejected (no photos):  ${rejected.length} listings`)
  console.log(`  Inactive (skipped):    ${inactive.length} listings`)
  if (rejected.length > 0) {
    console.log(`  Rejected IDs:          ${rejected.map(l => l.id).join(', ')}`)
  }
  console.log('\n  Next step: run pnpm build to regenerate the sitemap and static pages.')
}

main().catch(err => { console.error('Unexpected error:', err); process.exit(1) })
