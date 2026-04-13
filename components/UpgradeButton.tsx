'use client'

import { useState } from 'react'

interface UpgradeButtonProps {
  tier: 'pro' | 'featured'
  label: string
}

export function UpgradeButton({ tier, label }: UpgradeButtonProps) {
  const [email, setEmail] = useState('')
  const [listingId, setListingId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    if (!email || !listingId) {
      setError('Enter your email and listing ID first.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          listing_id: parseInt(listingId),
          email,
        }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          marginBottom: '8px',
          padding: '8px 12px',
          border: '1px solid #d6d0c4',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          background: '#f4f1eb',
          color: '#1a1814',
          outline: 'none',
        }}
      />
      <input
        type="text"
        placeholder="Your listing ID (find it in your listing URL)"
        value={listingId}
        onChange={e => setListingId(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          marginBottom: '8px',
          padding: '8px 12px',
          border: '1px solid #d6d0c4',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          background: '#f4f1eb',
          color: '#1a1814',
          outline: 'none',
        }}
      />
      <button
        onClick={handleClick}
        disabled={loading}
        className="btn-action"
        style={{ width: '100%', padding: '10px', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Redirecting…' : label}
      </button>
      {error && (
        <p style={{
          color: '#a84530',
          fontSize: '12px',
          marginTop: '6px',
          fontFamily: 'var(--font-mono)',
        }}>
          {error}
        </p>
      )}
    </div>
  )
}
