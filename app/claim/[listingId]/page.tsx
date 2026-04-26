'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ClaimListingPage({
  params,
}: {
  params: Promise<{ listingId: string }>
}) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [listingId, setListingId] = useState<string | null>(null)

  // Resolve params
  if (!listingId) {
    params.then(p => setListingId(p.listingId))
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !listingId) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/claim/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), listing_id: listingId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }

      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--paper)',
      padding: '80px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>

        <Link href={`/listing/${listingId}`} style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--stone)',
          textDecoration: 'none',
          display: 'block',
          marginBottom: '48px',
        }}>
          ← Back to listing
        </Link>

        {sent ? (
          <>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--ink)',
              margin: '0 0 12px',
            }}>
              Check your email
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--stone)',
              lineHeight: 1.6,
              margin: 0,
            }}>
              We sent a sign-in link to <strong style={{ color: 'var(--ink)' }}>{email}</strong>.
              Click the link to access your listing dashboard. The link expires in 1 hour.
            </p>
          </>
        ) : (
          <>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--ink)',
              margin: '0 0 8px',
              lineHeight: 1.2,
            }}>
              Claim your listing
            </h1>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--stone)',
              margin: '0 0 32px',
              lineHeight: 1.6,
            }}>
              Enter your email to verify ownership. We&apos;ll send a one-time sign-in link — no password needed.
            </p>

            <form onSubmit={handleSubmit}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--stone)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '6px',
              }}>
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="you@studio.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid var(--rule)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  background: 'var(--search-bg)',
                  color: 'var(--ink)',
                  boxSizing: 'border-box',
                  outline: 'none',
                  marginBottom: '16px',
                  minHeight: '48px',
                }}
              />

              <button
                type="submit"
                disabled={loading}
                className="btn-action"
                style={{
                  width: '100%',
                  padding: '12px',
                  opacity: loading ? 0.7 : 1,
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Sending...' : 'Claim My Listing'}
              </button>
            </form>

            {error && (
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--action)',
                marginTop: '16px',
              }}>
                {error}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
