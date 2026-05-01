import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Video Production Studios for Rent in Portland, OR | Film & Content Studios',
  description:
    'Find video production studios for rent in Portland, OR. Green screens, film sets, content creation rooms, and monthly production studio rentals — contact hosts directly.',
  alternates: { canonical: 'https://www.findstudiospace.com/video-production-studios-portland' },
  openGraph: {
    title: 'Video Production Studios for Rent in Portland, OR | Film & Content Studios',
    description:
      'Find video production studios for rent in Portland, OR. Green screens, film sets, content creation rooms, and monthly production studio rentals — contact hosts directly.',
  },
}

const FAQS = [
  {
    q: 'How much does a video production studio cost to rent in Portland per month?',
    a: 'Monthly video production studio rentals in Portland range from $700–$3,000/month. Smaller content creation rooms with basic lighting and a green screen start around $700–$1,200; full production studios with film sets, grip equipment, and control room access run $1,500–$3,000+/month. Day-rate options are also common — ask the host.',
  },
  {
    q: 'Do Portland video studios include lighting and camera equipment?',
    a: 'Lighting rigs are commonly included — most studios have LED panels, softboxes, and grip equipment (stands, flags, diffusion). Camera and lens packages vary: some studios include camera bodies, others are bring-your-own. Confirm what\'s included in the listing description and verify with the host before booking.',
  },
  {
    q: 'Are there green screen studios for rent in Portland?',
    a: 'Yes. Several Portland production studios have dedicated green screen or chroma key setups with appropriate lighting to minimize spill. Look for listings that specifically mention green screen or chroma key. Some also offer white and black infinity walls as alternatives for different production looks.',
  },
  {
    q: 'Can I rent a Portland video studio for commercial or branded content shoots?',
    a: 'Yes. Most studios available for monthly or day-rate rent allow commercial, branded, and editorial production. Larger crew sizes or extended shoots may require additional insurance documentation — mention your production scope and crew size in your inquiry so the host can confirm suitability.',
  },
  {
    q: 'What neighborhoods in Portland have video production studios?',
    a: 'Video production studios in Portland are concentrated in the Pearl District, Central Eastside Industrial District, and NE Portland. Central Eastside warehouse buildings offer high ceilings, loading access for equipment, and flexible layouts suited for large production setups. Pearl District studios tend to have more polished finishes for client-facing work.',
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
    { '@type': 'ListItem', position: 2, name: 'Video Production Studios Portland' },
  ],
}

export default async function VideoProductionStudiosPortlandPage() {
  const { data: videoListings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .not('title', 'is', null)
    .not('neighborhood', 'ilike', '%Vancouver%')
    .or(
      'title.ilike.%video production%,description.ilike.%video production%,' +
      'title.ilike.%production studio%,description.ilike.%production studio%,' +
      'title.ilike.%film studio%,description.ilike.%film studio%,' +
      'title.ilike.%green screen%,description.ilike.%green screen%,' +
      'title.ilike.%chroma key%,description.ilike.%chroma key%,' +
      'title.ilike.%content studio%,description.ilike.%content studio%,' +
      'title.ilike.%video studio%,description.ilike.%video studio%,' +
      'title.ilike.%film set%,description.ilike.%film set%'
    )
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(48)

  const listings = videoListings ?? []

  const itemListSchema = listings.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Video Production Studios for Rent in Portland, OR',
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
            <span style={{ color: 'var(--ink)' }}>Video Production Studios</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            Video Production Studios for Rent in Portland, OR
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            Browse video production studios available for monthly rent in Portland, OR. Green screen stages, film sets, content creation rooms, and full production facilities with lighting packages across Pearl District, Central Eastside, and NE Portland. Submit an inquiry from any listing to connect directly with the host.
          </p>

          {listings.length > 0 ? (
            <CategoryFilter listings={listings} />
          ) : (
            <p style={{ color: 'var(--stone)' }} className="mb-14">No video production studios listed yet — check back soon or browse <Link href="/photography-studios-portland" className="underline">photography studios</Link>.</p>
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
                { label: 'Photography Studios Portland', href: '/photography-studios-portland' },
                { label: 'Content Studios', href: '/portland/content-studios' },
                { label: 'Podcast Studios Portland', href: '/podcast-studios' },
                { label: 'Event Spaces Portland', href: '/event-spaces-portland' },
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
