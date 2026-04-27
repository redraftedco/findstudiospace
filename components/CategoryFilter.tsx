'use client'

import { useState, useMemo } from 'react'
import ListingCard from './ListingCard'
import { hasAmenity, topAmenityOptions } from '@/lib/amenities'

type Listing = {
  id: number
  title: string | null
  price_display: string | null
  neighborhood: string | null
  type: string | null
  images: unknown
  description: string | null
  created_at: string | null
  tier: string | null
  niche_attributes?: Record<string, unknown> | null
}

type Props = {
  listings: Listing[]
}

type AmenityOption = {
  key: string
  label: string
}

export default function CategoryFilter({ listings }: Props) {
  const [neighborhood, setNeighborhood] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [amenity, setAmenity] = useState('')

  const neighborhoods = useMemo(() => {
    const set = new Set<string>()
    for (const l of listings) {
      if (l.neighborhood) set.add(l.neighborhood)
    }
    return Array.from(set).sort()
  }, [listings])

  const amenities = useMemo(() => {
    return topAmenityOptions(listings).map(({ key, label }) => ({ key, label } satisfies AmenityOption))
  }, [listings])

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (neighborhood && l.neighborhood !== neighborhood) return false
      if (minPrice || maxPrice) {
        const match = l.price_display?.replace(/[^0-9]/g, '')
        const price = match ? Number(match) : null
        if (price === null) return !minPrice && !maxPrice
        if (minPrice && price < Number(minPrice)) return false
        if (maxPrice && price > Number(maxPrice)) return false
      }
      if (amenity) {
        const attrs = l.niche_attributes
        if (!hasAmenity(attrs, amenity)) return false
      }
      return true
    })
  }, [listings, neighborhood, minPrice, maxPrice, amenity])

  const hasFilters = neighborhood || minPrice || maxPrice || amenity

  return (
    <>
      {/* Filter bar */}
      <div
        style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', background: 'var(--surface)' }}
        className="mb-6 flex flex-wrap items-end gap-4 px-0 py-4"
      >
        <div className="flex flex-col gap-1">
          <label style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }} className="text-xs uppercase">
            Neighborhood
          </label>
          <select
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--ink)',
              background: 'var(--paper)',
              border: '1px solid var(--rule)',
              borderRadius: 0,
              padding: '6px 10px',
              fontSize: '0.85rem',
            }}
          >
            <option value="">All neighborhoods</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }} className="text-xs uppercase">
            Price range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min $"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--ink)',
                background: 'var(--paper)',
                border: '1px solid var(--rule)',
                borderRadius: 0,
                padding: '6px 10px',
                fontSize: '0.85rem',
                width: '90px',
              }}
            />
            <span style={{ color: 'var(--stone)' }} className="text-xs">—</span>
            <input
              type="number"
              placeholder="Max $"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--ink)',
                background: 'var(--paper)',
                border: '1px solid var(--rule)',
                borderRadius: 0,
                padding: '6px 10px',
                fontSize: '0.85rem',
                width: '90px',
              }}
            />
          </div>
        </div>

        {hasFilters && (
          <button
            onClick={() => { setNeighborhood(''); setMinPrice(''); setMaxPrice(''); setAmenity('') }}
            style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }}
            className="text-xs underline hover:text-[var(--ink)] self-end pb-1"
          >
            Clear filters
          </button>
        )}

        <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="ml-auto self-end text-xs pb-1">
          {filtered.length} {filtered.length === 1 ? 'space' : 'spaces'}
        </p>
      </div>

      {amenities.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {amenities.map((item) => {
            const active = amenity === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setAmenity(active ? '' : item.key)}
                style={{
                  border: '1px solid var(--rule)',
                  background: active ? 'var(--ink)' : 'var(--surface)',
                  color: active ? 'var(--paper)' : 'var(--ink)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '6px 10px',
                }}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="home-grid mb-14">
          {filtered.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      ) : (
        <p style={{ color: 'var(--stone)' }} className="mb-14">No spaces match those filters.</p>
      )}
    </>
  )
}
