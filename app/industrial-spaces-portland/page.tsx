import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Industrial Space for Rent in Portland, OR | Warehouse & Flex Space',
  description:
    'Find industrial space, warehouse space, and flex units for rent in Portland, OR. High ceilings, loading access, drive-in bays, and 220v power. Monthly terms available.',
  alternates: { canonical: 'https://www.findstudiospace.com/industrial-spaces-portland' },
  openGraph: {
    title: 'Industrial Space for Rent in Portland, OR | Warehouse & Flex Space',
    description:
      'Find industrial space, warehouse space, and flex units for rent in Portland, OR. High ceilings, loading access, drive-in bays, and 220v power. Monthly terms available.',
  },
}

const FAQS = [
  {
    q: 'How much does industrial space cost to rent in Portland per month?',
    a: 'Industrial and warehouse space in Portland typically ranges from $500–$3,000/month depending on square footage, ceiling height, power infrastructure, and location. Flex units in the Central Eastside Industrial District start around $500–$800 for smaller spaces; larger bays with loading docks and 220v power run $1,500–$3,000+/month.',
  },
  {
    q: 'What is the difference between industrial space and a workshop rental in Portland?',
    a: 'Workshop rentals are typically smaller private rooms within a shared building, suited for a single maker or small crew. Industrial or warehouse space refers to larger standalone or semi-private bays, often with drive-in access, higher ceilings, and infrastructure for heavier production. The lines blur in Portland, where many Central Eastside buildings offer both.',
  },
  {
    q: 'Are there industrial spaces in Portland with loading dock or drive-in access?',
    a: 'Yes. Several warehouse and flex buildings in the Central Eastside Industrial District offer ground-floor drive-in access or grade-level loading, important if you regularly move large materials, equipment, or finished goods. Confirm loading access with the host before viewing if this is a requirement.',
  },
  {
    q: 'Can I run a manufacturing or production business from rented industrial space in Portland?',
    a: 'Most industrial and warehouse space in Portland\'s Central Eastside is zoned for light industrial and commercial production use. Confirm permitted uses with the host, some buildings allow light manufacturing, others restrict certain equipment, noise levels, or chemical storage. Get zoning confirmation in writing before signing.',
  },
  {
    q: 'What neighborhoods in Portland have industrial space for rent?',
    a: 'The Central Eastside Industrial District is Portland\'s primary hub for industrial, warehouse, and flex production space. Adjacent areas in SE and NE Portland also have industrial-zoned buildings with flex space available. Slabtown (NW Portland) has some converted industrial buildings as well, though supply is more limited.',
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
    { '@type': 'ListItem', position: 2, name: 'Industrial Spaces Portland' },
  ],
}

export default async function IndustrialSpacesPortlandPage() {
  const { data: industrialListings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .not('title', 'is', null)
    .not('neighborhood', 'ilike', '%Vancouver%')
    .or(
      'type.eq.workshop,' +
      'title.ilike.%industrial%,description.ilike.%industrial%,' +
      'title.ilike.%warehouse%,description.ilike.%warehouse%,' +
      'title.ilike.%flex space%,description.ilike.%flex space%,' +
      'title.ilike.%loading dock%,description.ilike.%loading dock%,' +
      'title.ilike.%drive-in%,description.ilike.%drive-in%,' +
      'title.ilike.%fabrication%,description.ilike.%fabrication%'
    )
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(48)

  const listings = industrialListings ?? []

  const itemListSchema = listings.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Industrial Space for Rent in Portland, OR',
        numberOfItems: listings.length,
        itemListElement: listings.slice(0, 100).map((l, i) => ({
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
            <span style={{ color: 'var(--ink)' }}>Industrial Space</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            Industrial Space for Rent in Portland, OR
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            Browse industrial, warehouse, and flex production space available for monthly rent in Portland, OR. High ceilings, drive-in loading access, 220v power, and Central Eastside locations, find the right space for fabrication, production, storage, or light manufacturing. Submit an inquiry from any listing to connect directly with the host.
          </p>

          {listings.length > 0 ? (
            <CategoryFilter listings={listings} />
          ) : (
            <p style={{ color: 'var(--stone)' }} className="mb-14">No industrial spaces listed yet, check back soon.</p>
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
                { label: 'Workshop Space for Rent', href: '/portland/workshop-space-rental' },
                { label: 'Central Eastside Studios', href: '/central-eastside' },
                { label: 'Makerspace Portland', href: '/makerspace-portland' },
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
