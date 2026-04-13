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

  let query = supabase.from('listings').select('*').eq('status', 'active').order('is_featured', { ascending: false }).limit(24)
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

      <main className="mx-auto max-w-4xl px-6 py-10">
        <nav className="mb-6 text-sm text-gray-700">
          <Link href="/" className="hover:underline">
            Portland Studios
          </Link>
          {' › '}
          <span>{config.h1}</span>
        </nav>

        <h1 className="mb-4 text-3xl font-bold">{config.h1}</h1>
        <p className="mb-8 max-w-2xl text-gray-700">{config.intro}</p>

        {/* Listings */}
        {listings && listings.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-gray-700">
              {listings.length} space{listings.length !== 1 ? 's' : ''} available
            </p>
            <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {listings.map((l) => (
                <Link
                  key={l.id}
                  href={`/listing/${l.id}`}
                  className="group rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  {l.is_featured && (
                    <span className="mb-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                      Featured
                    </span>
                  )}
                  <h3 className="font-semibold leading-snug group-hover:text-blue-600">
                    {l.title}
                  </h3>
                  {l.price_display && (
                    <p className="mt-1 text-sm font-medium text-blue-700">{l.price_display}</p>
                  )}
                  {l.neighborhood && (
                    <p className="mt-1 text-xs text-gray-700">📍 {l.neighborhood}</p>
                  )}
                  {l.description && (
                    <p className="mt-2 text-xs leading-relaxed text-gray-700 line-clamp-2">
                      {l.description}
                    </p>
                  )}
                  <p className="mt-3 text-xs font-medium text-blue-600 group-hover:underline">
                    View space →
                  </p>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <p className="mb-12 text-gray-700">No spaces listed yet — check back soon.</p>
        )}

        {/* FAQ */}
        <section>
          <h2 className="mb-6 text-xl font-bold">Frequently Asked Questions</h2>
          <dl className="space-y-6">
            {config.faqs.map(({ q, a }) => (
              <div key={q}>
                <dt className="mb-1 font-semibold text-gray-900">{q}</dt>
                <dd className="text-sm leading-relaxed text-gray-800">{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Related pages */}
        <section className="mt-12 border-t pt-8">
          <h2 className="mb-3 text-base font-semibold text-gray-700">Related Searches</h2>
          <ul className="flex flex-wrap gap-3">
            {config.related.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded border px-3 py-1.5 text-sm transition-colors hover:bg-gray-50"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}
