'use client'

import { useEffect, useState } from 'react'

export default function ViewCounter({
  listingId,
  tier,
}: {
  listingId: string
  tier: string
}) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    // Record the view (POST sets dedup cookie)
    fetch(`/api/listing-views/${listingId}`, { method: 'POST' }).catch(() => {})

    // Fetch the count
    fetch(`/api/listing-views/${listingId}`)
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => {})
  }, [listingId])

  if (count === null) return null

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
