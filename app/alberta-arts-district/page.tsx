import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Studio Space for Rent in Alberta Arts District, Portland | FindStudioSpace',
  description:
    'Monthly studio space for rent in Portland\'s Alberta Arts District. Art studios, shared co-ops, and creative workspace on NE Alberta Street.',
  alternates: { canonical: 'https://www.findstudiospace.com/alberta-arts-district' },
  openGraph: {
    title: 'Studio Space for Rent in Alberta Arts District, Portland | FindStudioSpace',
    description:
      'Find monthly studio space for rent in Portland\'s Alberta Arts District. Art studios, shared co-ops, and creative workspace on NE Alberta Street.',
  },
}

const FAQS = [
  {
    q: 'How much does studio space cost in the Alberta Arts District?',
    a: 'Monthly studio rentals in the Alberta Arts District typically range from $300–$1,500/month. Shared co-op spaces and smaller private studios offer some of Portland\'s most affordable options for working artists. The corridor mixes independently owned buildings with a strong artist community ethos.',
  },
  {
    q: 'What kind of studios are available in the Alberta Arts District?',
    a: 'The Alberta Arts District has a strong concentration of visual art studios, painters, printmakers, ceramicists, and mixed media artists. Several buildings offer shared facilities including kilns, printing presses, and communal equipment. Gallery-adjacent studios that allow open studio events are also common on this corridor.',
  },
  {
    q: 'Is the Alberta Arts District good for a working studio practice?',
    a: 'Yes. NE Alberta is one of Portland\'s most established arts communities with a strong network of working artists, regular Last Thursday open studio events, and a walkable neighborhood with cafes and galleries nearby. It\'s a good fit for artists who value community and consistent foot traffic.',
  },
  {
    q: 'Are there shared studio co-ops on NE Alberta?',
    a: 'Yes. Several buildings on and near NE Alberta operate as artist co-ops with shared common areas, communal equipment, and a community of working artists. Co-op arrangements are typically more affordable than private studios and offer a built-in creative network.',
  },
  {
    q: 'How do I find a studio for rent in the Alberta Arts District?',
    a: 'Browse listings filtered to NE Portland and the Alberta corridor above, each shows monthly pricing, photos, and contact information. Submit an inquiry directly from any listing and the host will respond. No platform booking fee.',
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
    { '@type': 'ListItem', position: 3, name: 'Alberta Arts District' },
  ],
}

export default async function AlbertaArtsDistrictPage() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .not('title', 'is', null)
    .or('neighborhood.ilike.%Alberta%,neighborhood.ilike.%NE Portland%')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(48)

  const rows = listings ?? []

  const itemListSchema = rows.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Studio Space for Rent in Alberta Arts District, Portland',
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
            <span style={{ color: 'var(--ink)' }}>Alberta Arts District</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            Studio Space for Rent in the Alberta Arts District, Portland
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            The Alberta Arts District on NE Alberta Street is Portland&apos;s most established arts community, home to galleries, independent studios, and maker spaces. Browse monthly studio rentals from shared co-op spaces to private artist studios, with a strong community of painters, printmakers, and craft artists. Submit an inquiry from any listing to connect directly with the host.
          </p>

          {rows.length > 0 ? (
            <CategoryFilter listings={rows} />
          ) : (
            <p style={{ color: 'var(--stone)' }} className="mb-14">No studios listed in this neighborhood yet, check back soon.</p>
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
                { label: 'Art Studio for Rent', href: '/portland/art-studio-rental' },
                { label: 'Central Eastside Studios', href: '/central-eastside' },
                { label: 'Portland Art Studio', href: '/portland/art-studio' },
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
