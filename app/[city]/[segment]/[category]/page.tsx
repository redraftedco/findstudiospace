/**
 * app/[city]/[segment]/[category]/page.tsx
 *
 * Intersection page: neighborhood × category for non-Portland cities.
 * e.g. /seattle/capitol-hill/photo-studio-rental
 *
 * [segment] must resolve to a neighborhood that belongs to [city].
 * [category] must resolve to a known category slug.
 *
 * Listings are fetched via the listing_categories join table so only
 * listings explicitly tagged to this category are shown. If listing_categories
 * is unpopulated the page renders with 0 results and is served noindex.
 *
 * Quality gate: same thresholds as segment page (≥4 listings, ≥50% photos,
 * city must be indexable).
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { qualityGate } from '@/lib/seo/qualityGate'
import { robotsContent } from '@/lib/seo/robotsTag'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
)

const BASE = 'https://www.findstudiospace.com'

type Listing = {
  id: number
  title: string
  price_display: string | null
  price_numeric: number | null
  neighborhood: string | null
  type: string | null
  images: unknown[]
  niche_attributes: Record<string, unknown> | null
  tier: string
  is_featured: boolean
}

type PageProps = {
  params: Promise<{ city: string; segment: string; category: string }>
  searchParams: Promise<{ amenity?: string }>
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function priceRange(listings: Listing[]): string | null {
  const prices = listings
    .map(l => l.price_numeric)
    .filter((p): p is number => typeof p === 'number' && p > 0)
  if (prices.length === 0) return null
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return min === max
    ? `$${min.toLocaleString('en-US')}/mo`
    : `$${min.toLocaleString('en-US')}–$${max.toLocaleString('en-US')}/mo`
}

function photoRatio(listings: Listing[]): number {
  if (listings.length === 0) return 0
  return listings.filter(l => Array.isArray(l.images) && l.images.length > 0).length / listings.length
}

function formatAmenityLabel(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function amenityOptions(listings: Listing[]): { key: string; label: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const listing of listings) {
    const attrs = listing.niche_attributes
    if (!attrs || typeof attrs !== 'object') continue
    for (const [key, value] of Object.entries(attrs)) {
      if (value === true) counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([key, count]) => ({ key, count, label: formatAmenityLabel(key) }))
}

// ── Shared data loader ────────────────────────────────────────────────────────

async function loadPageData(citySlug: string, segment: string, categorySlug: string) {
  const [{ data: city }, { data: neighborhood }, { data: category }] = await Promise.all([
    supabase.from('cities').select('id, name, state, is_indexable').eq('slug', citySlug).maybeSingle(),
    supabase.from('neighborhoods').select('id, name, slug, city_id').eq('slug', segment).maybeSingle(),
    supabase.from('categories').select('id, name, plural_name, slug').eq('slug', categorySlug).maybeSingle(),
  ])

  if (!city || !neighborhood || !category) return null
  if (neighborhood.city_id !== city.id) return null

  return { city, neighborhood, category }
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug, segment, category: categorySlug } = await params
  const data = await loadPageData(citySlug, segment, categorySlug)
  if (!data) return {}

  const { city, neighborhood, category } = data
  const canonicalUrl = `${BASE}/${citySlug}/${segment}/${categorySlug}`

  // Count listings for quality gate
  const { data: catMappings } = await supabase
    .from('listing_categories')
    .select('listing_id')
    .eq('category_id', category.id)

  const ids = (catMappings ?? []).map(r => r.listing_id as number)

  const { data: rows } = ids.length > 0
    ? await supabase
        .from('listings')
        .select('id, images')
        .eq('city_id', city.id)
        .eq('status', 'active')
        .ilike('neighborhood', neighborhood.name)
        .in('id', ids)
        .limit(200)
    : { data: [] }

  const listings = (rows ?? []) as Pick<Listing, 'id' | 'images'>[]
  const gate = qualityGate({
    listingCount: listings.length,
    photoRatio: photoRatio(listings as Listing[]),
    cityIndexable: city.is_indexable,
  })

  const title = `${category.plural_name} in ${neighborhood.name}, ${city.name} | FindStudioSpace`
  const description = `Find ${listings.length} ${category.plural_name.toLowerCase()} for monthly rent in ${neighborhood.name}, ${city.name}, ${city.state}.`

  return {
    title,
    description: description.slice(0, 155),
    alternates: { canonical: canonicalUrl },
    robots: robotsContent(gate.indexable),
    openGraph: { title, description: description.slice(0, 155) },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function IntersectionPage({ params, searchParams }: PageProps) {
  const { city: citySlug, segment, category: categorySlug } = await params
  const { amenity } = await searchParams
  const data = await loadPageData(citySlug, segment, categorySlug)
  if (!data) notFound()

  const { city, neighborhood, category } = data

  // Get listing IDs for this category
  const { data: catMappings } = await supabase
    .from('listing_categories')
    .select('listing_id')
    .eq('category_id', category.id)

  const ids = (catMappings ?? []).map(r => r.listing_id as number)

  const { data: listingRows } = ids.length > 0
    ? await supabase
        .from('listings')
        .select('id, title, price_display, price_numeric, neighborhood, type, images, niche_attributes, tier, is_featured')
        .eq('city_id', city.id)
        .eq('status', 'active')
        .ilike('neighborhood', neighborhood.name)
        .in('id', ids)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(200)
    : { data: [] }

  const baseListings = (listingRows ?? []) as Listing[]
  const amenityList = amenityOptions(baseListings)
  const listings = amenity
    ? baseListings.filter((listing) => listing.niche_attributes?.[amenity] === true)
    : baseListings
  const gate = qualityGate({
    listingCount: listings.length,
    photoRatio: photoRatio(listings),
    cityIndexable: city.is_indexable,
  })
  const range = priceRange(listings)

  const intro = listings.length > 0
    ? `${listings.length} ${category.plural_name.toLowerCase()} available for monthly rent in ${neighborhood.name}, ${city.name}.${range ? ` Prices from ${range}.` : ''}`
    : `No ${category.plural_name.toLowerCase()} are currently listed in ${neighborhood.name}.`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.plural_name} in ${neighborhood.name}, ${city.name}`,
    numberOfItems: listings.length,
    itemListElement: listings.slice(0, 100).map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}/listing/${l.id}`,
    })),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',           item: BASE },
      { '@type': 'ListItem', position: 2, name: city.name,        item: `${BASE}/${citySlug}` },
      { '@type': 'ListItem', position: 3, name: neighborhood.name, item: `${BASE}/${citySlug}/${segment}` },
      { '@type': 'ListItem', position: 4, name: category.plural_name },
    ],
  }

  return (
    <>
      {!gate.indexable && (
        <meta name="robots" content="noindex, follow" />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-5xl">

          {/* Breadcrumb */}
          <nav style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>
            <Link href="/" className="hover:underline" style={{ color: 'var(--ink)' }}>Home</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <Link href={`/${citySlug}`} className="hover:underline" style={{ color: 'var(--ink)' }}>{city.name}</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <Link href={`/${citySlug}/${segment}`} className="hover:underline" style={{ color: 'var(--ink)' }}>{neighborhood.name}</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span>{category.plural_name}</span>
          </nav>

          {/* Header */}
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1rem' }}>
            {category.plural_name} in {neighborhood.name}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--stone)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '640px', marginBottom: '2.5rem' }}>
            {intro}
          </p>

          {amenityList.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {amenityList.map((item) => {
                const active = amenity === item.key
                return (
                  <Link
                    key={item.key}
                    href={active ? `/${citySlug}/${segment}/${categorySlug}` : `/${citySlug}/${segment}/${categorySlug}?amenity=${item.key}`}
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
                    {item.label} ({item.count})
                  </Link>
                )
              })}
            </div>
          )}

          {/* Dev quality gate notice */}
          {!gate.indexable && process.env.NODE_ENV !== 'production' && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--action)', marginBottom: '1rem', border: '1px solid var(--action)', padding: '6px 10px', display: 'inline-block' }}>
              NOINDEX — {gate.reason}
            </p>
          )}

          {/* Listings */}
          {listings.length === 0 ? (
            <p style={{ color: 'var(--stone)' }} className="text-sm">No listings yet.</p>
          ) : (
            <div className="home-grid">
              {listings.map(listing => (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.id}`}
                  style={{ border: '1px solid var(--rule)', background: 'var(--surface)', display: 'block', padding: '1rem' }}
                  className="hover:border-[var(--stone)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontWeight: 600, lineHeight: 1.3 }}>
                      {listing.title ?? 'Untitled listing'}
                    </h2>
                    {listing.tier === 'pro' && <span className="pro-badge">Pro</span>}
                  </div>
                  {listing.price_display && (
                    <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {listing.price_display}
                    </p>
                  )}
                  {listing.neighborhood && (
                    <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      {listing.neighborhood}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Internal links */}
          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--rule)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone)', marginBottom: '0.25rem' }}>
              Browse more
            </p>
            <Link href={`/${citySlug}/${segment}`} style={{ color: 'var(--action)', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }} className="hover:underline">
              All studios in {neighborhood.name} →
            </Link>
            <Link href={`/${citySlug}`} style={{ color: 'var(--action)', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }} className="hover:underline">
              All studios in {city.name} →
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
