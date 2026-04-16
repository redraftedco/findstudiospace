'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

export default function ClaimBanner({ listingId }: { listingId: string }) {
  useEffect(() => {
    posthog.capture('claim_banner_shown', { listing_id: listingId })
  }, [listingId])

  return (
    <div style={{
      background: '#FAE5DB',
      padding: '10px 16px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '8px 16px',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        color: '#1a1814',
        margin: 0,
      }}>
        Is this your studio?
      </p>
      <a
        href={`/claim/${listingId}`}
        onClick={() => posthog.capture('claim_banner_clicked', { listing_id: listingId })}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: '#a84530',
          textDecoration: 'none',
          marginLeft: 'auto',
          padding: '8px 0',
        }}
      >
        Claim My Listing →
      </a>
    </div>
  )
}
