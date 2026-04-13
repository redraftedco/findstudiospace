'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ClaimResult {
  listing_id: number
  title: string
  neighborhood: string
  type: string
  inquiry_count: number
}

export default function ClaimPage() {
  const [listingId, setListingId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ClaimResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleLookup() {
    if (!listingId.trim()) {
      setError('Enter your listing ID to continue.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`/api/claim?listing_id=${listingId.trim()}`)
      const data = await res.json()

      if (!res.ok) {
        setError('Listing not found. Check your listing ID and try again.')
        return
      }

      setResult(data)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f4f1eb',
      padding: '80px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>

      <div style={{ maxWidth: '480px', width: '100%' }}>

        {/* Header */}
        <Link href="/" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: '#6b6762',
          textDecoration: 'none',
          display: 'block',
          marginBottom: '48px',
        }}>
          ← FindStudioSpace
        </Link>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '28px',
          fontWeight: 700,
          color: '#1a1814',
          margin: '0 0 8px',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
        }}>
          See your inquiry activity
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: '#6b6762',
          margin: '0 0 40px',
          lineHeight: 1.6,
        }}>
          Enter your listing ID to see how many tenants have
          inquired about your space.
        </p>

        {/* Input */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: '#6b6762',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '6px',
          }}>
            Listing ID
          </label>
          <input
            type="text"
            placeholder="e.g. 593"
            value={listingId}
            onChange={e => setListingId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d6d0c4',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              background: 'white',
              color: '#1a1814',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: '#6b6762',
            margin: '6px 0 0',
          }}>
            Find your listing ID in your listing URL:
            findstudiospace.com/listing/<strong>593</strong>
          </p>
        </div>

        <button
          onClick={handleLookup}
          disabled={loading}
          className="btn-action"
          style={{
            width: '100%',
            padding: '12px',
            opacity: loading ? 0.7 : 1,
            marginBottom: '24px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: 500,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Looking up...' : 'Check my inquiries →'}
        </button>

        {error && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: '#a84530',
            margin: '0 0 24px',
          }}>
            {error}
          </p>
        )}

        {/* Result */}
        {result && (
          <div style={{
            background: '#edeae2',
            border: '1px solid #d6d0c4',
            padding: '24px',
          }}>

            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: '#6b6762',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              margin: '0 0 4px',
            }}>
              {result.type} · {result.neighborhood}
            </p>

            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '16px',
              fontWeight: 600,
              color: '#1a1814',
              margin: '0 0 24px',
            }}>
              {result.title}
            </p>

            <div style={{
              background: 'white',
              border: '1px solid #d6d0c4',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '20px',
            }}>
              <p style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '48px',
                fontWeight: 700,
                color: result.inquiry_count > 0 ? '#a84530' : '#6b6762',
                margin: '0 0 4px',
                lineHeight: 1,
              }}>
                {result.inquiry_count}
              </p>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#6b6762',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                {result.inquiry_count === 1 ? 'inquiry' : 'inquiries'} received
              </p>
            </div>

            {result.inquiry_count > 0 ? (
              <>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: '#6b6762',
                  margin: '0 0 16px',
                  lineHeight: 1.6,
                }}>
                  {result.inquiry_count} {result.inquiry_count === 1 ? 'person has' : 'people have'} reached
                  out about this space. Upgrade to Pro to receive their
                  contact details directly to your inbox.
                </p>

                <Link
                  href="/for-landlords#pricing"
                  className="btn-action"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '10px 20px',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  Upgrade to Pro — $49/month →
                </Link>
              </>
            ) : (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: '#6b6762',
                margin: 0,
                lineHeight: 1.6,
              }}>
                No inquiries yet. Make sure your listing is active and
                has photos and a description to attract tenants.
              </p>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
