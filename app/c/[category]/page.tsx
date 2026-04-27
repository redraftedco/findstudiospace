/**
 * app/c/[category]/page.tsx
 *
 * National category aggregation page.
 * e.g. /c/photo-studio-rental → photo studios across all indexable cities
 *
 * Listings are fetched via listing_categories join table so only listings
 * explicitly tagged to this category appear. Filtered to indexable=true so
 * only quality-gated, published listings are shown.
 *
 * Quality gate: cityIndexable is treated as always-true here because the
 * indexable=true filter already enforces city publication. The listingCount
 * threshold (≥4) is still applied.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { qualityGate } from '@/lib/seo/qualityGate'
import { robotsContent } from '@/lib/seo/robotsTag'
import { hasAmenity, topAmenityOptions } from '@/lib/amenities'

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
  city: string | null
  type: string | null
  images: unknown[]
  niche_attributes: Record<string, unknown> | null
  tier: string
  is_featured: boolean
}

type PageProps = {
  params: Promise<{ category: string }>
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

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const { amenity } = await searchParams

  const { data: category } = await supabase
    .from('categories')
    .select('id, name, plural_name')
    .eq('slug', categorySlug)
    .maybeSingle()

  if (!category) return {}

  const { data: catMappings } = await supabase
    .from('listing_categories')
    .select('listing_id')
    .eq('category_id', category.id)

  const ids = (catMappings ?? []).map(r => r.listing_id as number)

  const { data: rows } = ids.length > 0
    ? await supabase
        .from('listings')
        .select('id, images, niche_attributes')
        .eq('status', 'active')
        .eq('indexable', true)
        .in('id', ids)
        .limit(200)
    : { data: [] }

  const baseListings = (rows ?? []) as Pick<Listing, 'id' | 'images' | 'niche_attributes'>[]
  const listings = amenity
    ? baseListings.filter((l) => hasAmenity(l.niche_attributes ?? null, amenity))
    : baseListings
  const gate = qualityGate({
    listingCount: listings.length,
    photoRatio: photoRatio(listings as Listing[]),
    cityIndexable: true,
  })

  const canonicalUrl = amenity
    ? `${BASE}/c/${categorySlug}?amenity=${encodeURIComponent(amenity)}`
    : `${BASE}/c/${categorySlug}`
  const title = `${category.plural_name} for Rent | FindStudioSpace`
  const description = `Browse ${listings.length} ${category.plural_name.toLowerCase()} available for monthly rent across all cities. No brokers, no long-term leases.`

  return {
    title,
    description: description.slice(0, 155),
    alternates: { canonical: canonicalUrl },
    robots: robotsContent(gate.indexable),
    openGraph: { title, description: description.slice(0, 155) },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function NationalCategoryPage({ params, searchParams }: PageProps) {
  const { category: categorySlug } = await params
  const { amenity } = await searchParams

  const { data: category } = await supabase
    .from('categories')
    .select('id, name, plural_name, slug')
    .eq('slug', categorySlug)
    .maybeSingle()

  if (!category) notFound()

  // Get listing IDs tagged to this category
  const { data: catMappings } = await supabase
    .from('listing_categories')
    .select('listing_id')
    .eq('category_id', category.id)

  const ids = (catMappings ?? []).map(r => r.listing_id as number)

  const { data: listingRows } = ids.length > 0
    ? await supabase
        .from('listings')
        .select('id, title, price_display, price_numeric, neighborhood, city, type, images, niche_attributes, tier, is_featured')
        .eq('status', 'active')
        .eq('indexable', true)
        .in('id', ids)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(200)
    : { data: [] }

  const baseListings = (listingRows ?? []) as Listing[]
  const amenityList = topAmenityOptions(baseListings)
  const listings = amenity
    ? baseListings.filter((listing) => hasAmenity(listing.niche_attributes, amenity))
    : baseListings
  const gate = qualityGate({
    listingCount: listings.length,
    photoRatio: photoRatio(listings),
    cityIndexable: true,
  })
  const range = priceRange(listings)

  const intro = listings.length > 0
    ? `${listings.length} ${category.plural_name.toLowerCase()} available for monthly rent across all cities.${range ? ` Prices from ${range}.` : ''} No brokers, no long-term leases.`
    : `No ${category.plural_name.toLowerCase()} are currently listed. Check back soon.`

  // Unique cities represented
  const cityNames = [...new Set(listings.map(l => l.city).filter(Boolean))] as string[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.plural_name} for Rent`,
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
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: category.plural_name },
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
            <span>{category.plural_name}</span>
          </nav>

          {/* Header */}
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1rem' }}>
            {category.plural_name} for Rent
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
                    href={active ? `/c/${categorySlug}` : `/c/${categorySlug}?amenity=${item.key}`}
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
                  {(listing.neighborhood || listing.city) && (
                    <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      {[listing.neighborhood, listing.city].filter(Boolean).join(', ')}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* City links */}
          {cityNames.length > 0 && (
            <div style={{ marginTop: '3rem', borderTop: '1px solid var(--rule)', paddingTop: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone)', marginBottom: '0.75rem' }}>
                Browse by city
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {cityNames.map(name => (
                  <Link
                    key={name}
                    href={`/${name.toLowerCase().replace(/\s+/g, '-')}`}
                    style={{ color: 'var(--action)', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}
                    className="hover:underline"
                  >
                    {name} →
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  )
}
