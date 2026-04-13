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
    .not('title', 'is', null)
    .not('neighborhood', 'ilike', '%Vancouver%')
    .limit(48)
  if (config.listingType) {
    query = query.eq('type', config.listingType)
  }
  const { data: rawListings } = await query
  const listings = (rawListings ?? []).sort((a, b) => {
    const aHas = a.description ? 1 : 0
    const bHas = b.description ? 1 : 0
    return bHas - aHas
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
                {total} space{total !== 1 ? 's' : ''} available
              </p>
              <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((l) => {
                  const images: string[] = Array.isArray(l.images)
                    ? l.images.map((x: unknown) => (typeof x === 'string' ? x : (x as Record<string, string>)?.url ?? '')).filter(Boolean)
                    : []
                  const thumb = images[0]
                  return (
                    <Link
                      key={l.id}
                      href={`/listing/${l.id}`}
                      style={{ border: '1px solid #d6d0c4', background: '#edeae2' }}
                      className="group block hover:border-[#8c8680] transition-colors"
                    >
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt="" className="w-full object-cover" style={{ height: '160px' }} />
                      ) : (
                        <div style={{ background: '#d6d0c4', height: '160px' }} />
                      )}
                      <div className="p-4">
                        {l.type && (
                          <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mb-1 text-xs uppercase">
                            {l.type}
                          </p>
                        )}
                        <h3 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="font-semibold leading-snug">
                          {l.title}
                        </h3>
                        <div style={{ fontFamily: 'var(--font-mono)', color: '#8c8680' }} className="mt-2 text-xs">
                          {l.price_display && <span>{l.price_display}</span>}
                          {l.price_display && l.neighborhood && <span> · </span>}
                          {l.neighborhood && <span>{l.neighborhood}</span>}
                        </div>
                      </div>
                    </Link>
                  )
                })}
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
