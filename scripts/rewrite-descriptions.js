/* eslint-disable */
// Rewrites thin auto-generated listing descriptions with real copy.
// Run with:
//   node scripts/rewrite-descriptions.js           -- dry run (prints UPDATEs, no writes)
//   node scripts/rewrite-descriptions.js --execute -- applies to DB
//
// Targets Portland listings whose description is a single-sentence template
// (< 550 chars). Generates category-aware copy from structured fields.

const fs = require('node:fs')
const path = require('node:path')
const { createClient } = require('@supabase/supabase-js')

const DRY_RUN = !process.argv.includes('--execute')
const ROOT = path.resolve(__dirname, '..')

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
    console.error('ERROR: .env.local not found')
    process.exit(1)
  }
  const raw = fs.readFileSync(ENV_PATH, 'utf8')
  const result = {}
  for (const key of keys) {
    const match = raw.match(new RegExp(`^${key}=(.*)$`, 'm'))
    result[key] = match ? match[1].trim() : ''
  }
  return result
}

const env = loadEnv(['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_KEY'])
if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
  console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_KEY)

// Extract sq ft from title string (e.g. "500 sq ft", "1,200 SF", "857 SF")
function parseSqft(title) {
  const m = title.match(/(\d[\d,]*)\s*(?:sq\.?\s*ft|SF|sqft)/i)
  if (!m) return null
  return parseInt(m[1].replace(/,/g, ''), 10)
}

// Clean title for use in copy (strip trailing punctuation, normalize caps)
function cleanTitle(title) {
  return title.replace(/[!~]+$/, '').replace(/\s+/g, ' ').trim()
}

// Neighborhood display — prefer listing neighborhood, fall back to Portland
function neighborhoodPhrase(neighborhood) {
  if (!neighborhood) return 'Portland'
  // Normalize common values
  const n = neighborhood.trim()
  if (n.match(/^portland$/i)) return 'Portland'
  if (n.match(/central eastside/i)) return "Portland's Central Eastside"
  if (n.match(/pearl/i)) return "Portland's Pearl District"
  if (n.match(/alberta/i)) return "NE Portland's Alberta Arts District"
  if (n.match(/^ne portland$/i)) return 'NE Portland'
  if (n.match(/^nw portland$/i)) return 'NW Portland'
  if (n.match(/^se portland$/i)) return 'SE Portland'
  if (n.match(/^n portland$/i)) return 'North Portland'
  if (n.match(/^sw portland$/i)) return 'SW Portland'
  if (n.match(/downtown/i)) return 'Downtown Portland'
  if (n.match(/sellwood/i)) return 'Sellwood'
  if (n.match(/mississippi/i)) return 'North Mississippi'
  if (n.match(/division/i)) return 'SE Division'
  if (n.match(/kerns/i)) return 'Kerns'
  if (n.match(/slabtown/i)) return 'Slabtown'
  if (n.match(/eliot/i)) return 'the Eliot neighborhood'
  if (n.match(/oak grove/i)) return 'Oak Grove'
  return n
}

// Price phrase
function pricePhrase(price_display) {
  if (!price_display) return null
  const p = String(price_display).trim()
  if (!p || p === '0' || p === '$0') return null
  if (p.match(/^\$[\d,]+$/)) return `${p}/month`
  return p
}

