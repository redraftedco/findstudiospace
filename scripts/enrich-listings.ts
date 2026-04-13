/**
 * enrich-listings.ts
 * Fetches description and images from Craigslist for listings missing this data.
 *
 * Run with:
 *   npx tsx scripts/enrich-listings.ts
 *   -- or --
 *   npx ts-node --project scripts/tsconfig.json scripts/enrich-listings.ts
 *
 * Requires env vars (set in .env.local or export before running):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://vnjsczhqhnzrplrdkolb.supabase.co'

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_ROLE_KEY) {
  console.error('❌  SUPABASE_SERVICE_ROLE_KEY is required.')
  console.error('    Export it before running:')
  console.error('    export SUPABASE_SERVICE_ROLE_KEY=your_key_here')
  process.exit(1)
}

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xhtml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  Connection: 'keep-alive',
}

const DELAY_MS = 3000

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function extractDescription(html: string): string {
  // Craigslist wraps posting body in <section id="postingbody">
  const match = html.match(
    /<section[^>]+id="postingbody"[^>]*>([\s\S]*?)<\/section>/i,
  )
  if (!match) return ''

  const text = match[1]
    .replace(/<[^>]+>/g, ' ')                     // strip HTML tags
    .replace(/QR Code Link to This Post/gi, '')   // remove QR text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()

  return text
}

function extractImages(html: string): string[] {
  const images: string[] = []

  // Match each div.slide element and pull its img src
  const slidePattern =
    /<div[^>]+class="[^"]*\bslide\b[^"]*"[^>]*>([\s\S]*?)<\/div>/gi
  let slideMatch: RegExpExecArray | null

  while ((slideMatch = slidePattern.exec(html)) !== null) {
    const imgMatch = slideMatch[1].match(/<img[^>]+src="([^"]+)"/i)
    if (imgMatch) {
      // Replace any thumbnail size indicator (e.g. 50x50c, 300x300c) with 600x450
      const url = imgMatch[1].replace(/\d+x\d+[a-z]*/g, '600x450')
      if (url && !images.includes(url)) {
        images.push(url)
      }
    }
    if (images.length >= 8) break
  }

  return images
}

function isExpired(html: string): boolean {
  return (
    html.includes('This posting has been deleted') ||
    html.includes('This posting has expired') ||
    html.includes('posting has been flagged') ||
    html.length < 500 // suspiciously short — likely a redirect/error page
  )
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('─────────────────────────────────────────')
  console.log('  Craigslist enrichment — findstudiospace')
  console.log('─────────────────────────────────────────\n')
  console.log('Querying Supabase for listings missing descriptions...\n')

  const { data: listings, error } = await db
    .from('listings')
    .select('id, title, external_url')
    .eq('status', 'active')
    .or('description.is.null,description.eq.')
    .not('external_url', 'is', null)
    .neq('external_url', '')
    .ilike('external_url', '%craigslist%')

  if (error) {
    console.error('❌  Failed to query listings:', error.message)
    process.exit(1)
  }

  if (!listings || listings.length === 0) {
    console.log('✓  No listings found matching criteria. Nothing to do.')
    return
  }

  console.log(`Found ${listings.length} listing(s) to process.\n`)

  let processed = 0
  let updated = 0
  let skipped = 0
  let errors = 0

  for (const listing of listings) {
    console.log(`Processing ${listing.id}: ${listing.title}`)
    processed++

    try {
      const res = await fetch(listing.external_url as string, {
        headers: FETCH_HEADERS,
      })

      if (res.status === 404) {
        console.log(`✗ Skipped ${listing.id} — post expired or not found (404)`)
        skipped++
        await sleep(DELAY_MS)
        continue
      }

      if (!res.ok) {
        console.log(`✗ Error ${listing.id} — HTTP ${res.status}`)
        errors++
        await sleep(DELAY_MS)
        continue
      }

      const html = await res.text()

      if (isExpired(html)) {
        console.log(`✗ Skipped ${listing.id} — post expired or not found`)
        skipped++
        await sleep(DELAY_MS)
        continue
      }

      const description = extractDescription(html)

      if (!description) {
        console.log(
          `✗ Skipped ${listing.id} — could not extract description from page`,
        )
        skipped++
        await sleep(DELAY_MS)
        continue
      }

      const images = extractImages(html)

      const updatePayload: Record<string, unknown> = {
        description,
        updated_at: new Date().toISOString(),
      }
      if (images.length > 0) {
        updatePayload.images = images
      }

      const { error: updateError } = await db
        .from('listings')
        .update(updatePayload)
        .eq('id', listing.id)

      if (updateError) {
        console.log(
          `✗ Error ${listing.id} — DB update failed: ${updateError.message}`,
        )
        errors++
      } else {
        const preview = description.slice(0, 60)
        console.log(
          `✓ Updated ${listing.id} — description: "${preview}..." images: ${images.length}`,
        )
        updated++
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.log(`✗ Error ${listing.id} — ${msg}`)
      errors++
    }

    await sleep(DELAY_MS)
  }

  console.log('\n─────────────────────────────')
  console.log(`Total processed:   ${processed}`)
  console.log(`Updated:           ${updated}`)
  console.log(`Skipped (expired): ${skipped}`)
  console.log(`Errors:            ${errors}`)
  console.log('─────────────────────────────')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
