'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

type Listing = {
  id: number
  title: string | null
  price_display: string | null
  neighborhood: string | null
  type: string | null
  images: unknown
  description: string | null
}

type Props = {
  listings: Listing[]
}

function getThumb(images: unknown): string | null {
  if (!Array.isArray(images)) return null
  for (const x of images) {
    if (typeof x === 'string' && x) return x
    if (typeof x === 'object' && x !== null && 'url' in x && typeof (x as Record<string, string>).url === 'string') {
      return (x as Record<string, string>).url
    }
  }
  return null
}

export default function CategoryFilter({ listings }: Props) {
  const [neighborhood, setNeighborhood] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const neighborhoods = useMemo(() => {
    const set = new Set<string>()
    for (const l of listings) {
      if (l.neighborhood) set.add(l.neighborhood)
    }
    return Array.from(set).sort()
  }, [listings])

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (neighborhood && l.neighborhood !== neighborhood) return false
      if (minPrice || maxPrice) {
        // Extract number from price_display like "$500/mo" or "500"
        const match = l.price_display?.replace(/[^0-9]/g, '')
        const price = match ? Number(match) : null
        if (price === null) return !minPrice && !maxPrice
        if (minPrice && price < Number(minPrice)) return false
        if (maxPrice && price > Number(maxPrice)) return false
      }
      return true
    })
  }, [listings, neighborhood, minPrice, maxPrice])

  const hasFilters = neighborhood || minPrice || maxPrice

  return (
    <>
      {/* Filter bar */}
      <div
        style={{ borderTop: '1px solid #d6d0c4', borderBottom: '1px solid #d6d0c4', background: '#edeae2' }}
        className="mb-6 flex flex-wrap items-end gap-4 px-0 py-4"
      >
        {/* Neighborhood */}
        <div className="flex flex-col gap-1">
          <label style={{ fontFamily: 'var(--font-mono)', color: '#8c8680' }} className="text-xs uppercase">
            Neighborhood
          </label>
          <select
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            style={{
              fontFamily: 'var(--font-body)',
              color: '#1a1814',
              background: '#f4f1eb',
              border: '1px solid #d6d0c4',
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

        {/* Price range */}
        <div className="flex flex-col gap-1">
          <label style={{ fontFamily: 'var(--font-mono)', color: '#8c8680' }} className="text-xs uppercase">
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
                color: '#1a1814',
                background: '#f4f1eb',
                border: '1px solid #d6d0c4',
                borderRadius: 0,
                padding: '6px 10px',
                fontSize: '0.85rem',
                width: '90px',
              }}
            />
            <span style={{ color: '#8c8680' }} className="text-xs">—</span>
            <input
              type="number"
              placeholder="Max $"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{
                fontFamily: 'var(--font-mono)',
                color: '#1a1814',
                background: '#f4f1eb',
                border: '1px solid #d6d0c4',
                borderRadius: 0,
                padding: '6px 10px',
                fontSize: '0.85rem',
                width: '90px',
              }}
            />
          </div>
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={() => { setNeighborhood(''); setMinPrice(''); setMaxPrice('') }}
            style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }}
            className="text-xs underline hover:text-[#1a1814] self-end pb-1"
          >
            Clear filters
          </button>
        )}

        <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="ml-auto self-end text-xs pb-1">
          {filtered.length} {filtered.length === 1 ? 'space' : 'spaces'}
        </p>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="listing-grid mb-14">
          {filtered.map((l) => {
            const thumb = getThumb(l.images)
            return (
              <Link
                key={l.id}
                href={`/listing/${l.id}`}
                style={{ border: '1px solid #d6d0c4', background: '#edeae2' }}
                className="group flex flex-col hover:border-[#8c8680] transition-colors"
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" className="w-full object-cover" style={{ aspectRatio: '16/9', objectFit: 'cover' }} />
                ) : (
                  <div style={{ background: '#d6d0c4', aspectRatio: '16/9' }} />
                )}
                <div className="flex flex-1 flex-col p-4">
                  {l.type && (
                    <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mb-1 text-xs uppercase">
                      {l.type}
                    </p>
                  )}
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="line-clamp-2 font-semibold leading-snug">
                    {l.title}
                  </h3>
                  <div style={{ fontFamily: 'var(--font-mono)', color: '#8c8680' }} className="mt-2 text-xs">
                    {l.price_display && <span>{l.price_display}</span>}
                    {l.price_display && l.neighborhood && <span> · </span>}
                    {l.neighborhood && <span>{l.neighborhood}</span>}
                  </div>
                  <p style={{ color: '#2c4a3e' }} className="mt-auto pt-3 text-xs font-medium">
                    View space →
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <p style={{ color: '#8c8680' }} className="mb-14">No spaces match those filters.</p>
      )}
    </>
  )
}
