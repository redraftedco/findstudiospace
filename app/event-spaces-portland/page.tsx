import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Event Spaces for Rent in Portland, OR | Private Venues & Pop-Up Spaces',
  description:
    'Find private event spaces for rent in Portland, OR. Browse venues for parties, pop-ups, brand activations, and community events. Monthly terms, contact hosts directly.',
  alternates: { canonical: 'https://www.findstudiospace.com/event-spaces-portland' },
  openGraph: {
    title: 'Event Spaces for Rent in Portland, OR | Private Venues & Pop-Up Spaces',
    description:
      'Find private event spaces for rent in Portland, OR. Browse venues for parties, pop-ups, brand activations, and community events. Monthly terms, contact hosts directly.',
  },
}

const FAQS = [
  {
    q: 'What types of event spaces are available for rent in Portland?',
    a: 'Portland has private event venues, loft-style spaces, gallery rooms, warehouse flex spaces with open floor plans, and rooftop venues. Most are available for recurring monthly use, well suited for brands, collectives, and organizers who host events on a regular schedule.',
  },
  {
    q: 'How much does event space rental cost in Portland per month?',
    a: 'Monthly event space rentals in Portland range from $500–$3,500/month depending on size, included infrastructure, and neighborhood. Raw flex spaces in the Central Eastside start lower; purpose-built venues with built-in AV, furniture, and kitchen access run higher. Most hosts are open to negotiating terms for longer commitments.',
  },
  {
    q: 'Can I use a rented Portland event space for a pop-up shop or brand activation?',
    a: 'Yes. Many monthly rental spaces in Portland permit commercial events, pop-ups, and brand activations under standard terms. Confirm with the host that public foot traffic and commercial use are allowed, some buildings have restrictions on signage, hours, or occupancy. Ask in your inquiry before committing.',
  },
  {
    q: 'What neighborhoods in Portland have private event spaces for rent?',
    a: 'Private event venues and flex spaces are concentrated in the Pearl District, Central Eastside Industrial District, Slabtown, and NE Portland. SE Portland and the Alberta Arts area also have creative flex spaces well suited for community events and pop-ups. Central Eastside in particular has strong inventory of warehouse-style venues with high ceilings and open floor plans.',
  },
  {
    q: 'What is the difference between hourly venue rental and a monthly event space rental in Portland?',
    a: 'Hourly venues charge per session, useful for one-off events but expensive for recurring use. A monthly rental gives you flexible access throughout the month, including setup and breakdown time, without competing for booking slots. If you host monthly pop-ups, recurring community events, or need on-site storage between uses, a monthly term is almost always more cost-effective.',
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
    { '@type': 'ListItem', position: 2, name: 'Event Spaces Portland' },
  ],
}

export default async function EventSpacesPortlandPage() {
  const { data: eventListings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .not('title', 'is', null)
    .not('neighborhood', 'ilike', '%Vancouver%')
    .or(
      'title.ilike.%event space%,description.ilike.%event space%,' +
      'title.ilike.%event venue%,description.ilike.%event venue%,' +
      'title.ilike.%private event%,description.ilike.%private event%,' +
      'title.ilike.%venue rental%,description.ilike.%venue rental%,' +
      'title.ilike.%pop-up%,description.ilike.%pop-up%,' +
      'title.ilike.%popup%,description.ilike.%popup%'
    )
    .limit(48)

  const { data: fallbackListings } = (!eventListings || eventListings.length < 4)
    ? await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .not('title', 'is', null)
        .not('neighborhood', 'ilike', '%Vancouver%')
        .in('type', ['retail', 'office'])
        .limit(24)
    : { data: null }

  const listings =
    eventListings && eventListings.length >= 4
      ? eventListings
      : [...(eventListings ?? []), ...(fallbackListings ?? [])]

  const itemListSchema = listings.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Event Spaces for Rent in Portland, OR',
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
            <span style={{ color: 'var(--ink)' }}>Event Spaces</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            Event Spaces for Rent in Portland, OR
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            Browse private event spaces and venues available for monthly rent in Portland, OR. From raw warehouse lofts in the Central Eastside to gallery-style spaces in the Pearl District, find a venue for recurring pop-ups, private parties, brand activations, and community events. Submit an inquiry from any listing to contact the host directly.
          </p>

          {listings.length > 0 ? (
            <CategoryFilter listings={listings} />
          ) : (
            <p style={{ color: 'var(--stone)' }} className="mb-14">No event spaces listed yet, check back soon.</p>
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
                { label: 'Portland Event Space', href: '/portland/event-space' },
                { label: 'Retail Space for Rent', href: '/portland/retail-space-for-rent' },
                { label: 'Photo Studios Portland', href: '/photography-studios-portland' },
                { label: 'Podcast Studios', href: '/podcast-studios' },
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
