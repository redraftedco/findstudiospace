// Manual trigger for the enrich-contacts cron — for local testing only.
//
// Usage (dev server must be running on port 3000):
//   CONFIRM=YES node --env-file=.env.local scripts/enrich-contacts-now.js
//
// Requires: CRON_SECRET in .env.local
// The script calls localhost:3000 — start `npm run dev` first.

'use strict'

if (process.env.CONFIRM !== 'YES') {
  console.error('ERROR: Set CONFIRM=YES to proceed.')
  console.error('Run: CONFIRM=YES node --env-file=.env.local scripts/enrich-contacts-now.js')
  process.exit(1)
}

const secret = process.env.CRON_SECRET
if (!secret) {
  console.error('ERROR: CRON_SECRET not found in environment.')
  console.error('Make sure .env.local is loaded (node --env-file=.env.local).')
  process.exit(1)
}

const apiKey = process.env.GOOGLE_PLACES_API_KEY
if (!apiKey) {
  console.error('ERROR: GOOGLE_PLACES_API_KEY not set. Add it to .env.local before running.')
  process.exit(1)
}

const BASE = 'http://localhost:3000'

async function main() {
  console.log(`Triggering enrich-contacts at ${BASE}/api/cron/enrich-contacts ...`)
  console.log('(Dev server must be running on port 3000)')
  console.log()

  const res = await fetch(`${BASE}/api/cron/enrich-contacts`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${secret}` },
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`ERROR: HTTP ${res.status} ${res.statusText}`)
    console.error(body)
    process.exit(1)
  }

  const data = await res.json()
  console.log('Run result:')
  console.log(JSON.stringify(data, null, 2))
  console.log()
  console.log(`Processed: ${data.processed}`)
  console.log(`  ✓ success:    ${data.success}`)
  console.log(`  ○ no_website: ${data.no_website}`)
  console.log(`  ○ no_email:   ${data.no_email}`)
  console.log(`  ✗ failed:     ${data.failed}`)
  console.log(`  Places API calls used: ${data.places_api_calls}`)
}

main().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
