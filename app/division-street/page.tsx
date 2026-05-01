import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Studio Space for Rent on Division Street, Portland | FindStudioSpace',
  description:
    'Find monthly studio and creative workspace for rent on SE Division Street in Portland. Art studios, creative offices, and workshop space in SE Portland\'s most active corridor.',
  alternates: { canonical: 'https://www.findstudiospace.com/division-street' },
  openGraph: {
    title: 'Studio Space for Rent on Division Street, Portland | FindStudioSpace',
    description:
      'Find monthly studio and creative workspace for rent on SE Division Street in Portland.',
  },
}

const FAQS = [
  {
    q: 'What is the SE Division Street corridor in Portland?',
    a: 'SE Division Street is one of Portland\'s most active commercial corridors, running from the Buckman neighborhood near the Central Eastside through Richmond and into the Foster-Powell area. The Division corridor is known for its density of independent restaurants, small retail, and creative businesses — giving studios on or near Division easy access to amenities and pedestrian foot traffic.',
  },
  {
    q: 'How much does studio space cost on SE Division?',
    a: 'Monthly studio rentals in the SE Division corridor typically range from $400–$1,400/month. The neighborhood offers mid-range pricing with more residential character than the Central Eastside and more accessible pricing than the Pearl District or Slabtown.',
  },
  {
    q: 'What types of studios are available on SE Division?',
    a: 'The Division corridor has a mix of art studios, small creative offices, teaching studios, and workshop space in commercial buildings along the corridor and in adjacent residential neighborhoods. It\'s particularly well-suited for visual artists, teaching practitioners, and creative businesses that benefit from the walkable neighborhood character.',
  },
  {
    q: 'Is SE Division transit-accessible?',
    a: 'Yes. SE Division has frequent bus service (the Division bus is one of Portland\'s busiest), and the corridor is highly bikeable with a protected lane on SE Clinton and easy connections to the Central Eastside via the Hawthorne and Morrison Bridges. The neighborhood is walkable and pedestrian-friendly.',
  },
  {
    q: 'How does SE Division compare to the Central Eastside for studio space?',
    a: 'The Central Eastside is Portland\'s primary industrial creative district, with warehouse infrastructure, loading access, and higher ceilings. SE Division is more residential in character — better natural light, walkable neighborhood feel, more foot traffic from non-artists. It\'s a better fit for studios that don\'t need industrial infrastructure and want a neighborhood identity over a production-district one.',
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
    { '@type': 'ListItem', position: 3, name: 'Division Street' },
  ],
}

const placeSchema = {
  '@context': 'https://schema.org',
  '@type': 'Place',
  name: 'SE Division Street, Portland',
  geo: { '@type': 'GeoCoordinates', latitude: 45.5027, longitude: -122.6427 },
  address: { '@type': 'PostalAddress', addressLocality: 'Portland', addressRegion: 'OR', addressCountry: 'US' },
  containedInPlace: { '@type': 'City', name: 'Portland' },
}

export default async function DivisionStreetPage() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .not('title', 'is', null)
    .or('neighborhood.ilike.%Division%,neighborhood.ilike.%SE Portland%,neighborhood.ilike.%Richmond%,neighborhood.ilike.%Hawthorne%')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(48)

  const rows = listings ?? []

  const itemListSchema = rows.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Studio Space for Rent on Division Street, Portland',
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
            <span style={{ color: 'var(--ink)' }}>Division Street</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            Studio Space for Rent on Division Street, Portland
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            SE Division Street is one of Portland&apos;s most walkable and active commercial corridors — home to art studios, teaching studios, and creative offices in SE Portland&apos;s Richmond and Buckman neighborhoods. Browse monthly studio rentals on and near SE Division Street and submit an inquiry from any listing to connect directly with the host.
          </p>

          {rows.length > 0 ? (
            <CategoryFilter listings={rows} />
          ) : (
            <p style={{ color: 'var(--stone)' }} className="mb-14">No studios listed on Division Street yet — check back soon or browse <Link href="/central-eastside" className="underline">Central Eastside studios</Link>.</p>
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
                { label: 'Central Eastside Studios', href: '/central-eastside' },
                { label: 'Alberta Arts District', href: '/alberta-arts-district' },
                { label: 'Art Studio for Rent', href: '/portland/art-studio-rental' },
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
