'use client'

import { useEffect, useMemo, useState } from 'react'
import { NICHE_FILTERS, type Listing } from '@/lib/listings'
import { supabase } from '@/lib/supabase'
import InquiryButton from '@/components/InquiryButton'

type ToggleState = Record<(typeof NICHE_FILTERS)[number]['key'], boolean>

const initialToggles = NICHE_FILTERS.reduce((acc, filter) => {
  acc[filter.key] = false
  return acc
}, {} as ToggleState)

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [toggles, setToggles] = useState<ToggleState>(initialToggles)

  useEffect(() => {
    async function fetchListings() {
      const { data } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .limit(584)

      setListings((data as Listing[]) ?? [])
      setLoading(false)
    }

    fetchListings()
  }, [])

  const filteredListings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return listings.filter((listing) => {
      const searchable = [
        listing.title,
        listing.neighborhood,
        listing.city,
        listing.category,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const matchesQuery =
        normalizedQuery.length === 0 || searchable.includes(normalizedQuery)

      const matchesToggles = NICHE_FILTERS.every((filter) => {
        if (!toggles[filter.key]) {
          return true
        }

        return Boolean(listing.niche_attributes?.[filter.key])
      })

      return matchesQuery && matchesToggles
    })
  }, [listings, query, toggles])

  function onToggle(key: (typeof NICHE_FILTERS)[number]['key']) {
    setToggles((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  function resetFilters() {
    setQuery('')
    setToggles(initialToggles)
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Find Studio Space in Portland</h1>
          <p className="text-gray-600">
            Search 584 active listings and filter by niche equipment.
          </p>
        </header>

        <section className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              className="w-full rounded-md border px-3 py-2"
              placeholder="Search by title, neighborhood, city, or category"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button
              className="rounded-md border px-3 py-2 text-sm font-medium"
              onClick={resetFilters}
              type="button"
            >
              Reset filters
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {NICHE_FILTERS.map((filter) => {
              const isActive = toggles[filter.key]

              return (
                <button
                  key={filter.key}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    isActive
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                  onClick={() => onToggle(filter.key)}
                  type="button"
                >
                  {filter.label}
                </button>
              )
            })}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm text-gray-700">
            {loading ? 'Loading listings…' : `${filteredListings.length} listings found`}
          </p>

          {!loading && filteredListings.length === 0 && (
            <p className="rounded-md border bg-white p-4 text-sm text-gray-700">
              No listings matched the current search and filter combination.
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <article key={listing.id} className="rounded-lg border bg-white p-4 shadow-sm">
                <h2 className="font-semibold">{listing.title ?? 'Untitled listing'}</h2>
                {listing.price_display && (
                  <p className="mt-1 text-blue-700">{listing.price_display}</p>
                )}
                {listing.neighborhood && (
                  <p className="mt-1 text-sm text-gray-600">📍 {listing.neighborhood}</p>
                )}
                <InquiryButton
                  listingId={String(listing.id)}
                  listingTitle={listing.title ?? 'this listing'}
                />
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
