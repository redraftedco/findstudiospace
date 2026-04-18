/* eslint-disable */
// Local tool. Not shipped. Run with: node scripts/export-outreach-list.js
//
// Exports all active Portland listings to scripts/outreach-list.csv
// sorted by all-time view count (DESC). Prints a summary of how many rows
// have an email, website, or neither. Never logs contact data to stdout.

const fs = require('node:fs')
const path = require('node:path')
const { createClient } = require('@supabase/supabase-js')

const ROOT = path.resolve(__dirname, '..')
const ENV_PATH = path.join(ROOT, '.env.local')
const OUT_PATH = path.join(ROOT, 'scripts', 'outreach-list.csv')

// --- .env.local loader (no dotenv dep) ---------------------------------------
function loadEnv(keys) {
  if (!fs.existsSync(ENV_PATH)) {
    console.error('ERROR: .env.local not found at ' + ENV_PATH)
    process.exit(1)
  }
  const raw = fs.readFileSync(ENV_PATH, 'utf8')
  const out = {}
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (!m) continue
    const key = m[1]
    if (!keys.includes(key)) continue
    let val = m[2].trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    out[key] = val
  }
  for (const k of keys) {
    if (!out[k]) {
      console.error(`ERROR: ${k} missing from .env.local`)
      process.exit(1)
    }
  }
  return out
}

// --- CSV escaping ------------------------------------------------------------
function csvEscape(v) {
  if (v === null || v === undefined) return ''
  const s = String(v)
  if (/[",\r\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

function csvRow(fields) {
  return fields.map(csvEscape).join(',')
}

// --- Main --------------------------------------------------------------------
async function main() {
  const env = loadEnv(['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_KEY'])
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_KEY)

  // 1. Listings
  const { data: listings, error: listingsErr } = await supabase
    .from('listings')
    .select('id, title, business_name, neighborhood, type, contact_email, website_url, instagram_url, tier')
    .eq('city', 'Portland')
    .eq('status', 'active')

  if (listingsErr) {
    console.error('ERROR querying listings:', listingsErr.message)
    process.exit(1)
  }

  // 2. View counts (all-time, aggregated)
  const { data: views, error: viewsErr } = await supabase
    .from('listing_views')
    .select('listing_id')

  if (viewsErr) {
    console.error('ERROR querying listing_views:', viewsErr.message)
    process.exit(1)
  }

  const viewCountById = new Map()
  for (const row of views || []) {
    viewCountById.set(row.listing_id, (viewCountById.get(row.listing_id) || 0) + 1)
  }

  // 3. Build rows
  const rows = listings.map((l) => {
    const name = (l.business_name && l.business_name.trim()) || l.title || ''
    return {
      listing_id: l.id,
      name,
      neighborhood: l.neighborhood || '',
      type: l.type || '',
      contact_email: l.contact_email || '',
      website_url: l.website_url || '',
      instagram_url: l.instagram_url || '',
      listing_url: `https://findstudiospace.com/listing/${l.id}`,
      view_count: viewCountById.get(l.id) || 0,
      tier: l.tier || 'free',
    }
  })

  // 4. Sort: view_count DESC, id ASC (stable deterministic)
  rows.sort((a, b) => {
    if (b.view_count !== a.view_count) return b.view_count - a.view_count
    return a.listing_id - b.listing_id
  })

  // 5. Write CSV (UTF-8, CRLF line endings)
  const header = ['listing_id', 'name', 'neighborhood', 'type', 'contact_email', 'website_url', 'instagram_url', 'listing_url', 'view_count', 'tier']
  const lines = [csvRow(header)]
  for (const r of rows) {
    lines.push(csvRow(header.map((k) => r[k])))
  }
  fs.writeFileSync(OUT_PATH, lines.join('\r\n') + '\r\n', 'utf8')

  // 6. Summary (NO contact data logged — counts only)
  const total = rows.length
  const withEmail = rows.filter((r) => r.contact_email).length
  const withWebsiteNoEmail = rows.filter((r) => !r.contact_email && r.website_url).length
  const withInstagramOnly = rows.filter((r) => !r.contact_email && !r.website_url && r.instagram_url).length
  const withNeither = rows.filter((r) => !r.contact_email && !r.website_url && !r.instagram_url).length

  console.log(`Exported ${total} Portland listings.`)
  console.log(`  With contact_email:            ${String(withEmail).padStart(4)}`)
  console.log(`  With website_url (no email):   ${String(withWebsiteNoEmail).padStart(4)}`)
  console.log(`  With Instagram only:           ${String(withInstagramOnly).padStart(4)}`)
  console.log(`  With neither:                  ${String(withNeither).padStart(4)}`)
  console.log(`CSV written to ${path.relative(ROOT, OUT_PATH)}`)
}

main().catch((err) => {
  console.error('FAILED:', err && err.message ? err.message : err)
  process.exit(1)
})
