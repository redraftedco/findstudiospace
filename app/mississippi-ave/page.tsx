import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Studio Space for Rent on Mississippi Ave, Portland | FindStudioSpace',
  description:
    'Monthly studio and creative workspace for rent on N Mississippi Avenue in Portland. Artist studios, offices, and maker spaces in North Portland.',
  alternates: { canonical: 'https://www.findstudiospace.com/mississippi-ave' },
  openGraph: {
    title: 'Studio Space for Rent on Mississippi Ave, Portland | FindStudioSpace',
    description:
      'Find monthly studio and creative workspace for rent on N Mississippi Avenue in Portland.',
  },
}

const FAQS = [
  {
    q: 'What is the Mississippi Ave arts scene in Portland?',
    a: 'N Mississippi Avenue is one of Portland\'s most distinctive neighborhood commercial corridors, a mix of independent restaurants, vintage shops, galleries, and creative studios in North Portland. The area between N Fremont and N Skidmore has historically attracted artists and small creative businesses, with a neighborhood character distinct from both the Pearl District and the Central Eastside.',
  },
  {
    q: 'How much does studio space cost on Mississippi Ave?',
    a: 'Monthly studio rentals in the N Mississippi corridor typically range from $350–$1,200/month, among the more affordable options for studio space in Portland. The neighborhood has lower commercial rents than the Pearl District or NE Alberta, making it accessible for early-career artists and small creative businesses.',
  },
  {
    q: 'What types of studios are available on N Mississippi?',
    a: 'N Mississippi and the surrounding blocks have a mix of small art studios, creative retail, and light production space in older commercial and mixed-use buildings. The corridor is well-suited for visual artists, makers, and small creative practices that value neighborhood identity and foot traffic.',
  },
  {
    q: 'Is N Mississippi Ave transit-accessible?',
    a: 'Yes. N Mississippi is served by multiple bus lines and is bikeable, with the N Williams and N Vancouver bike lanes providing easy connections to the Central Eastside and downtown. The Yellow Line MAX at the Albina/Mississippi station is within walking distance and connects directly to downtown Portland.',
  },
  {
    q: 'How does N Mississippi compare to Alberta Arts for studio space?',
    a: 'Both are North/NE Portland arts corridors with similar pricing and community character. Alberta is larger, denser in artists, and has a more established open-studio culture (Last Thursday). Mississippi is smaller, slightly more affordable in some areas, and has a more mixed commercial character with more foot traffic from non-artist visitors. Good for artists who want neighborhood engagement and visibility.',
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
    { '@type': 'ListItem', position: 3, name: 'Mississippi Ave' },
  ],
}

const placeSchema = {
  '@context': 'https://schema.org',
  '@type': 'Place',
  name: 'Mississippi Avenue, North Portland',
  geo: { '@type': 'GeoCoordinates', latitude: 45.5560, longitude: -122.6788 },
  address: { '@type': 'PostalAddress', addressLocality: 'Portland', addressRegion: 'OR', addressCountry: 'US' },
  containedInPlace: { '@type': 'City', name: 'Portland' },
}

export default async function MississippiAvePage() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .not('title', 'is', null)
    .or('neighborhood.ilike.%Mississippi%,neighborhood.ilike.%N Portland%,neighborhood.ilike.%North Portland%,neighborhood.ilike.%Albina%')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(48)

  const rows = listings ?? []

  const itemListSchema = rows.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Studio Space for Rent on Mississippi Ave, Portland',
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
            <span style={{ color: 'var(--ink)' }}>Mississippi Ave</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            Studio Space for Rent on Mississippi Ave, Portland
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            N Mississippi Avenue is one of Portland&apos;s most distinctive creative corridors, a mix of independent studios, galleries, and maker spaces in North Portland. Browse monthly studio rentals on and around Mississippi Ave, with some of the most affordable creative workspace in the city. Submit an inquiry from any listing to connect directly with the host.
          </p>

          {rows.length > 0 ? (
            <CategoryFilter listings={rows} />
          ) : (
            <p style={{ color: 'var(--stone)' }} className="mb-14">No studios listed on Mississippi Ave yet, check back soon or browse <Link href="/alberta-arts-district" className="underline">Alberta Arts District studios</Link>.</p>
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
                { label: 'Alberta Arts District', href: '/alberta-arts-district' },
                { label: 'Art Studio for Rent', href: '/portland/art-studio-rental' },
                { label: 'Studio Space Rental', href: '/portland/studio-space-rental' },
                { label: 'Central Eastside Studios', href: '/central-eastside' },
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
