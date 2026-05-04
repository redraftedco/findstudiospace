'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

interface ClaimResult {
  listing_id: number
  title: string
  neighborhood: string
  type: string
  inquiry_count: number
  tier: string
}

type ClaimStep = 'idle' | 'sent'

function ClaimPageInner() {
  const params = useSearchParams()
  const prefillId = params.get('listing_id') || ''
  const success = params.get('success')
  const canceled = params.get('canceled')

  const [listingId, setListingId] = useState(prefillId)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ClaimResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

  const [claimEmail, setClaimEmail] = useState('')
  const [claimLoading, setClaimLoading] = useState(false)
  const [claimStep, setClaimStep] = useState<ClaimStep>('idle')
  const [claimError, setClaimError] = useState<string | null>(null)

  const ownershipError = params.get('error') === 'ownership_mismatch'

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

  async function handleClaim() {
    if (!result || !claimEmail.trim()) {
      setClaimError('Enter the email address associated with this listing.')
      return
    }
    setClaimLoading(true)
    setClaimError(null)
    try {
      const res = await fetch('/api/claim/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: claimEmail.trim(), listing_id: result.listing_id }),
      })
      const data = await res.json()
      if (res.status === 429) {
        setClaimError(data.error ?? 'Please wait a minute before trying again.')
        return
      }
      if (!res.ok) {
        setClaimError(data.error ?? 'Something went wrong. Try again.')
        return
      }
      setClaimStep('sent')
    } catch {
      setClaimError('Something went wrong. Try again.')
    } finally {
      setClaimLoading(false)
    }
  }

  async function handlePortal() {
    if (!result) return
    setPortalLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: result.listing_id }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Could not open subscription portal. Try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setPortalLoading(false)
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

        <Link href="/" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--stone)',
          textDecoration: 'none',
          display: 'block',
          marginBottom: '48px',
        }}>
          ← FindStudioSpace
        </Link>

        {ownershipError && (
          <div style={{
            background: 'rgba(229,161,0,0.08)',
            color: 'var(--featured-color)',
            padding: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            marginBottom: '24px',
            border: '1px solid rgba(229,161,0,0.2)',
          }}>
            That link didn&apos;t match this listing&apos;s ownership records. Enter your email below to try again.
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(212,245,66,0.08)',
            color: 'var(--lime)',
            padding: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            marginBottom: '24px',
            border: '1px solid rgba(212,245,66,0.2)',
          }}>
            Your Pro upgrade is active. Your listing will be updated within a few minutes.
          </div>
        )}

        {canceled && (
          <div style={{
            background: 'rgba(229,161,0,0.08)',
            color: 'var(--featured-color)',
            padding: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            marginBottom: '24px',
            border: '1px solid rgba(229,161,0,0.2)',
          }}>
            Checkout canceled. No charges were made.
          </div>
        )}

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
          margin: '0 0 40px',
          lineHeight: 1.6,
        }}>
          Enter your listing ID to see how many renters have inquired about your studio, and to manage your listing.
        </p>

        <div style={{ marginBottom: '12px' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--stone)',
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
              padding: '12px 14px',
              border: '1px solid var(--rule)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              background: 'var(--search-bg)',
              color: 'var(--ink)',
              minHeight: '48px',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--stone)',
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
            color: 'var(--action)',
            margin: '0 0 24px',
          }}>
            {error}
          </p>
        )}

        {result && (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--rule)',
            padding: '24px',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--stone)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              margin: '0 0 4px',
            }}>
              {result.type} · {result.neighborhood}
            </p>

            <div className="flex items-center gap-2" style={{ margin: '0 0 24px' }}>
              <p style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--ink)',
                margin: 0,
              }}>
                {result.title}
              </p>
              {result.tier === 'pro' && <span className="pro-badge">Pro</span>}
            </div>

            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--rule)',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '20px',
            }}>
              <p style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '48px',
                fontWeight: 700,
                color: result.inquiry_count > 0 ? 'var(--action)' : 'var(--stone)',
                margin: '0 0 4px',
                lineHeight: 1,
              }}>
                {result.inquiry_count}
              </p>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--stone)',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                {result.inquiry_count === 1 ? 'inquiry' : 'inquiries'} received
              </p>
            </div>

            {/* Pro state: manage subscription */}
            {result.tier === 'pro' && (
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--ink)',
                  background: 'transparent',
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: portalLoading ? 'not-allowed' : 'pointer',
                  opacity: portalLoading ? 0.7 : 1,
                }}
              >
                {portalLoading ? 'Opening...' : 'Manage subscription →'}
              </button>
            )}

            {/* Free state: claim flow */}
            {result.tier !== 'pro' && (
              claimStep === 'sent' ? (
                <div style={{
                  background: 'rgba(212,245,66,0.08)',
                  border: '1px solid rgba(212,245,66,0.2)',
                  padding: '20px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--lime)',
                  lineHeight: 1.6,
                }}>
                  If that email matches our records, you&apos;ll get a link in the next minute. Check your inbox and click it to access your dashboard.
                </div>
              ) : (
                <>
                  <p style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    margin: '0 0 6px',
                  }}>
                    Claim this listing
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    color: 'var(--stone)',
                    margin: '0 0 14px',
                    lineHeight: 1.6,
                  }}>
                    Enter the email address associated with this studio. We&apos;ll send a sign-in link — no password needed.
                  </p>

                  <input
                    type="email"
                    placeholder="studio@example.com"
                    value={claimEmail}
                    onChange={e => setClaimEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleClaim()}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px 12px',
                      minHeight: '48px',
                      border: '1px solid var(--rule)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      background: 'var(--search-bg)',
                      color: 'var(--ink)',
                      marginBottom: '10px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />

                  {claimError && (
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: 'var(--action)',
                      margin: '0 0 10px',
                    }}>
                      {claimError}
                    </p>
                  )}

                  <button
                    onClick={handleClaim}
                    disabled={claimLoading}
                    className="btn-action"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: 500,
                      border: 'none',
                      cursor: claimLoading ? 'not-allowed' : 'pointer',
                      opacity: claimLoading ? 0.7 : 1,
                    }}
                  >
                    {claimLoading ? 'Sending…' : 'Send claim link →'}
                  </button>
                </>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ClaimPage() {
  return (
    <Suspense fallback={
      <main className="px-6 py-16">
        <div className="mx-auto max-w-lg">
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="text-3xl font-semibold mb-3">
            Claim your listing
          </h1>
          <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }} className="text-sm leading-relaxed">
            Loading…
          </p>
        </div>
      </main>
    }>
      <ClaimPageInner />
    </Suspense>
  )
}

