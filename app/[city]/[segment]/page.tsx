/**
 * app/[city]/[segment]/page.tsx
 *
 * Unified handler for non-Portland city pages at the second URL level.
 * One segment can resolve to either a category or a neighborhood.
 *
 * Resolution order (per user decision, Option B):
 *   1. category wins over neighborhood if both somehow share a slug (shouldn't happen)
 *   2. If neither resolves → notFound()
 *
 * Quality gate: pages with < 4 listings or < 50% photo coverage are served
 * with noindex robots tag. The page still renders — it just isn't indexable.
 *
 * Portland is intentionally excluded from this route:
 * app/portland/[category]/page.tsx takes routing priority for /portland/*
 * and handles both Portland categories and neighborhoods via its config.
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
  tier: string
  is_featured: boolean
}

type PageProps = {
  params: Promise<{ city: string; segment: string }>
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
  const withPhotos = listings.filter(l => Array.isArray(l.images) && l.images.length > 0).length
  return withPhotos / listings.length
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug, segment } = await params

  const [{ data: city }, { data: category }, { data: neighborhood }] = await Promise.all([
    supabase.from('cities').select('id, name, state, is_indexable').eq('slug', citySlug).maybeSingle(),
    supabase.from('categories').select('id, name, plural_name').eq('slug', segment).maybeSingle(),
    supabase.from('neighborhoods').select('id, name, city_id').eq('slug', segment).maybeSingle(),
  ])

  if (!city) return {}

  // Resolve segment type
  const isCategory    = !!category
  const isNeighborhood = !!neighborhood && neighborhood.city_id === city.id

  if (!isCategory && !isNeighborhood) return {}

  const canonicalUrl = `${BASE}/${citySlug}/${segment}`

  if (isCategory) {
    const { data: listings } = await supabase
      .from('listings')
      .select('id, images')
      .eq('city_id', city.id)
      .eq('status', 'active')
      .limit(200)

    const rows = listings ?? []
    const gate = qualityGate({
      listingCount: rows.length,
      photoRatio: photoRatio(rows as Listing[]),
      cityIndexable: city.is_indexable,
    })

    const title = `${category!.plural_name} for Rent in ${city.name}, ${city.state} | FindStudioSpace`
    const description = `Browse ${rows.length} ${category!.plural_name.toLowerCase()} available for monthly rent in ${city.name}${rows.length > 0 ? ` — ${priceRange(rows as Listing[]) ?? 'prices vary'}.` : '.'}`

    return {
      title,
      description: description.slice(0, 155),
      alternates: { canonical: canonicalUrl },
      robots: robotsContent(gate.indexable),
      openGraph: { title, description: description.slice(0, 155) },
    }
  }

  // Neighborhood
  const { data: listings } = await supabase
    .from('listings')
    .select('id, images')
    .eq('city_id', city.id)
    .eq('status', 'active')
    .ilike('neighborhood', neighborhood!.name)
    .limit(200)

  const rows = listings ?? []
  const gate = qualityGate({
    listingCount: rows.length,
    photoRatio: photoRatio(rows as Listing[]),
    cityIndexable: city.is_indexable,
  })

  const title = `Studio Space for Rent in ${neighborhood!.name}, ${city.name} | FindStudioSpace`
  const description = `Find ${rows.length} creative studio${rows.length === 1 ? '' : 's'} for rent in ${neighborhood!.name}, ${city.name}${rows.length > 0 ? ` — ${priceRange(rows as Listing[]) ?? 'prices vary'}.` : '.'}`

  return {
    title,
    description: description.slice(0, 155),
    alternates: { canonical: canonicalUrl },
    robots: robotsContent(gate.indexable),
    openGraph: { title, description: description.slice(0, 155) },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function SegmentPage({ params }: PageProps) {
  const { city: citySlug, segment } = await params

  // Three parallel queries — city, category, neighborhood
  const [{ data: city }, { data: category }, { data: neighborhood }] = await Promise.all([
    supabase.from('cities').select('id, name, state, is_indexable').eq('slug', citySlug).maybeSingle(),
    supabase.from('categories').select('id, name, plural_name, slug').eq('slug', segment).maybeSingle(),
    supabase.from('neighborhoods').select('id, name, slug, city_id').eq('slug', segment).maybeSingle(),
  ])

  if (!city) notFound()

  const isCategory     = !!category
  const isNeighborhood = !!neighborhood && neighborhood.city_id === city.id

  if (!isCategory && !isNeighborhood) notFound()

  if (isCategory) {
    return <CategoryView city={city} category={category!} citySlug={citySlug} />
  }
  return <NeighborhoodView city={city} neighborhood={neighborhood!} citySlug={citySlug} />
}

// ── Category view ─────────────────────────────────────────────────────────────

async function CategoryView({
  city,
  category,
  citySlug,
}: {
  city: { id: number; name: string; state: string; is_indexable: boolean }
  category: { id: number; name: string; plural_name: string; slug: string }
  citySlug: string
}) {
  const { data: listingRows } = await supabase
    .from('listings')
    .select('id, title, price_display, price_numeric, neighborhood, type, images, tier, is_featured')
    .eq('city_id', city.id)
    .eq('status', 'active')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(200)

  const listings = (listingRows ?? []) as Listing[]
  const gate = qualityGate({
    listingCount: listings.length,
    photoRatio: photoRatio(listings),
    cityIndexable: city.is_indexable,
  })
  const range = priceRange(listings)

  // Unique intro built from real data (§12.2 specificity rule)
  const intro = listings.length > 0
    ? `Browse ${listings.length} ${category.plural_name.toLowerCase()} available for monthly rent in ${city.name}, ${city.state}.${range ? ` Prices range from ${range}.` : ''} Submit an inquiry directly from any listing.`
    : `No ${category.plural_name.toLowerCase()} are listed in ${city.name} yet. Check back soon or list your space.`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.plural_name} for Rent in ${city.name}`,
    numberOfItems: listings.length,
    itemListElement: listings.slice(0, 100).map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}/listing/${l.id}`,
    })),
  }

  return (
    <>
      {!gate.indexable && (
        <meta name="robots" content="noindex, follow" />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-5xl">

          {/* Breadcrumb */}
          <nav style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>
            <Link href="/" className="hover:underline" style={{ color: 'var(--ink)' }}>Home</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <Link href={`/${citySlug}`} className="hover:underline" style={{ color: 'var(--ink)' }}>{city.name}</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span>{category.plural_name}</span>
          </nav>

          {/* Header */}
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1rem' }}>
            {category.plural_name} for Rent in {city.name}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--stone)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '640px', marginBottom: '2.5rem' }}>
            {intro}
          </p>

          {/* Quality gate notice (dev/staging only — noindex pages get a visual hint) */}
          {!gate.indexable && process.env.NODE_ENV !== 'production' && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--action)', marginBottom: '1rem', border: '1px solid var(--action)', padding: '6px 10px', display: 'inline-block' }}>
              NOINDEX — {gate.reason}
            </p>
          )}

          {/* Listings grid */}
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

          {/* Internal links — city hub */}
          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--rule)', paddingTop: '2rem' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone)', marginBottom: '0.75rem' }}>
              Browse {city.name}
            </p>
            <Link href={`/${citySlug}`} style={{ color: 'var(--action)', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }} className="hover:underline">
              All studios in {city.name} →
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}

