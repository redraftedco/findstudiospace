#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_KEY

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY')
  process.exit(1)
}

function firstImage(images) {
  if (!Array.isArray(images)) return null
  for (const img of images) {
    if (typeof img === 'string' && img.trim()) return img.trim()
    if (img && typeof img === 'object' && typeof img.url === 'string' && img.url.trim()) return img.url.trim()
  }
  return null
}

async function run() {
  const supabase = createClient(url, key)

  const { data: listings, error } = await supabase
    .from('listings')
    .select('id, title, neighborhood, tier, images')
    .eq('status', 'active')
    .order('id', { ascending: true })
    .limit(2000)

  if (error) throw error

  const rows = listings || []
  const missing = []

  for (const row of rows) {
    const img = firstImage(row.images)
    if (!img || img.includes('placeholder-studio.svg')) {
      missing.push({
        id: row.id,
        title: row.title || 'Untitled listing',
        neighborhood: row.neighborhood || 'Unknown',
        tier: row.tier || 'free',
        image: img || '(none)',
      })
    }
  }

  const top25 = missing.slice(0, 25)
  const today = new Date().toISOString().slice(0, 10)
  const outPath = `docs/reports/listing-image-audit-${today}.md`

  const lines = []
  lines.push(`# Listing Image Audit — ${today}`)
  lines.push('')
  lines.push(`- Active listings scanned: **${rows.length}**`)
  lines.push(`- Listings missing usable primary image: **${missing.length}**`)
  lines.push(`- Missing-image share: **${rows.length ? ((missing.length / rows.length) * 100).toFixed(1) : '0.0'}%**`)
  lines.push('')
  lines.push('## First 25 listings to patch')
  lines.push('')
  lines.push('| Listing ID | Title | Neighborhood | Tier | Primary image |')
  lines.push('| --- | --- | --- | --- | --- |')
  for (const r of top25) {
    lines.push(`| ${r.id} | ${r.title.replace(/\|/g, '\\|')} | ${r.neighborhood.replace(/\|/g, '\\|')} | ${r.tier} | ${r.image.replace(/\|/g, '\\|')} |`)
  }

  fs.writeFileSync(outPath, lines.join('\n'))
  console.log(`Wrote ${outPath}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
