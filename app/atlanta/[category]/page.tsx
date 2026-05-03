import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { supabaseServer } from '@/lib/supabase-server'
import { categoryConfigs } from './config'
import CategoryFilter from '@/components/CategoryFilter'
import ListingCard from '@/components/ListingCard'
import { classifyListingToPillar } from '@/lib/pillar-category'

type Props = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ q?: string; amenity?: string }>
}

export const revalidate = 3600

const MIN_PILLAR_LISTINGS_FOR_INDEX = 0
const MIN_AMENITY_FILTER_LISTINGS_FOR_INDEX = 3
const PILLAR_SLUGS = new Set(['event-space', 'content-studios', 'photo-studios', 'makerspace'])

type AmenityKey = 'cyc_wall' | 'natural_light' | 'green_screen' | 'product_photography'
type AmenityMeta = {
  key: AmenityKey
  label: string
  h1: string
  title: string
  description: string
}
const AMENITY_FILTERS: Record<string, AmenityMeta[]> = {
  'photo-studios': [
    {
      key: 'cyc_wall',
      label: 'Cyc Wall',
      h1: 'Cyclorama Wall Photography Studios in Atlanta',
      title: 'Cyc Wall Photography Studios in Atlanta, GA | FindStudioSpace',
      description:
        'Find Atlanta photography studios with cyclorama walls — seamless white backgrounds for product, fashion, and editorial shoots. Browse cyc wall studio rentals.',
    },
    {
      key: 'natural_light',
      label: 'Natural Light',
      h1: 'Natural Light Photography Studios in Atlanta',
      title: 'Natural Light Studios for Rent in Atlanta, GA | FindStudioSpace',
      description:
        'Atlanta photography studios with skylights, north-facing windows, and floor-to-ceiling glass. Natural light studio rentals for portrait, editorial, and lifestyle work.',
    },
    {
      key: 'green_screen',
      label: 'Green Screen',
      h1: 'Green Screen Studios in Atlanta',
      title: 'Green Screen Studios for Rent in Atlanta, GA | FindStudioSpace',
      description:
        'Find Atlanta studios with green screen / chroma-key setups for video production, virtual backgrounds, and composite photography.',
    },
    {
      key: 'product_photography',
      label: 'Product Photography',
      h1: 'Product Photography Studios in Atlanta',
      title: 'Product Photography Studio Rental in Atlanta, GA | FindStudioSpace',
      description:
        'Tabletop and product photography studios in Atlanta — sweep tables, controlled lighting, and tethering setups for e-commerce and editorial product work.',
    },
  ],
}

function getAmenityMeta(category: string, amenity: string | undefined): AmenityMeta | null {
  if (!amenity) return null
  const list = AMENITY_FILTERS[category]
  if (!list) return null
  return list.find((a) => a.key === amenity) ?? null
}

export function generateStaticParams() {
  return Object.keys(categoryConfigs).map((category) => ({ category }))
}

async function countPillarListings(category: string): Promise<number> {
  if (!PILLAR_SLUGS.has(category)) return Number.POSITIVE_INFINITY
  const { data } = await supabase
    .from('listings')
    .select('id, title, description, type')
    .eq('status', 'active')
    .eq('city', 'Atlanta')
    .not('title', 'is', null)
    .limit(400)
  return (data ?? []).filter((l) => classifyListingToPillar(l) === category).length
}

