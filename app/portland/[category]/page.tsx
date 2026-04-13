import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { categoryConfigs } from './config'

type Props = {
  params: Promise<{ category: string }>
}

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

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const config = categoryConfigs[category]

  if (!config) {
    return <div className="p-8">Page not found.</div>
  }

  let query = supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('is_featured', { ascending: false })
    .limit(24)
  if (config.listingType) {
    query = query.eq('type', config.listingType)
  }
  const { data: listings } = await query

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
          <nav style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mb-6 text-sm">
            <Link href="/" className="hover:underline">Portland Studios</Link>
            {' / '}
            <span>{config.h1}</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="mb-4 text-3xl font-semibold">
            {config.h1}
          </h1>
          <p style={{ color: '#8c8680' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            {config.intro}
          </p>

          {listings && listings.length > 0 ? (
            <>
              <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mb-5 text-xs">
                {listings.length} space{listings.length !== 1 ? 's' : ''} available
              </p>
              <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {listings.map((l) => (
                  <Link
                    key={l.id}
                    href={`/listing/${l.id}`}
                    style={{ border: '1px solid #d6d0c4', background: '#edeae2' }}
                    className="group block p-5 hover:border-[#8c8680] transition-colors"
                  >
                    <div className="mb-2 flex flex-wrap gap-2">
                      {l.is_featured && (
                        <span style={{ background: '#b8860b', color: '#fff', fontFamily: 'var(--font-mono)' }} className="px-2 py-0.5 text-xs tracking-wider">
                          FEATURED
                        </span>
                      )}
                      {l.type && (
                        <span style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="text-xs uppercase">
                          {l.type}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="font-semibold leading-snug">
                      {l.title}
                    </h3>
                    {l.price_display && (
                      <p style={{ fontFamily: 'var(--font-mono)', color: '#1a1814' }} className="mt-2 text-sm font-medium">
                        {l.price_display}
                      </p>
                    )}
                    {l.neighborhood && (
                      <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mt-1 text-xs">
                        {l.neighborhood}
                      </p>
                    )}
                    {l.description && (
                      <p style={{ color: '#8c8680' }} className="mt-3 text-xs leading-relaxed line-clamp-2">
                        {l.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: '#8c8680' }} className="mb-14">No spaces listed yet — check back soon.</p>
          )}

          {/* FAQ */}
          <section style={{ borderTop: '1px solid #d6d0c4' }} className="pt-10">
            <h2 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="mb-6 text-xl font-semibold">
              Frequently Asked Questions
            </h2>
            <dl className="space-y-6">
              {config.faqs.map(({ q, a }) => (
                <div key={q}>
                  <dt style={{ color: '#1a1814' }} className="mb-1 font-medium">{q}</dt>
                  <dd style={{ color: '#8c8680' }} className="text-sm leading-relaxed">{a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Related */}
          <section style={{ borderTop: '1px solid #d6d0c4' }} className="mt-12 pt-8">
            <h2 style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mb-4 text-xs uppercase tracking-wider">
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
