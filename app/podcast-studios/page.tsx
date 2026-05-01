import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Podcast Studios for Rent | Monthly Recording Space | FindStudioSpace',
  description:
    'Find podcast studios available for monthly rent. Soundproofed recording booths, acoustic rooms, and production-ready spaces — browse and contact hosts directly.',
  alternates: { canonical: 'https://www.findstudiospace.com/podcast-studios' },
  openGraph: {
    title: 'Podcast Studios for Rent | Monthly Recording Space | FindStudioSpace',
    description:
      'Browse podcast studios available for monthly rent. Soundproofed recording booths, acoustic rooms, and production-ready spaces — contact hosts directly.',
  },
}

const FAQS = [
  {
    q: 'How do I find a podcast studio to rent?',
    a: 'Browse the listings on this page — each shows location, photos, monthly pricing, and what equipment is included. Submit an inquiry directly from any listing and the host will follow up. No platform booking fee, no middleman.',
  },
  {
    q: 'How much does it cost to rent a podcast studio per month?',
    a: 'Monthly podcast studio rentals typically range from $300–$1,200/month depending on room size, soundproofing quality, included equipment, and market. Single-host booths for solo podcasters start on the lower end; larger production rooms with full mic setups, acoustic panels, and video rigs run higher.',
  },
  {
    q: 'What equipment is typically included in a podcast studio rental?',
    a: 'Most podcast studio rentals include microphones, an audio interface, headphones, and studio monitors. Some add acoustic treatment panels, a mixing board, and camera rigs for hybrid podcast-video production. Check the listing description for the specific gear list — and confirm with the host before committing.',
  },
  {
    q: 'What is the difference between hourly podcast studio rental and a monthly arrangement?',
    a: 'Hourly rentals charge per session — convenient for a one-off episode or pilot but expensive for consistent production. A monthly rental gives you regular, flexible access without competing for booking slots each week. If you record multiple episodes per month or run an ongoing show, a monthly term is almost always more cost-effective.',
  },
  {
    q: 'Do I need to bring my own equipment to a rented podcast studio?',
    a: "Usually not for a full studio rental — the setup is included. For bare recording rooms or shared production spaces, you may need to bring your own mic or interface. Check the listing before inquiring. If you have specific gear requirements — a particular microphone, an XLR interface, a video camera — mention it in your inquiry so the host can confirm compatibility.",
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
    { '@type': 'ListItem', position: 2, name: 'Podcast Studios' },
  ],
}

export default async function PodcastStudiosPage() {
  const { data: podcastListings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .not('title', 'is', null)
    .or(
      'title.ilike.%podcast%,description.ilike.%podcast%,' +
      'title.ilike.%recording studio%,description.ilike.%recording studio%,' +
      'title.ilike.%sound booth%,description.ilike.%sound booth%,' +
      'title.ilike.%vocal booth%,description.ilike.%vocal booth%'
    )
    .limit(48)

  const { data: fallbackListings } = (!podcastListings || podcastListings.length < 4)
    ? await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .not('title', 'is', null)
        .eq('type', 'music')
        .limit(24)
    : { data: null }

  const listings =
    podcastListings && podcastListings.length >= 4
      ? podcastListings
      : [...(podcastListings ?? []), ...(fallbackListings ?? [])]

  const itemListSchema = listings.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Podcast Studios for Rent',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}

      <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <nav style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mb-6 text-xs">
            <Link href="/" className="hover:underline">FindStudioSpace</Link>
            <span className="mx-2">→</span>
            <span style={{ color: 'var(--ink)' }}>Podcast Studios</span>
          </nav>

          <h1
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
            className="mb-4 text-3xl font-semibold"
          >
            Podcast Studios for Rent
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            Browse podcast studios and recording spaces available for monthly rent. Soundproofed booths,
            acoustic rooms, and production-ready setups for solo podcasters, co-hosted shows, and
            hybrid podcast-video production. Submit an inquiry from any listing to contact the host
            directly — no booking platform fee.
          </p>

          {listings.length > 0 ? (
            <CategoryFilter listings={listings} />
          ) : (
            <p style={{ color: 'var(--stone)' }} className="mb-14">
              No podcast studios listed yet — check back soon.
            </p>
          )}

          {/* FAQ */}
          <section style={{ borderTop: '1px solid var(--rule)' }} className="pt-10">
            <h2
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
              className="mb-6 text-xl font-semibold"
            >
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

          {/* Related */}
          <section style={{ borderTop: '1px solid var(--rule)' }} className="mt-12 pt-8">
            <h2
              style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }}
              className="mb-4 text-xs uppercase tracking-wider"
            >
              Related Searches
            </h2>
            <ul className="flex flex-wrap gap-3">
              {[
                { label: 'Portland Content Studios', href: '/portland/content-studios' },
                { label: 'Portland Podcast Studio', href: '/portland/podcast-studio' },
                { label: 'Portland Event Space', href: '/portland/event-space' },
                { label: 'Portland Photo Studios', href: '/portland/photo-studios' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ border: '1px solid var(--rule)', color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}
                    className="inline-block px-3 py-1.5 text-xs hover:bg-[var(--surface)] transition-colors"
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