// Generate category-aware description
function generateDescription(listing) {
  const { title, type, neighborhood, price_display } = listing
  const sqft = parseSqft(title)
  const name = cleanTitle(title)
  const loc = neighborhoodPhrase(neighborhood)
  const price = pricePhrase(price_display)

  const sqftStr = sqft ? `${sqft.toLocaleString()} sq ft ` : ''
  const priceStr = price ? ` ${price}.` : '.'

  switch (type) {
    case 'art':
      return `${sqftStr}creative studio in ${loc}${priceStr} Private workspace for painters, illustrators, ceramicists, and mixed-media artists. Monthly rental, contact the host directly to inquire about availability and access hours.`

    case 'photo':
      return `${sqftStr}photography studio in ${loc}${priceStr} Suited for portrait, product, editorial, and content shoots. Inquire directly with the host about lighting equipment, backdrops, and cyclorama walls included in the rental.`

    case 'workshop':
      return `${sqftStr}workshop and production space in ${loc}${priceStr} Suited for fabrication, woodworking, small-batch manufacturing, and hands-on trades. Monthly rental. Contact the host to confirm tool access, ceiling height, and loading.`

    case 'music':
      return `${sqftStr}music studio in ${loc}${priceStr} Available for rehearsal, recording, and lockout rental. Inquire directly with the host about soundproofing, gear included, and access hours.`

    case 'fitness':
      return `${sqftStr}fitness and movement studio in ${loc}${priceStr} Suited for yoga, dance, martial arts, personal training, and wellness practitioners. Monthly rental. Contact the host for floor type, mirror configuration, and sprung floor details.`

    case 'office':
      return `${sqftStr}creative office in ${loc}${priceStr} Suited for small agencies, independent professionals, and creative businesses that need a dedicated, private workspace. Monthly terms. Contact the host directly to schedule a viewing.`

    case 'retail':
      return `${sqftStr}retail and studio space in ${loc}${priceStr} Street-facing or high-traffic building suited for storefronts, showrooms, pop-up retail, and service businesses. Monthly or flexible terms. Contact the host to confirm zoning and permitted uses.`

    default:
      return `${sqftStr}studio and creative workspace in ${loc}${priceStr} Monthly rental. Submit an inquiry to connect directly with the host and confirm availability, access, and what is included.`
  }
}

// Detect auto-generated template descriptions (the ones we want to replace)
// They all follow the pattern: "[Title] is a [type] in [place]. It is suited for..."
function isTemplateDescription(description) {
  if (!description) return true
  if (description.length > 550) return false // keep longer real descriptions
  const lower = description.toLowerCase()
  return (
    lower.includes(' is a ') ||
    lower.includes(' is an ') ||
    lower.includes('it is suited for') ||
    lower.includes('listed rent is')
  )
}

async function main() {
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'EXECUTE (writing to DB)'}`)
  console.log('Fetching Portland listings...')

  const { data: listings, error } = await supabase
    .from('listings')
    .select('id, title, type, neighborhood, price_display, description')
    .eq('status', 'active')
    .eq('city', 'Portland')
    .order('id')

  if (error) {
    console.error('Supabase error:', error.message)
    process.exit(1)
  }

  const targets = (listings ?? []).filter(l => isTemplateDescription(l.description))
  console.log(`Total active Portland listings: ${listings.length}`)
  console.log(`Listings with template descriptions to rewrite: ${targets.length}`)
  console.log('')

  let updated = 0
  let skipped = 0

  for (const listing of targets) {
    const newDesc = generateDescription(listing)

    if (DRY_RUN) {
      console.log(`[${listing.id}] ${listing.type} | ${listing.neighborhood ?? 'no neighborhood'} | ${listing.price_display ?? 'no price'}`)
      console.log(`  TITLE: ${listing.title.slice(0, 70)}`)
      console.log(`  OLD:   ${(listing.description ?? '').slice(0, 80)}...`)
      console.log(`  NEW:   ${newDesc.slice(0, 100)}...`)
      console.log('')
    } else {
      const { error: updateError } = await supabase
        .from('listings')
        .update({ description: newDesc })
        .eq('id', listing.id)

      if (updateError) {
        console.error(`  ERROR updating ${listing.id}: ${updateError.message}`)
        skipped++
      } else {
        console.log(`  Updated listing ${listing.id}: ${listing.title.slice(0, 60)}`)
        updated++
      }

      // Small delay to avoid hammering the DB
      await new Promise(r => setTimeout(r, 50))
    }
  }

  if (DRY_RUN) {
    console.log(`Dry run complete. ${targets.length} listings would be updated.`)
    console.log('Run with --execute to apply changes.')
  } else {
    console.log(`Done. Updated: ${updated}, Errors: ${skipped}`)
  }
}

main().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
