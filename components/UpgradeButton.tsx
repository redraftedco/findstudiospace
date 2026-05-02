'use client'

import { useState } from 'react'

interface Listing {
  id: number
  title: string
  type: string
  is_featured: boolean
}

interface UpgradeButtonProps {
  tier: 'pro' | 'featured'
  label: string
}

export function UpgradeButton({ tier, label }: UpgradeButtonProps) {
  const [email, setEmail] = useState('')
  const [listings, setListings] = useState<Listing[] | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [lookingUp, setLookingUp] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLookup() {
    if (!email) {
      setError('Enter your email to find your listings.')
      return
    }
    setLookingUp(true)
    setError(null)
    setListings(null)
    setSelectedId(null)

    try {
      const res = await fetch('/api/listings-by-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Lookup failed.')
        return
      }

      const eligible = (data.listings as Listing[]).filter(
        (l) => !(tier === 'featured' && l.is_featured)
      )

      if (eligible.length === 0) {
        setError('No eligible listings found for this email. Make sure you use the email you submitted your listing with.')
        return
      }

      setListings(eligible)
      if (eligible.length === 1) setSelectedId(eligible[0].id)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLookingUp(false)
    }
  }

  async function handleCheckout() {
    if (!selectedId) {
      setError('Select a listing to upgrade.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, listing_id: selectedId, email: email.trim() }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    display: 'block' as const,
    width: '100%',
    marginBottom: '8px',
    padding: '8px 12px',
    border: '1px solid var(--rule)',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    background: 'var(--paper)',
    color: 'var(--ink)',
    outline: 'none',
  }

  return (
    <div>
      {/* Step 1: Email */}
      <input
        type="email"
        placeholder="Email you listed with"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          setListings(null)
          setSelectedId(null)
          setError(null)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleLookup()
        }}
        style={inputStyle}
      />

      {!listings && (
        <button
          onClick={handleLookup}
          disabled={lookingUp}
          className="btn-action"
          style={{ width: '100%', padding: '10px', opacity: lookingUp ? 0.7 : 1 }}
        >
          {lookingUp ? 'Finding your listings…' : 'Find My Listings'}
        </button>
      )}

      {/* Step 2: Pick listing */}
      {listings && listings.length > 1 && (
        <select
          value={selectedId ?? ''}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          style={{
            ...inputStyle,
            cursor: 'pointer',
            appearance: 'auto',
          }}
        >
          <option value="" disabled>Select a listing</option>
          {listings.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title} ({l.type})
            </option>
          ))}
        </select>
      )}

      {listings && listings.length === 1 && (
        <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)', fontSize: '12px', marginBottom: '8px' }}>
          Upgrading: {listings[0].title}
        </p>
      )}

      {/* Step 3: Checkout */}
      {listings && (
        <button
          onClick={handleCheckout}
          disabled={loading || !selectedId}
          className="btn-action"
          style={{ width: '100%', padding: '10px', opacity: loading || !selectedId ? 0.7 : 1 }}
        >
          {loading ? 'Redirecting to checkout…' : label}
        </button>
      )}

      {error && (
        <p style={{
          color: 'var(--action)',
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
