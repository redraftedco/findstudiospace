import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'
import { directoryConfig } from '@/lib/directory'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Monthly Music Rehearsal Space Portland | Lockout Studios for Rent',
  description:
    'Find monthly lockout music rehearsal space in Portland, OR for bands and musicians. Private studios with 24/7 access starting at $300/month.',
}

const FAQS = [
  {
    q: 'What is a lockout rehearsal space?',
    a: 'A lockout space is a studio you rent on a monthly basis with exclusive 24/7 access, your own key, your own space, no sharing or scheduling. It\'s the preferred setup for bands that rehearse regularly and want to leave their gear set up between sessions. Monthly rates in Portland typically range from $300–$600/month depending on size.',
  },
  {
    q: 'How is monthly rehearsal space different from hourly booking?',
    a: 'Hourly booking services charge per session (typically $20–$50/hr) and require scheduling in advance. Monthly lockout space gives you unlimited access for a flat monthly fee, better value for bands rehearsing multiple times per week.',
  },
  {
    q: 'What should I look for in a rehearsal space?',
    a: 'Key factors: soundproofing quality, 24/7 access, whether gear storage is included, ventilation and temperature control, parking access, and load-in access for equipment. Many Portland rehearsal spaces are in industrial buildings with easy loading access.',
  },
  {
    q: 'How much does monthly rehearsal space cost in Portland?',
    a: 'Monthly lockout rehearsal space in Portland typically runs $300–$600/month for a small to medium room. Shared rehearsal facilities with scheduled blocks run less, around $100–$200/month for part-time access.',
  },
  {
    q: 'Are there rehearsal spaces in Portland that allow loud bands?',
    a: 'Yes, several Portland spaces are in commercial/industrial zones where noise is not a residential concern. Always confirm with the host whether amplified music and full drum kits are permitted before signing a lease.',
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

export default async function MusicRehearsalSpacePage() {
  const { data: musicMatches } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .not('title', 'is', null)
    .in('type', ['fitness', 'art', 'music'])
    .or('title.ilike.%music%,title.ilike.%rehearsal%,title.ilike.%practice%,title.ilike.%band%,description.ilike.%music%,description.ilike.%rehearsal%')
    .limit(48)

  const showFallback = !musicMatches || musicMatches.length === 0

  const { data: fallbackListings } = showFallback
    ? await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .not('title', 'is', null)
        .in('type', ['fitness', 'art'])
        .limit(24)
    : { data: null }

  const listings = musicMatches && musicMatches.length > 0
    ? musicMatches
    : (fallbackListings ?? [])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <nav style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mb-6 text-xs">
            <Link href="/" className="hover:underline">FindStudioSpace</Link>
            <span className="mx-2">→</span>
            <Link href="/" className="hover:underline">Portland</Link>
            <span className="mx-2">→</span>
            <span style={{ color: 'var(--ink)' }}>Music Rehearsal Space</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            Monthly Music Rehearsal Space in Portland, OR
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            Find affordable monthly lockout rehearsal space in Portland for bands, musicians, and performers. Unlike hourly booking services, these spaces offer monthly leases so you have a permanent home for your practice, available 24/7 on your schedule. Browse private studios, shared rehearsal facilities, and flexible creative spaces suitable for music.
          </p>

          {showFallback && (
            <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mb-6 text-xs">
              Browse spaces suitable for music rehearsal in Portland, contact hosts to confirm music use is permitted.
            </p>
          )}

          {listings.length > 0 ? (
            <CategoryFilter listings={listings} />
          ) : (
            <p style={{ color: 'var(--stone)' }} className="mb-14">No spaces listed yet, check back soon.</p>
          )}

          {/* FAQ */}
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

          {/* Related */}
          <section style={{ borderTop: '1px solid var(--rule)' }} className="mt-12 pt-8">
            <h2 style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mb-4 text-xs uppercase tracking-wider">
              Related Searches
            </h2>
            <ul className="flex flex-wrap gap-3">
              {[
                { label: 'Music Studio Rental', href: '/portland/music-studio-rental' },
                { label: 'Art Studio Space', href: '/portland/art-studio' },
                { label: 'Workshop Space', href: '/portland/workshop-space-rental' },
                { label: 'Podcast Studios', href: '/podcast-studios' },
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
