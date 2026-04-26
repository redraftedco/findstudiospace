import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { categoryConfigs } from './config'
import CategoryFilter from '@/components/CategoryFilter'
import { classifyListingToPillar } from '@/lib/pillar-category'

type Props = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ q?: string }>
}

export const revalidate = 3600

export function generateStaticParams() {
  return Object.keys(categoryConfigs).map((category) => ({ category }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const config = categoryConfigs[category]
  if (!config) return {}
  return {
    title: config.title,
    description: config.metaDescription,
    openGraph: {
      title: config.title,
      description: config.metaDescription,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const { q } = await searchParams
  const config = categoryConfigs[category]

  if (!config) {
    return <div className="p-8">Page not found.</div>
  }

  const isPillarCategory = ['event-space', 'content-studios', 'photo-studios', 'makerspace'].includes(category)

  let query = supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .not('title', 'is', null)
    .not('neighborhood', 'ilike', '%Vancouver%')
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
        return classifyListingToPillar(listing) === category
      }
      return matchesCategoryKeywords(listing, config)
    })
    .slice(0, 48)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.findstudiospace.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Portland',
        item: 'https://www.findstudiospace.com/portland',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: config.h1,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <nav style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mb-6 text-xs">
            <Link href="/" className="hover:underline">FindStudioSpace</Link>
            <span className="mx-2">→</span>
            <Link href="/" className="hover:underline">Portland</Link>
            <span className="mx-2">→</span>
            <span style={{ color: 'var(--ink)' }}>{config.h1}</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            {config.h1}
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            {config.intro}
          </p>

          {q && (
            <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mb-6 text-sm">
              {listings.length > 0
                ? `${listings.length} result${listings.length === 1 ? '' : 's'} for "${q}"`
                : `No spaces found for "${q}."`}
              {listings.length === 0 && (
                <> <Link href={`/portland/${category}`} className="underline">Browse all spaces →</Link></>
              )}
            </p>
          )}

          {listings && listings.length > 0 ? (
            <CategoryFilter listings={listings} />
          ) : !q ? (
            <p style={{ color: 'var(--stone)' }} className="mb-14">No spaces listed yet — check back soon.</p>
          ) : null}

          {/* FAQ */}
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

          {/* Related */}
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
