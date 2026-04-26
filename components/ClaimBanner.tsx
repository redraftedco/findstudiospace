'use client'

// Client component: needs sessionStorage for dismissal persistence and posthog
// event capture. Renders above the listing breadcrumb. Display-only; clicking
// through routes to /claim for the actual ownership verification flow.

import { useEffect, useState } from 'react'
import posthog from 'posthog-js'

type Props = { listingId: string; studioName: string }

export default function ClaimBanner({ listingId, studioName }: Props) {
  const storageKey = `claim-banner-dismissed-${listingId}`
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return sessionStorage.getItem(storageKey) === '1'
  })

  useEffect(() => {
    if (!dismissed) {
      posthog.capture('claim_banner_shown', { listing_id: listingId })
    }
  }, [dismissed, listingId])

  if (dismissed) return null

  function handleDismiss() {
    sessionStorage.setItem(storageKey, '1')
    setDismissed(true)
  }

  return (
    <div
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--rule)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px 16px',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--ink)',
          margin: 0,
          letterSpacing: '0.02em',
        }}
      >
        Are you the owner of <strong style={{ fontWeight: 600 }}>{studioName}</strong>?{' '}
        <a
          href={`/claim?listing_id=${listingId}`}
          onClick={() => posthog.capture('claim_banner_clicked', { listing_id: listingId })}
          style={{
            color: 'var(--action)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Claim this listing →
        </a>
      </p>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss"
        style={{
          marginLeft: 'auto',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--stone)',
          fontSize: '18px',
          lineHeight: 1,
          padding: '4px 8px',
        }}
      >
        ×
      </button>
    </div>
  )
}