// ── Neighborhood view ─────────────────────────────────────────────────────────

async function NeighborhoodView({
  city,
  neighborhood,
  citySlug,
}: {
  city: { id: number; name: string; state: string; is_indexable: boolean }
  neighborhood: { id: number; name: string; slug: string; city_id: number }
  citySlug: string
}) {
  const { data: listingRows } = await supabase
    .from('listings')
    .select('id, title, price_display, price_numeric, neighborhood, type, images, tier, is_featured')
    .eq('city_id', city.id)
    .eq('status', 'active')
    .ilike('neighborhood', neighborhood.name)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(200)

  const listings = (listingRows ?? []) as Listing[]
  const gate = qualityGate({
    listingCount: listings.length,
    photoRatio: photoRatio(listings),
    cityIndexable: city.is_indexable,
  })
  const range = priceRange(listings)

  const intro = listings.length > 0
    ? `${listings.length} creative studio${listings.length === 1 ? '' : 's'} available for monthly rent in ${neighborhood.name}, ${city.name}.${range ? ` Price range: ${range}.` : ''}`
    : `No studios are listed in ${neighborhood.name} yet.`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Studio Space in ${neighborhood.name}, ${city.name}`,
    numberOfItems: listings.length,
    itemListElement: listings.slice(0, 100).map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}/listing/${l.id}`,
    })),
  }

  return (
    <>
      {!gate.indexable && (
        <meta name="robots" content="noindex, follow" />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-5xl">

          {/* Breadcrumb */}
          <nav style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>
            <Link href="/" className="hover:underline" style={{ color: 'var(--ink)' }}>Home</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <Link href={`/${citySlug}`} className="hover:underline" style={{ color: 'var(--ink)' }}>{city.name}</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span>{neighborhood.name}</span>
          </nav>

          {/* Header */}
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1rem' }}>
            Studio Space for Rent in {neighborhood.name}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--stone)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '640px', marginBottom: '2.5rem' }}>
            {intro}
          </p>

          {!gate.indexable && process.env.NODE_ENV !== 'production' && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--action)', marginBottom: '1rem', border: '1px solid var(--action)', padding: '6px 10px', display: 'inline-block' }}>
              NOINDEX — {gate.reason}
            </p>
          )}

          {listings.length === 0 ? (
            <p style={{ color: 'var(--stone)' }} className="text-sm">No listings yet in {neighborhood.name}.</p>
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
                </Link>
              ))}
            </div>
          )}

          {/* Internal link back to city */}
          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--rule)', paddingTop: '2rem' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone)', marginBottom: '0.75rem' }}>
              Explore {city.name}
            </p>
            <Link href={`/${citySlug}`} style={{ color: 'var(--action)', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }} className="hover:underline">
              All studios in {city.name} →
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
