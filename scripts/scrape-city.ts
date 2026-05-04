/**
 * scrape-city.ts
 * Scrapes Craigslist office/commercial listings for a given city and inserts
 * new records into the Supabase listings table.
 *
 * Run with:
 *   npx tsx scripts/scrape-city.ts --city=atlanta
 *   npx tsx scripts/scrape-city.ts --city=seattle
 *   npx tsx scripts/scrape-city.ts --city=atlanta --limit=100
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://vnjsczhqhnzrplrdkolb.supabase.co'

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_KEY
if (!SERVICE_ROLE_KEY) {
  console.error('❌  SUPABASE_SERVICE_KEY is required.')
  process.exit(1)
}

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xhtml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  Connection: 'keep-alive',
}

// Delay between requests to avoid rate limiting
const DELAY_MS = 4000
// Delay between search result pages
const PAGE_DELAY_MS = 6000

// ---------------------------------------------------------------------------
// City config
// ---------------------------------------------------------------------------

type CityConfig = {
  displayName: string   // value stored in DB city column
  craigslistHost: string
  // Craigslist search categories to scrape (office/commercial + sub-areas)
  searchPaths: string[]
  listingType: string   // default type for inserted listings
}

const CITY_CONFIGS: Record<string, CityConfig> = {
  atlanta: {
    displayName: 'Atlanta',
    craigslistHost: 'https://atlanta.craigslist.org',
    searchPaths: ['/search/off', '/search/rea'],
    listingType: 'office',
  },
  seattle: {
    displayName: 'Seattle',
    craigslistHost: 'https://seattle.craigslist.org',
    searchPaths: ['/search/off', '/search/rea'],
    listingType: 'office',
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function parseArgs(): { city: string; limit: number } {
  const args = process.argv.slice(2)
  let city = ''
  let limit = 200
  for (const arg of args) {
    if (arg.startsWith('--city=')) city = arg.split('=')[1].toLowerCase()
    if (arg.startsWith('--limit=')) limit = parseInt(arg.split('=')[1], 10)
  }
  if (!city) {
    console.error('❌  --city is required. Example: --city=atlanta')
    process.exit(1)
  }
  if (!CITY_CONFIGS[city]) {
    console.error(`❌  Unknown city "${city}". Valid: ${Object.keys(CITY_CONFIGS).join(', ')}`)
    process.exit(1)
  }
  return { city, limit }
}

// ---------------------------------------------------------------------------
// Search result scraping — extracts listing URLs from a CL search page
// ---------------------------------------------------------------------------

function extractListingUrls(html: string, baseHost: string): string[] {
  const urls: string[] = []

  // New CL design: <a class="posting-title" href="...">
  const newPattern = /href="(\/[a-z]{3}\/off\/d\/[^"]+\.html)"/gi
  let m: RegExpExecArray | null
  while ((m = newPattern.exec(html)) !== null) {
    const url = baseHost + m[1]
    if (!urls.includes(url)) urls.push(url)
  }

  // Also match absolute URLs pointing to the same host
  const absPattern = new RegExp(
    `href="(${baseHost.replace(/\./g, '\\.')}/[a-z]{3}/off/d/[^"]+\\.html)"`,
    'gi'
  )
  while ((m = absPattern.exec(html)) !== null) {
    if (!urls.includes(m[1])) urls.push(m[1])
  }

  // Fallback: any link matching /XXX/d/slug/id.html pattern
  if (urls.length === 0) {
    const fallback = /href="(\/[a-z]{3}\/[a-z]+\/d\/[^"]+\.html)"/gi
    while ((m = fallback.exec(html)) !== null) {
      const url = baseHost + m[1]
      if (!urls.includes(url)) urls.push(url)
    }
  }

  return urls
}

function extractNextPageOffset(html: string): number | null {
  // New CL: data-totalcount and current offset in URL or button
  const buttonMatch = html.match(/href="[^"]*\?[^"]*s=(\d+)[^"]*"[^>]*[^>]*>next<\/a>/i)
  if (buttonMatch) return parseInt(buttonMatch[1], 10)

  // Look for cl-page-number span with "next" context
  const rangeMatch = html.match(/class="cl-page-number[^"]*"[^>]*>.*?(\d+)\s*–\s*(\d+)\s+of\s+(\d+)/i)
  if (rangeMatch) {
    const end = parseInt(rangeMatch[2], 10)
    const total = parseInt(rangeMatch[3], 10)
    if (end < total) return end
  }

  return null
}

async function fetchSearchPage(url: string): Promise<string> {
  const res = await fetch(url, { headers: FETCH_HEADERS })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

// ---------------------------------------------------------------------------
// Listing detail scraping
// ---------------------------------------------------------------------------

function extractTitle(html: string): string {
  const match = html.match(/<span\s+id="titletextonly"[^>]*>([^<]+)<\/span>/i)
    ?? html.match(/<h1[^>]*class="[^"]*postingtitle[^"]*"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/i)
    ?? html.match(/<title>([^<|]+)/i)
  if (!match) return ''
  return match[1].replace(/&amp;/g, '&').replace(/&#x27;/g, "'").trim()
}

function extractPrice(html: string): string | null {
  const match = html.match(/<span\s+class="price"[^>]*>\s*(\$[\d,]+)\s*<\/span>/i)
    ?? html.match(/<span\s+class="[^"]*priceinfo[^"]*"[^>]*>\s*(\$[\d,]+)\s*<\/span>/i)
  return match ? match[1] : null
}

function extractNeighborhood(html: string): string | null {
  // postingtitletext contains hood in parens: "Title (neighborhood)"
  const hoodMatch = html.match(/<small>\s*\(([^)]+)\)\s*<\/small>/i)
  if (hoodMatch) return hoodMatch[1].trim()

  // mapbox data-accuracy or map address
  const mapMatch = html.match(/<div\s+class="[^"]*mapaddress[^"]*"[^>]*>([^<]+)<\/div>/i)
  if (mapMatch) return mapMatch[1].trim()

  return null
}

function extractDescription(html: string): string {
  const match = html.match(
    /<section[^>]+id="postingbody"[^>]*>([\s\S]*?)<\/section>/i,
  )
  if (!match) return ''
  return match[1]
    .replace(/<[^>]+>/g, ' ')
    .replace(/QR Code Link to This Post/gi, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractImages(html: string): string[] {
  const images: string[] = []
  const slidePattern =
    /<div[^>]+class="[^"]*\bslide\b[^"]*"[^>]*>([\s\S]*?)<\/div>/gi
  let slideMatch: RegExpExecArray | null
  while ((slideMatch = slidePattern.exec(html)) !== null) {
    const imgMatch = slideMatch[1].match(/<img[^>]+src="([^"]+)"/i)
    if (imgMatch) {
      const url = imgMatch[1].replace(/\d+x\d+[a-z]*/g, '1200x900')
      if (url && !images.includes(url)) images.push(url)
    }
    if (images.length >= 8) break
  }
  // Fallback: JSON image data in script tag
  if (images.length === 0) {
    const jsonMatch = html.match(/"imageIds"\s*:\s*\[([^\]]+)\]/)
    if (jsonMatch) {
      const ids = jsonMatch[1].match(/"([^"]+)"/g) ?? []
      for (const id of ids.slice(0, 8)) {
        const clean = id.replace(/"/g, '')
        images.push(`https://images.craigslist.org/${clean}_1200x900.jpg`)
      }
    }
  }
  return images
}

