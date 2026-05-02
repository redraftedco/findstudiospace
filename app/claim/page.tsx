'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import posthog from 'posthog-js'

interface ClaimResult {
  listing_id: number
  title: string
  neighborhood: string
  type: string
  inquiry_count: number
  tier: string
  stripe_customer_id: string | null
}

function ClaimPageInner() {
  const params = useSearchParams()
  const prefillId = params.get('listing_id') || ''
  const success = params.get('success')
  const canceled = params.get('canceled')

  const [listingId, setListingId] = useState(prefillId)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ClaimResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [interval, setInterval] = useState<'monthly' | 'annual'>('monthly')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

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

  async function handleCheckout() {
    if (!result) return
    setCheckoutLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: result.listing_id,
          email: '',
          interval,
        }),
      })
      const data = await res.json()
      if (data.url) {
        posthog.capture('upgrade_checkout_started', {
          listing_id: result.listing_id,
          interval,
        })
        window.location.href = data.url
      } else {
        setError(data.error || 'Could not start checkout. Try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  async function handlePortal() {
    if (!result?.stripe_customer_id) return
    setPortalLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: result.stripe_customer_id,
          listing_id: result.listing_id,
        }),
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
          See your inquiry activity
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--stone)',
          margin: '0 0 40px',
          lineHeight: 1.6,
        }}>
          Enter your listing ID to see how many tenants have inquired about your space.
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
            {result.tier === 'pro' && result.stripe_customer_id && (
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

            {/* Free state: upgrade CTA */}
            {result.tier !== 'pro' && (
              <>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--stone)',
                  margin: '0 0 16px',
                  lineHeight: 1.6,
                }}>
                  Upgrade to Pro to receive inquiries directly in your inbox, get a verified badge, and rank higher in search.
                </p>

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="btn-action"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '14px',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    border: 'none',
                    cursor: checkoutLoading ? 'not-allowed' : 'pointer',
                    opacity: checkoutLoading ? 0.7 : 1,
                  }}
                >
                  {checkoutLoading ? 'Starting checkout...' : 'Start 30-day free trial →'}
                </button>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--stone)',
                  textAlign: 'center',
                  margin: '8px 0 0',
                }}>
                  $49/month after. Cancel anytime.
                </p>
              </>
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
            Enter your listing ID to find and claim your studio. Loading...
          </p>
        </div>
      </main>
    }>
      <ClaimPageInner />
    </Suspense>
  )
}
