import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Studio Space for Rent in Slabtown, Portland | FindStudioSpace',
  description:
    'Find monthly studio and creative workspace for rent in Slabtown (NW Portland). Artist studios, creative offices, and maker spaces near the Pearl District.',
  alternates: { canonical: 'https://www.findstudiospace.com/slabtown' },
  openGraph: {
    title: 'Studio Space for Rent in Slabtown, Portland | FindStudioSpace',
    description:
      'Find monthly studio and creative workspace for rent in Slabtown (NW Portland). Artist studios, creative offices, and maker spaces near the Pearl District.',
  },
}

const FAQS = [
  {
    q: 'What is Slabtown in Portland?',
    a: 'Slabtown is a neighborhood in NW Portland, roughly bounded by NW 18th and 25th Avenues and NW Lovejoy and Vaughn Streets. Once an industrial district, it\'s become a mixed-use corridor of creative offices, studios, fitness spaces, and restaurants — adjacent to the Pearl District and Nob Hill.',
  },
  {
    q: 'How much does studio space cost in Slabtown?',
    a: 'Monthly studio and office rentals in Slabtown typically range from $600–$2,500/month depending on size and finish level. Slabtown is positioned between the Pearl District (higher rents, polished finishes) and NW industrial areas (more affordable, larger spaces).',
  },
  {
    q: 'What types of studios are available in Slabtown?',
    a: 'Slabtown has a mix of creative offices, design studios, fitness spaces, and smaller maker spaces — many in converted industrial buildings with polished interiors. It\'s well suited for creative professionals, small agencies, and practitioners who want Pearl District proximity at slightly lower rents.',
  },
  {
    q: 'Is Slabtown walkable and transit-accessible?',
    a: 'Yes. Slabtown is highly walkable with multiple bus lines on NW Lovejoy and Thurman. The neighborhood is bikeable and within easy cycling distance of the Pearl District, downtown, and the NW 23rd shopping corridor.',
  },
  {
    q: 'How is Slabtown different from the Pearl District for studio space?',
    a: 'The Pearl District commands Portland\'s highest creative office rents and has a more polished, client-facing environment. Slabtown offers more affordable options with a slightly more industrial character — good for creative businesses that want Pearl District access without Pearl District pricing.',
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
    { '@type': 'ListItem', position: 3, name: 'Slabtown' },
  ],
}

export default async function SlabtownPage() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .not('title', 'is', null)
    .or('neighborhood.ilike.%Slabtown%,neighborhood.ilike.%NW Portland%,neighborhood.ilike.%Northwest%')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(48)

  const rows = listings ?? []

  const itemListSchema = rows.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Studio Space for Rent in Slabtown, Portland',
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
            <span style={{ color: 'var(--ink)' }}>Slabtown</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            Studio Space for Rent in Slabtown, Portland
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            Slabtown is NW Portland&apos;s emerging creative corridor — a mix of converted industrial buildings, design studios, and creative offices adjacent to the Pearl District. Browse monthly studio and workspace rentals in Slabtown and NW Portland. Submit an inquiry from any listing to connect directly with the host.
          </p>

          {rows.length > 0 ? (
            <CategoryFilter listings={rows} />
          ) : (
            <p style={{ color: 'var(--stone)' }} className="mb-14">No studios listed in Slabtown yet — check back soon or browse <Link href="/portland/pearl-district" className="underline">Pearl District studios</Link>.</p>
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
                { label: 'Pearl District Studios', href: '/portland/pearl-district' },
                { label: 'Central Eastside Studios', href: '/central-eastside' },
                { label: 'Office Space Rental', href: '/portland/office-space-rental' },
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
