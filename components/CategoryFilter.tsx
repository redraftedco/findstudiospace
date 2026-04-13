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
  created_at: string | null
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

function timeAgo(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Listed today'
  if (days === 1) return 'Listed yesterday'
  if (days < 30) return `Listed ${days} days ago`
  if (days < 90) return `Listed ${Math.floor(days / 7)} weeks ago`
  return `Listed ${Math.floor(days / 30)} months ago`
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
            const timestamp = timeAgo(l.created_at)
            const hasPrice = !!l.price_display
            return (
              <Link
                key={l.id}
                href={`/listing/${l.id}`}
                style={{ border: '1px solid #d6d0c4', background: '#edeae2' }}
                className="group flex flex-col hover:border-[#8c8680] transition-colors"
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" className="w-full listing-card-placeholder" style={{ objectFit: 'cover', height: '200px' }} />
                ) : (
                  <div className="listing-card-placeholder" />
                )}
                <div className="flex flex-1 flex-col p-4">
                  {l.type && (
                    <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mb-1 text-xs uppercase">
                      {l.type}
                    </p>
                  )}
                  {l.neighborhood && (
                    <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mb-1 text-xs">
                      {l.neighborhood.trim()}
                    </p>
                  )}
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="line-clamp-2 font-semibold leading-snug">
                    {l.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: hasPrice ? '#1a1814' : '#8c8680',
                      fontStyle: hasPrice ? 'normal' : 'italic',
                    }}
                    className="mt-2 text-xs"
                  >
                    {hasPrice ? l.price_display : 'Price on request'}
                  </p>
                  <p style={{ color: '#2c4a3e' }} className="mt-auto pt-3 text-xs font-medium">
                    View space →
                  </p>
                  {timestamp && (
                    <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mt-1 text-xs">
                      {timestamp}
                    </p>
                  )}
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
