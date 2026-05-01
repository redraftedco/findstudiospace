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

    const parsedId = parseInt(listingId, 10)
    if (!Number.isFinite(parsedId) || parsedId < 1) {
      setError('Please enter a valid listing ID.')
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
          listing_id: parsedId,
          email: email.trim(),
        }),
      })

      const data = await res.json()

      if (data.url) {
        try {
          const redirectUrl = new URL(data.url)
          if (redirectUrl.hostname !== 'checkout.stripe.com') {
            setError('Invalid checkout URL received.')
            return
          }
          window.location.href = data.url
        } catch {
          setError('Invalid checkout URL received.')
        }
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
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
        inputMode="numeric"
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
