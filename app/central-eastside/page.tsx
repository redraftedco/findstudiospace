import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Studio Space for Rent in Portland\'s Central Eastside | FindStudioSpace',
  description:
    'Find monthly studio, workshop, and maker space for rent in Portland\'s Central Eastside Industrial District. High ceilings, loading access, and flex creative space.',
  alternates: { canonical: 'https://www.findstudiospace.com/central-eastside' },
  openGraph: {
    title: 'Studio Space for Rent in Portland\'s Central Eastside | FindStudioSpace',
    description:
      'Find monthly studio, workshop, and maker space for rent in Portland\'s Central Eastside Industrial District. High ceilings, loading access, and flex creative space.',
  },
}

const FAQS = [
  {
    q: 'How much does studio space cost in Portland\'s Central Eastside?',
    a: 'Workshop and studio space in the Central Eastside Industrial District typically ranges from $500–$3,000/month depending on size and amenities. Smaller private studios start around $500/month; larger warehouse or fabrication spaces with loading access and high ceilings run $1,500–$3,000+.',
  },
  {
    q: 'What types of spaces are available in the Central Eastside?',
    a: 'The district is zoned for industrial and commercial use, making it ideal for woodworking shops, ceramics studios, fabrication bays, photography studios, and production offices. Many buildings offer ground-floor drive-in loading access and high ceilings suited for large-format work.',
  },
  {
    q: 'Is the Central Eastside good for artist and maker studios?',
    a: 'Yes — the Central Eastside has been Portland\'s working creative district for decades. It offers a mix of individual studios and shared co-op buildings with communal equipment. The industrial zoning means fewer noise and use restrictions than mixed-residential neighborhoods.',
  },
  {
    q: 'Does the Central Eastside have 24-hour studio access?',
    a: 'Many buildings in the Central Eastside offer 24-hour keycard or fob access — standard in industrial and commercial buildings. Confirm access hours with the host when you inquire, especially if you work irregular hours or late nights.',
  },
  {
    q: 'How do I get to the Central Eastside Industrial District?',
    a: 'The Central Eastside is directly east of the Willamette River, accessible via the Morrison, Burnside, and Hawthorne bridges from downtown Portland. Street parking is generally available. MAX Light Rail (Green/Orange lines) stops nearby at SE Grand and Morrison.',
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
    { '@type': 'ListItem', position: 3, name: 'Central Eastside' },
  ],
}

export default async function CentralEastsidePage() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .not('title', 'is', null)
    .or('neighborhood.ilike.%Central Eastside%,neighborhood.ilike.%CEID%,neighborhood.ilike.%SE Portland%')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(48)

  const rows = listings ?? []

  const itemListSchema = rows.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Studio Space for Rent in Portland\'s Central Eastside',
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
            <span style={{ color: 'var(--ink)' }}>Central Eastside</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            Studio Space for Rent in Portland&apos;s Central Eastside
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            Portland&apos;s Central Eastside Industrial District is the city&apos;s primary hub for creative production, fabrication, and studio work. Bounded by the river and SE Portland neighborhoods, the district is home to working artists, furniture makers, ceramicists, and production studios. Find monthly workshop, art studio, and creative space for rent in one of Portland&apos;s most active corridors.
          </p>

          {rows.length > 0 ? (
            <CategoryFilter listings={rows} />
          ) : (
            <p style={{ color: 'var(--stone)' }} className="mb-14">No studios listed in this neighborhood yet — check back soon.</p>
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
                { label: 'Industrial Space Portland', href: '/industrial-spaces-portland' },
                { label: 'Workshop Space for Rent', href: '/portland/workshop-space-rental' },
                { label: 'Makerspace Portland', href: '/makerspace-portland' },
                { label: 'Alberta Arts District', href: '/alberta-arts-district' },
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
