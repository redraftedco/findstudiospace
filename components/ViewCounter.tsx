'use client'

import { useEffect, useState } from 'react'

// Only surface the view count when it signals meaningful demand.
// Below this threshold the number reads as thin, not as social proof.
const MIN_DISPLAY_THRESHOLD = 10

export default function ViewCounter({
  listingId,
}: {
  listingId: string
  tier?: string // kept for backwards compat — no longer changes display
}) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    // Record the view first, then wait a beat before fetching the count.
    // Without the delay the GET can race the POST and return a stale value.
    fetch(`/api/listing-views/${listingId}`, { method: 'POST' })
      .catch(() => {})
      .finally(() => {
        setTimeout(() => {
          fetch(`/api/listing-views/${listingId}`)
            .then(r => r.json())
            .then(d => setCount(typeof d.count === 'number' ? d.count : null))
            .catch(() => {})
        }, 300)
      })
  }, [listingId])

  // Don't render anything below threshold — low counts signal thinness, not demand.
  if (count === null || count < MIN_DISPLAY_THRESHOLD) return null

  return (
    <div style={{ marginTop: '24px' }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        color: 'var(--stone)',
      }}>
        Viewed {count} {count === 1 ? 'time' : 'times'} in the last 30 days
      </p>
    </div>
  )
}
