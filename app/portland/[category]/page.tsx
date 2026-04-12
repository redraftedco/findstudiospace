import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { categoryConfigs } from './config'

const supabase = createClient(
  'https://vnjsczhqhnzrplrdkolb.supabase.co',
  'sb_publishable_BNjt2IcsKgSqatPUGKIghg_PJLJpQMF'
)

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

  let query = supabase.from('listings').select('*').limit(24)
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

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:underline">
            Portland Studios
          </Link>
          {' › '}
          <span>{config.h1}</span>
        </nav>

        <h1 className="text-3xl font-bold mb-4">{config.h1}</h1>
        <p className="text-gray-700 mb-8 max-w-2xl">{config.intro}</p>

        {/* Listings */}
        {listings && listings.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {listings.length} space{listings.length !== 1 ? 's' : ''} available
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {listings.map((l) => (
                <div key={l.id} className="border rounded-lg p-4 hover:shadow transition-shadow">
                  <h3 className="font-semibold text-base mb-1">{l.title}</h3>
                  {l.price_display && (
                    <p className="text-sm text-gray-600">{l.price_display}</p>
                  )}
                  {l.neighborhood && (
                    <p className="text-xs text-gray-400 mt-1">{l.neighborhood}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 mb-12">No spaces listed yet — check back soon.</p>
        )}

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
          <dl className="space-y-6">
            {config.faqs.map(({ q, a }) => (
              <div key={q}>
                <dt className="font-semibold text-gray-900 mb-1">{q}</dt>
                <dd className="text-gray-600 text-sm leading-relaxed">{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Related pages */}
        <section className="mt-12 pt-8 border-t">
          <h2 className="text-base font-semibold mb-3 text-gray-700">Related Searches</h2>
          <ul className="flex flex-wrap gap-3">
            {config.related.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm border rounded px-3 py-1.5 hover:bg-gray-50 transition-colors"
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
