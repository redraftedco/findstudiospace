'use client'

import { useState } from 'react'

export default function BillingPortalButton({ listingId }: { listingId: number }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function open() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) { window.location.href = data.url; return }
      setError(data.error ?? 'Could not open billing portal.')
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={open}
        disabled={loading}
        style={{
          padding: '10px 20px',
          border: '1px solid var(--ink)',
          background: 'transparent',
          color: 'var(--ink)',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          fontWeight: 500,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Opening…' : 'Manage subscription →'}
      </button>
      {error && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--action)', margin: '8px 0 0' }}>{error}</p>
      )}
    </>
  )
}