async function countAmenityListings(category: string, amenityKey: string): Promise<number> {
  const { data } = await supabase
    .from('listings')
    .select('id, title, description, type, niche_attributes')
    .eq('status', 'active')
    .eq('city', 'Atlanta')
    .not('title', 'is', null)
    .filter('niche_attributes->>' + amenityKey, 'eq', 'true')
    .limit(400)
  if (!PILLAR_SLUGS.has(category)) return (data ?? []).length
  return (data ?? []).filter((l) => classifyListingToPillar(l) === category).length
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { category } = await params
  const { amenity } = await searchParams
  const config = categoryConfigs[category]
  if (!config) return {}
  const amenityMeta = getAmenityMeta(category, amenity)
  const baseUrl = `https://www.findstudiospace.com/atlanta/${category}`
  if (amenityMeta) {
    const count = await countAmenityListings(category, amenityMeta.key)
    return {
      title: amenityMeta.title,
      description: amenityMeta.description,
      alternates: { canonical: `${baseUrl}?amenity=${amenityMeta.key}` },
      robots: { index: count >= MIN_AMENITY_FILTER_LISTINGS_FOR_INDEX, follow: true },
      openGraph: {
        title: amenityMeta.title,
        description: amenityMeta.description,
      },
    }
  }
  const isPillar = PILLAR_SLUGS.has(category)
  const indexable = isPillar
    ? (await countPillarListings(category)) >= MIN_PILLAR_LISTINGS_FOR_INDEX
    : true
  return {
    title: config.title,
    description: config.metaDescription,
    alternates: { canonical: baseUrl },
    robots: { index: indexable, follow: true },
    openGraph: {
      title: config.title,
      description: config.metaDescription,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const { q, amenity } = await searchParams
  const config = categoryConfigs[category]

  if (!config) {
    return <div className="p-8">Page not found.</div>
  }

  const isPillarCategory = PILLAR_SLUGS.has(category)
  const amenityMeta = getAmenityMeta(category, amenity)
  const availableAmenities = AMENITY_FILTERS[category] ?? []

  let query = supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .eq('city', 'Atlanta')
    .not('title', 'is', null)
    .limit(config.keywordInclude?.length ? 400 : 48)
  if (config.listingType) {
    query = query.eq('type', config.listingType)
  }
  if (config.neighborhood) {
    query = query.ilike('neighborhood', `%${config.neighborhood}%`)
  }
  if (q) {
    query = query.or(`title.ilike.%${q}%,neighborhood.ilike.%${q}%,description.ilike.%${q}%`)
  }
  query = query
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
  const { data: rawListings } = await query
  const listings = (rawListings ?? [])
    .filter((listing) => {
      if (isPillarCategory) {
        if (classifyListingToPillar(listing) !== category) return false
      } else if (!matchesCategoryKeywords(listing, config)) {
        return false
      }
      if (amenityMeta) {
        const attrs = (listing as { niche_attributes?: Record<string, unknown> | null }).niche_attributes
        if (!attrs || attrs[amenityMeta.key] !== true) return false
      }
      return true
    })
    .slice(0, 48)

  const { data: placements } = await supabaseServer
    .from('visibility_placements')
    .select('listing_id')
    .eq('target_type', 'category')
    .eq('target_slug', category)
    .eq('status', 'active')
    .limit(3)

  const sponsoredIds = (placements ?? []).map((p) => p.listing_id as number)
  let sponsoredListings: { id: number; title: string | null; price_display: string | null; neighborhood: string | null; type: string | null; images: unknown; tier: string | null }[] = []
  if (sponsoredIds.length > 0) {
    const { data: sl } = await supabaseServer
      .from('listings')
      .select('id, title, price_display, neighborhood, type, images, tier')
      .in('id', sponsoredIds)
      .eq('status', 'active')
    sponsoredListings = sl ?? []
  }

  const pageH1 = amenityMeta?.h1 ?? config.h1
  const pageIntro = amenityMeta?.description ?? config.intro

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  const itemListCap = 100
  const itemListRows = listings.slice(0, itemListCap)
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: amenityMeta ? `${config.h1} · ${amenityMeta.label}` : config.h1,
    numberOfItems: itemListRows.length,
    itemListElement: itemListRows.map((listing, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.findstudiospace.com/listing/${listing.id}`,
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.findstudiospace.com' },
      { '@type': 'ListItem', position: 2, name: 'Atlanta', item: 'https://www.findstudiospace.com/atlanta' },
      amenityMeta
        ? { '@type': 'ListItem', position: 3, name: config.h1, item: `https://www.findstudiospace.com/atlanta/${category}` }
        : { '@type': 'ListItem', position: 3, name: config.h1 },
      ...(amenityMeta ? [{ '@type': 'ListItem', position: 4, name: amenityMeta.label }] : []),
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListRows.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}

      <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <nav style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mb-6 text-xs">
            <Link href="/" className="hover:underline">FindStudioSpace</Link>
            <span className="mx-2">→</span>
            <Link href="/atlanta" className="hover:underline">Atlanta</Link>
            <span className="mx-2">→</span>
            {amenityMeta ? (
              <>
                <Link href={`/atlanta/${category}`} className="hover:underline">{config.h1}</Link>
                <span className="mx-2">→</span>
                <span style={{ color: 'var(--ink)' }}>{amenityMeta.label}</span>
              </>
            ) : (
              <span style={{ color: 'var(--ink)' }}>{config.h1}</span>
            )}
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            {pageH1}
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-8 max-w-2xl text-sm leading-relaxed">
            {pageIntro}
          </p>

          {availableAmenities.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2">
              <Link
                href={`/atlanta/${category}`}
                style={{
                  border: amenityMeta ? '1px solid var(--rule)' : '1px solid var(--lime)',
                  color: amenityMeta ? 'var(--stone)' : 'var(--lime)',
                  fontFamily: 'var(--font-mono)',
                }}
                className="inline-block px-3 py-1.5 text-xs hover:bg-[var(--surface)] transition-colors"
              >
                All {config.h1.toLowerCase().includes('photo') ? 'photo studios' : 'listings'}
              </Link>
              {availableAmenities.map((a) => {
                const isActive = amenityMeta?.key === a.key
                return (
                  <Link
                    key={a.key}
                    href={`/atlanta/${category}?amenity=${a.key}`}
                    style={{
                      border: isActive ? '1px solid var(--lime)' : '1px solid var(--rule)',
                      color: isActive ? 'var(--lime)' : 'var(--stone)',
                      fontFamily: 'var(--font-mono)',
                    }}
                    className="inline-block px-3 py-1.5 text-xs hover:bg-[var(--surface)] transition-colors"
                  >
                    {a.label}
                  </Link>
                )
              })}
            </div>
          )}

          {q && (
            <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mb-6 text-sm">
              {listings.length > 0
                ? `${listings.length} result${listings.length === 1 ? '' : 's'} for "${q}"`
                : `No spaces found for "${q}."`}
              {listings.length === 0 && (
                <> <Link href={`/atlanta/${category}`} className="underline">Browse all spaces →</Link></>
              )}
            </p>
          )}

          {sponsoredListings.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--stone)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '12px',
              }}>
                Sponsored
              </p>
              <div className="listing-grid">
                {sponsoredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} sponsored />
                ))}
              </div>
            </div>
          )}

          {listings && listings.length > 0 ? (
            <CategoryFilter listings={listings} />
          ) : amenityMeta ? (
            <p style={{ color: 'var(--stone)' }} className="mb-14 text-sm">
              No {amenityMeta.label.toLowerCase()} studios listed yet.{' '}
              <Link href={`/atlanta/${category}`} className="underline">Browse all {pageH1.toLowerCase().includes('photo') ? 'photo studios' : 'listings'} →</Link>
            </p>
          ) : !q ? (
            <p style={{ color: 'var(--stone)' }} className="mb-14">No spaces listed yet — check back soon.</p>
          ) : null}

          <section style={{ borderTop: '1px solid var(--rule)' }} className="pt-10">
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-6 text-xl font-semibold">
              Frequently Asked Questions
            </h2>
            <dl className="space-y-6">
              {config.faqs.map(({ q, a }) => (
                <div key={q}>
                  <dt style={{ color: 'var(--ink)' }} className="mb-1 font-medium">{q}</dt>
                  <dd style={{ color: 'var(--stone)' }} className="text-sm leading-relaxed">{a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section style={{ borderTop: '1px solid var(--rule)' }} className="mt-12 pt-8">
            <h2 style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mb-4 text-xs uppercase tracking-wider">
              Related Searches
            </h2>
            <ul className="flex flex-wrap gap-3">
              {config.related.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ border: '1px solid var(--rule)', color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}
                    className="inline-block px-3 py-1.5 text-xs hover:bg-[var(--surface)] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  )
}

function matchesCategoryKeywords(
  listing: { title: string | null; description: string | null; type: string | null },
  config: { keywordInclude?: string[]; keywordExclude?: string[] }
): boolean {
  const includes = config.keywordInclude
  if (!includes || includes.length === 0) return true

  const haystack = `${listing.title ?? ''} ${listing.description ?? ''} ${listing.type ?? ''}`.toLowerCase()
  const hasInclude = includes.some((term) => haystack.includes(term))
  if (!hasInclude) return false

  const excludes = config.keywordExclude ?? []
  return !excludes.some((term) => haystack.includes(term))
}
