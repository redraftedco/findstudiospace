import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { categoryConfigs } from './config'
import CategoryFilter from '@/components/CategoryFilter'
import { directoryConfig } from '@/lib/directory'

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
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const { q } = await searchParams
  const config = categoryConfigs[category]

  if (!config) {
    return <div className="p-8">Page not found.</div>
  }

  let query = supabase
    .from('listings')
    .select('*')
    .eq('directory_id', directoryConfig.id)
    .eq('status', 'active')
    .not('title', 'is', null)
    .not('neighborhood', 'ilike', '%Vancouver%')
    .limit(48)
  if (config.listingType) {
    query = query.eq('type', config.listingType)
  }
  if (config.neighborhood) {
    query = query.ilike('neighborhood', `%${config.neighborhood}%`)
  }
  if (q) {
    query = query.or(`title.ilike.%${q}%,neighborhood.ilike.%${q}%,description.ilike.%${q}%`)
  }
  const { data: rawListings } = await query
  const listings = (rawListings ?? []).sort((a, b) => {
    const aScore = (a.description && a.price_display ? 3 : 0) + (a.price_display && !a.description ? 1 : 0) + (a.description && !a.price_display ? 2 : 0)
    const bScore = (b.description && b.price_display ? 3 : 0) + (b.price_display && !b.description ? 1 : 0) + (b.description && !b.price_display ? 2 : 0)
    return bScore - aScore
  })
  const total = listings.length

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main style={{ background: '#f4f1eb', color: '#1a1814' }} className="min-h-screen">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <nav style={{ color: '#6b6762', fontFamily: 'var(--font-mono)' }} className="mb-6 text-xs">
            <Link href="/" className="hover:underline">FindStudioSpace</Link>
            <span className="mx-2">→</span>
            <Link href="/" className="hover:underline">Portland</Link>
            <span className="mx-2">→</span>
            <span style={{ color: '#1a1814' }}>{config.h1}</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="mb-4 text-3xl font-semibold">
            {config.h1}
          </h1>
          <p style={{ color: '#6b6762' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            {config.intro}
          </p>

          {q && (
            <p style={{ color: '#6b6762', fontFamily: 'var(--font-mono)' }} className="mb-6 text-sm">
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
            <p style={{ color: '#6b6762' }} className="mb-14">No spaces listed yet — check back soon.</p>
          ) : null}

          {/* FAQ */}
          <section style={{ borderTop: '1px solid #d6d0c4' }} className="pt-10">
            <h2 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="mb-6 text-xl font-semibold">
              Frequently Asked Questions
            </h2>
            <dl className="space-y-6">
              {config.faqs.map(({ q, a }) => (
                <div key={q}>
                  <dt style={{ color: '#1a1814' }} className="mb-1 font-medium">{q}</dt>
                  <dd style={{ color: '#6b6762' }} className="text-sm leading-relaxed">{a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Related */}
          <section style={{ borderTop: '1px solid #d6d0c4' }} className="mt-12 pt-8">
            <h2 style={{ color: '#6b6762', fontFamily: 'var(--font-mono)' }} className="mb-4 text-xs uppercase tracking-wider">
              Related Searches
            </h2>
            <ul className="flex flex-wrap gap-3">
              {config.related.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ border: '1px solid #d6d0c4', color: '#1a1814', fontFamily: 'var(--font-mono)' }}
                    className="inline-block px-3 py-1.5 text-xs hover:bg-[#edeae2] transition-colors"
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