function isExpiredPage(html: string): boolean {
  return (
    html.includes('This posting has been deleted') ||
    html.includes('This posting has expired') ||
    html.includes('posting has been flagged') ||
    html.length < 500
  )
}

// Infer listing type from title and description
function inferType(title: string, description: string): string {
  const hay = `${title} ${description}`.toLowerCase()
  if (/photo\s*studio|photography\s*studio|camera|shoot|lighting rig|cyc wall/i.test(hay)) return 'photo studio'
  if (/podcast|recording studio|sound booth|vocal booth|music studio/i.test(hay)) return 'podcast studio'
  if (/event\s*space|venue|meeting room|conference|reception/i.test(hay)) return 'event space'
  if (/makerspace|maker\s*space|fabrication|cnc|laser cutter|3d print/i.test(hay)) return 'makerspace'
  if (/art\s*studio|artist\s*studio|gallery|ceramics|pottery|painting/i.test(hay)) return 'art studio'
  if (/workshop|garage|woodshop|metal shop|warehouse|storage unit/i.test(hay)) return 'workshop'
  if (/yoga|fitness|dance|martial arts|pilates|wellness/i.test(hay)) return 'fitness studio'
  if (/retail|storefront|pop.up|showroom/i.test(hay)) return 'retail space'
  if (/office|desk|coworking|co-working|suite|flex space/i.test(hay)) return 'office'
  return 'creative space'
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const { city, limit } = parseArgs()
  const config = CITY_CONFIGS[city]

  console.log('─────────────────────────────────────────')
  console.log(`  Craigslist scraper — ${config.displayName}`)
  console.log(`  Limit: ${limit} listings`)
  console.log('─────────────────────────────────────────\n')

  // 1. Load existing external_urls for this city to avoid duplicates
  console.log('Loading existing listings from DB...')
  const { data: existing } = await db
    .from('listings')
    .select('external_url')
    .eq('city', config.displayName)
    .not('external_url', 'is', null)

  const knownUrls = new Set((existing ?? []).map((r) => r.external_url as string))
  console.log(`Found ${knownUrls.size} existing listings for ${config.displayName}.\n`)

  // 2. Collect listing URLs from all search paths
  const candidateUrls: string[] = []

  for (const searchPath of config.searchPaths) {
    let offset = 0
    let pagesFetched = 0
    const maxPages = 5

    while (pagesFetched < maxPages && candidateUrls.length < limit * 2) {
      const searchUrl = `${config.craigslistHost}${searchPath}?s=${offset}`
      console.log(`Fetching search page: ${searchUrl}`)

      try {
        const html = await fetchSearchPage(searchUrl)
        const pageUrls = extractListingUrls(html, config.craigslistHost)

        let newCount = 0
        for (const u of pageUrls) {
          if (!knownUrls.has(u) && !candidateUrls.includes(u)) {
            candidateUrls.push(u)
            newCount++
          }
        }

        console.log(`  → ${pageUrls.length} listings on page, ${newCount} new`)

        const nextOffset = extractNextPageOffset(html)
        if (!nextOffset || pageUrls.length === 0) break
        offset = nextOffset
        pagesFetched++
        await sleep(PAGE_DELAY_MS)
      } catch (err) {
        console.log(`  ✗ Failed to fetch search page: ${err instanceof Error ? err.message : err}`)
        break
      }
    }
  }

  console.log(`\nFound ${candidateUrls.length} candidate URLs to scrape.\n`)

  if (candidateUrls.length === 0) {
    console.log('Nothing to scrape. Exiting.')
    return
  }

  // 3. Scrape each listing and insert
  let inserted = 0
  let skipped = 0
  let errors = 0
  const toProcess = candidateUrls.slice(0, limit)

  for (let i = 0; i < toProcess.length; i++) {
    const url = toProcess[i]
    console.log(`[${i + 1}/${toProcess.length}] ${url}`)

    try {
      const res = await fetch(url, { headers: FETCH_HEADERS })

      if (res.status === 404 || res.status === 410) {
        console.log(`  ✗ Skipped — expired (${res.status})`)
        skipped++
        await sleep(DELAY_MS)
        continue
      }

      if (!res.ok) {
        console.log(`  ✗ Error — HTTP ${res.status}`)
        errors++
        await sleep(DELAY_MS)
        continue
      }

      const html = await res.text()

      if (isExpiredPage(html)) {
        console.log('  ✗ Skipped — post expired')
        skipped++
        await sleep(DELAY_MS)
        continue
      }

      const title = extractTitle(html)
      if (!title) {
        console.log('  ✗ Skipped — could not extract title')
        skipped++
        await sleep(DELAY_MS)
        continue
      }

      const price = extractPrice(html)
      const neighborhood = extractNeighborhood(html)
      const description = extractDescription(html)
      const images = extractImages(html)
      const type = inferType(title, description)

      const { error: insertError } = await db.from('listings').insert({
        title,
        description: description || null,
        price_display: price,
        neighborhood,
        type,
        city: config.displayName,
        status: 'active',
        external_url: url,
        images: images.length > 0 ? images : null,
        indexable: true,
        is_featured: false,
        tier: 'free',
      })

      if (insertError) {
        // Unique constraint on external_url = already exists, skip silently
        if (insertError.code === '23505') {
          console.log('  – Already exists (skipped)')
          skipped++
        } else {
          console.log(`  ✗ DB error: ${insertError.message}`)
          errors++
        }
      } else {
        console.log(`  ✓ Inserted: "${title.slice(0, 60)}" | ${type} | ${neighborhood ?? 'no hood'} | ${images.length} imgs`)
        inserted++
      }
    } catch (err) {
      console.log(`  ✗ Fetch error: ${err instanceof Error ? err.message : err}`)
      errors++
    }

    await sleep(DELAY_MS)
  }

  console.log('\n─────────────────────────────')
  console.log(`Inserted:  ${inserted}`)
  console.log(`Skipped:   ${skipped}`)
  console.log(`Errors:    ${errors}`)
  console.log('─────────────────────────────')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
