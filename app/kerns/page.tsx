import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Studio Space for Rent in Kerns, Portland | FindStudioSpace',
  description:
    'Find monthly studio and creative workspace for rent in the Kerns neighborhood of NE Portland. Artist studios, creative offices, and workshop space between the Pearl District and Alberta Arts.',
  alternates: { canonical: 'https://www.findstudiospace.com/kerns' },
  openGraph: {
    title: 'Studio Space for Rent in Kerns, Portland | FindStudioSpace',
    description:
      'Find monthly studio and creative workspace for rent in the Kerns neighborhood of NE Portland.',
  },
}

const FAQS = [
  {
    q: 'Where is the Kerns neighborhood in Portland?',
    a: 'Kerns is an NE Portland neighborhood roughly bounded by NE Burnside to the south, NE Halsey to the north, NE 12th to the west, and NE 33rd to the east. It sits between the Central Eastside Industrial District and the Alberta Arts corridor, giving it easy access to both Portland\'s working creative district and its most established arts community.',
  },
  {
    q: 'How much does studio space cost in Kerns?',
    a: 'Monthly studio and creative workspace in Kerns typically ranges from $400–$1,500/month depending on size and amenities. The neighborhood offers mid-range pricing between the higher rents of the Pearl District and Slabtown and the more affordable options on NE Alberta.',
  },
  {
    q: 'What types of creative workspace are available in Kerns?',
    a: 'Kerns has a mix of art studios, small creative offices, and workshop space in converted commercial and light-industrial buildings along the NE Broadway and NE Sandy corridors. The neighborhood is particularly well-suited for visual artists, photographers, and small creative agencies.',
  },
  {
    q: 'Is Kerns convenient for transit and biking?',
    a: 'Yes. Kerns is served by multiple bus lines on NE Burnside, NE Broadway, and NE Sandy. It\'s highly bikeable, with easy connections to the Central Eastside via the Burnside Bridge corridor and to NE Alberta via the neighborhood bike network. MAX Yellow and Green lines are accessible from nearby stations.',
  },
  {
    q: 'How is Kerns different from the Central Eastside for studio space?',
    a: 'The Central Eastside is Portland\'s primary industrial creative district with warehouse bays, loading access, and heavy infrastructure. Kerns is more mixed-use — lighter commercial, better natural light, and a more residential neighborhood character. It\'s a better fit for studios that don\'t need industrial infrastructure but want proximity to both the CEID and Alberta Arts.',
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
    { '@type': 'ListItem', position: 3, name: 'Kerns' },
  ],
}

const placeSchema = {
  '@context': 'https://schema.org',
  '@type': 'Place',
  name: 'Kerns, Portland',
  geo: { '@type': 'GeoCoordinates', latitude: 45.5236, longitude: -122.6490 },
  address: { '@type': 'PostalAddress', addressLocality: 'Portland', addressRegion: 'OR', addressCountry: 'US' },
  containedInPlace: { '@type': 'City', name: 'Portland' },
}

export default async function KernsPage() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .not('title', 'is', null)
    .or('neighborhood.ilike.%Kerns%,neighborhood.ilike.%NE Portland%,neighborhood.ilike.%Northeast%')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(48)

  const rows = listings ?? []

  const itemListSchema = rows.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Studio Space for Rent in Kerns, Portland',
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
            <span style={{ color: 'var(--ink)' }}>Kerns</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            Studio Space for Rent in Kerns, Portland
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            The Kerns neighborhood occupies the creative middle ground between Portland&apos;s Central Eastside and the Alberta Arts District — accessible to both, with a mixed-use character and a range of art studios, small creative offices, and workshop space in converted commercial buildings along the NE Broadway and NE Sandy corridors. Browse monthly studio rentals in Kerns and NE Portland and submit an inquiry to connect directly with the host.
          </p>

          {rows.length > 0 ? (
            <CategoryFilter listings={rows} />
          ) : (
            <p style={{ color: 'var(--stone)' }} className="mb-14">No studios listed in Kerns yet — check back soon or browse <Link href="/alberta-arts-district" className="underline">Alberta Arts District studios</Link> or <Link href="/central-eastside" className="underline">Central Eastside studios</Link>.</p>
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
                { label: 'Central Eastside Studios', href: '/central-eastside' },
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
