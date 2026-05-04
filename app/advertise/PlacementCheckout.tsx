'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

const PLACEMENTS = [
  { value: 'featured_category',     label: 'Featured Category',     price: '$49/month', targetType: 'category' },
  { value: 'featured_neighborhood', label: 'Featured Neighborhood',  price: '$49/month', targetType: 'neighborhood' },
  { value: 'featured_studio',       label: 'Featured Studio',        price: '$149/month', targetType: 'category' },
] as const

const CATEGORY_TARGETS = [
  { value: 'event-space',              label: 'Event Space' },
  { value: 'photo-studios',            label: 'Photo Studios' },
  { value: 'content-studios',          label: 'Content Studios' },
  { value: 'makerspace',               label: 'Makerspace' },
  { value: 'art-studio-rental',        label: 'Art Studio' },
  { value: 'workshop-space-rental',    label: 'Workshop Space' },
  { value: 'office-space-rental',      label: 'Office Space' },
  { value: 'fitness-studio-rental',    label: 'Fitness Studio' },
  { value: 'retail-space-for-rent',    label: 'Retail Space' },
]

const NEIGHBORHOOD_TARGETS = [
  { value: 'pearl-district',    label: 'Pearl District' },
  { value: 'central-eastside',  label: 'Central Eastside' },
  { value: 'alberta-arts',      label: 'Alberta Arts District' },
  { value: 'mississippi',       label: 'Mississippi Ave' },
  { value: 'division',          label: 'Division St' },
  { value: 'slabtown',          label: 'Slabtown' },
  { value: 'kerns',             label: 'Kerns' },
]

export default function PlacementCheckout() {
  const params = useSearchParams()
  const [listingId, setListingId] = useState(params.get('listing_id') ?? '')
  const [placementType, setPlacementType] = useState<string>('featured_category')
  const [targetSlug, setTargetSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selected = PLACEMENTS.find(p => p.value === placementType)!
  const targetList = selected.targetType === 'category' ? CATEGORY_TARGETS : NEIGHBORHOOD_TARGETS
  const targetType = selected.targetType

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const id = parseInt(listingId, 10)
    if (!id || id <= 0) { setError('Enter a valid listing ID.'); return }
    if (!targetSlug) { setError('Select a target page.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: id, placement_type: placementType, target_type: targetType, target_slug: targetSlug }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }
      window.location.href = data.url
    } catch {
      setError('Network error, try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '480px' }}>
      <h2
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontWeight: 600 }}
        className="text-xl mb-6"
      >
        Start a sponsored placement
      </h2>

      {/* Listing ID */}
      <div className="mb-5">
        <label
          htmlFor="listing-id"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)', fontSize: '14px', fontWeight: 500 }}
          className="block mb-1"
        >
          Listing ID
        </label>
        <input
          id="listing-id"
          type="number"
          min="1"
          value={listingId}
          onChange={e => setListingId(e.target.value)}
          placeholder="e.g. 42"
          required
          style={{
            width: '100%',
            border: '1px solid var(--rule)',
            padding: '10px 12px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--ink)',
            background: 'var(--paper)',
          }}
        />
        <p style={{ color: 'var(--stone)', fontSize: '12px', marginTop: '4px', fontFamily: 'var(--font-body)' }}>
          Find your listing ID in the URL of your listing page.
        </p>
      </div>

      {/* Placement type */}
      <div className="mb-5">
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
          Placement type
        </p>
        <div className="space-y-2">
          {PLACEMENTS.map(p => (
            <label
              key={p.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid var(--rule)',
                padding: '12px 14px',
                cursor: 'pointer',
                background: placementType === p.value ? 'var(--moss-faint, #f0f4f0)' : 'var(--paper)',
              }}
            >
              <input
                type="radio"
                name="placement_type"
                value={p.value}
                checked={placementType === p.value}
                onChange={() => { setPlacementType(p.value); setTargetSlug('') }}
              />
              <span style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)', fontSize: '14px' }}>
                {p.label}
              </span>
              <span style={{ marginLeft: 'auto', color: 'var(--stone)', fontSize: '13px', fontFamily: 'var(--font-body)' }}>
                {p.price}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Target page */}
      <div className="mb-6">
        <label
          htmlFor="target-slug"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)', fontSize: '14px', fontWeight: 500 }}
          className="block mb-1"
        >
          {targetType === 'category' ? 'Category page' : 'Neighborhood page'}
        </label>
        <select
          id="target-slug"
          value={targetSlug}
          onChange={e => setTargetSlug(e.target.value)}
          required
          style={{
            width: '100%',
            border: '1px solid var(--rule)',
            padding: '10px 12px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: targetSlug ? 'var(--ink)' : 'var(--stone)',
            background: 'var(--paper)',
          }}
        >
          <option value="">Select a page…</option>
          {targetList.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <p style={{ color: '#c0392b', fontSize: '13px', fontFamily: 'var(--font-body)', marginBottom: '12px' }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-action"
        style={{
          width: '100%',
          minHeight: '48px',
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: '14px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Redirecting to Stripe…' : `Pay with card → ${selected.price}`}
      </button>

      <p style={{ color: 'var(--stone)', fontSize: '12px', marginTop: '10px', fontFamily: 'var(--font-body)' }}>
        You&apos;ll be taken to Stripe to complete payment. Cancel anytime from your billing portal.
      </p>
    </form>
  )
}
