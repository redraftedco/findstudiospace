import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Studio Space for Rent in St. Johns, Portland | FindStudioSpace',
  description:
    'Find monthly studio and creative workspace for rent in the St. Johns neighborhood of North Portland. Affordable artist studios and maker space near the St. Johns Bridge.',
  alternates: { canonical: 'https://www.findstudiospace.com/st-johns' },
  openGraph: {
    title: 'Studio Space for Rent in St. Johns, Portland | FindStudioSpace',
    description:
      'Find monthly studio and creative workspace for rent in the St. Johns neighborhood of North Portland.',
  },
}

const FAQS = [
  {
    q: 'What is the St. Johns neighborhood in Portland?',
    a: 'St. Johns is a distinct North Portland neighborhood centered on N Lombard Street and the St. Johns Bridge, one of Portland\'s most iconic landmarks. Long a working-class and industrial district, St. Johns has seen significant creative community growth over the past decade. The neighborhood has its own downtown commercial area, industrial waterfront, and a growing population of artists, makers, and small businesses drawn by affordable rents and a strong neighborhood identity.',
  },
  {
    q: 'How much does studio space cost in St. Johns?',
    a: 'Monthly studio and creative workspace in St. Johns is among the most affordable in Portland, typically ranging from $300–$1,000/month. The neighborhood\'s distance from downtown and relative low commercial density keeps rents accessible, it\'s one of the few Portland neighborhoods where sub-$500/month private studio space still appears with some regularity.',
  },
  {
    q: 'What types of studios are available in St. Johns?',
    a: 'St. Johns has a mix of art studios, small maker spaces, and workshop space in commercial buildings along N Lombard and in the industrial areas near the waterfront. The neighborhood\'s industrial-adjacent zoning supports louder and messier work than residential neighborhoods. It\'s a good fit for artists, makers, and small producers who prioritize affordability and industrial infrastructure over urban density.',
  },
  {
    q: 'Is St. Johns accessible from other Portland neighborhoods?',
    a: 'St. Johns is in the far north of Portland, roughly 20–30 minutes from the Central Eastside by bike or 15 minutes by car. Bus service runs on N Lombard and N Fessenden. It\'s less transit-accessible than inner Portland neighborhoods but highly bikeable within the neighborhood itself. The St. Johns Bridge provides a scenic cycling connection to NW Portland.',
  },
  {
    q: 'Why are creatives moving to St. Johns?',
    a: 'Affordability is the primary driver. As rents in the Central Eastside, Alberta, and Mississippi corridors have risen, St. Johns has emerged as one of the few remaining Portland neighborhoods with genuinely affordable creative workspace. The neighborhood also has a strong community identity, a growing food scene, and the kind of industrial-adjacent infrastructure that makes production work viable.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.findstudiospace.com' },
    { '@type': 'ListItem', position: 2, name: 'Portland', item: 'https://www.findstudiospace.com/portland' },
    { '@type': 'ListItem', position: 3, name: 'St. Johns' },
  ],
}

const placeSchema = {
  '@context': 'https://schema.org',
  '@type': 'Place',
  name: 'St. Johns, North Portland',
  geo: { '@type': 'GeoCoordinates', latitude: 45.5949, longitude: -122.7574 },
  address: { '@type': 'PostalAddress', addressLocality: 'Portland', addressRegion: 'OR', addressCountry: 'US' },
  containedInPlace: { '@type': 'City', name: 'Portland' },
}

export default async function StJohnsPage() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .not('title', 'is', null)
    .or('neighborhood.ilike.%St. Johns%,neighborhood.ilike.%St Johns%,neighborhood.ilike.%Saint Johns%,neighborhood.ilike.%N Portland%,neighborhood.ilike.%North Portland%')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(48)

  const rows = listings ?? []

  const itemListSchema = rows.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Studio Space for Rent in St. Johns, Portland',
        numberOfItems: rows.length,
        itemListElement: rows.slice(0, 100).map((l, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://www.findstudiospace.com/listing/${l.id}`,
        })),
      }
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}

      <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <nav style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mb-6 text-xs">
            <Link href="/" className="hover:underline">FindStudioSpace</Link>
            <span className="mx-2">→</span>
            <Link href="/portland" className="hover:underline">Portland</Link>
            <span className="mx-2">→</span>
            <span style={{ color: 'var(--ink)' }}>St. Johns</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            Studio Space for Rent in St. Johns, Portland
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            St. Johns is North Portland&apos;s most distinct neighborhood, an industrial-adjacent community near the St. Johns Bridge with a strong neighborhood identity and some of Portland&apos;s most affordable creative workspace. A growing number of artists, makers, and small producers have made St. Johns their base as rents in inner Portland have risen. Browse monthly studio rentals in St. Johns and submit an inquiry to connect directly with the host.
          </p>

          {rows.length > 0 ? (
            <CategoryFilter listings={rows} />
          ) : (
            <p style={{ color: 'var(--stone)' }} className="mb-14">No studios listed in St. Johns yet, check back soon or browse <Link href="/mississippi-ave" className="underline">Mississippi Ave studios</Link> or <Link href="/alberta-arts-district" className="underline">Alberta Arts District studios</Link>.</p>
          )}

          <section style={{ borderTop: '1px solid var(--rule)' }} className="pt-10">
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-6 text-xl font-semibold">
              Frequently Asked Questions
            </h2>
            <dl className="space-y-6">
              {FAQS.map(({ q, a }) => (
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
              {[
                { label: 'Mississippi Ave Studios', href: '/mississippi-ave' },
                { label: 'Alberta Arts District', href: '/alberta-arts-district' },
                { label: 'Industrial Space Portland', href: '/industrial-spaces-portland' },
                { label: 'Studio Space Rental', href: '/portland/studio-space-rental' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} style={{ border: '1px solid var(--rule)', color: 'var(--ink)', fontFamily: 'var(--font-mono)' }} className="inline-block px-3 py-1.5 text-xs hover:bg-[var(--surface)] transition-colors">
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
