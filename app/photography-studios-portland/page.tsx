import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Photography Studios for Rent in Portland, OR | Photo Shoot Locations',
  description:
    'Find photography studios for rent in Portland, OR. Cyclorama walls, natural light spaces, product photography setups, and monthly photo studio rentals — contact hosts directly.',
  alternates: { canonical: 'https://www.findstudiospace.com/photography-studios-portland' },
  openGraph: {
    title: 'Photography Studios for Rent in Portland, OR | Photo Shoot Locations',
    description:
      'Find photography studios for rent in Portland, OR. Cyclorama walls, natural light spaces, product photography setups, and monthly photo studio rentals — contact hosts directly.',
  },
}

const FAQS = [
  {
    q: 'How much does it cost to rent a photography studio in Portland per month?',
    a: 'Monthly photography studio rentals in Portland range from $600–$2,500/month. Smaller spaces for portrait or editorial work start lower; large production studios with cyclorama walls, dedicated product sets, and full lighting packages run higher. Many studios also offer day-rate options — ask the host.',
  },
  {
    q: 'Do Portland photography studios include lighting and backdrops?',
    a: 'Most do. Common setups include strobe kits, seamless paper backgrounds in multiple colors, V-flats, and tethering stations. Check the listing description for the specific gear list and confirm with the host before committing — included equipment varies significantly between studios.',
  },
  {
    q: 'Are there cyclorama wall (cyc wall) studios for rent in Portland?',
    a: 'Yes. Several Portland studios have full cyclorama walls — seamless curved backgrounds ideal for fashion, product, and editorial shoots requiring a clean infinite backdrop. Look for listings that specifically mention cyc wall or cyclorama in the description.',
  },
  {
    q: 'Can I rent a Portland photography studio for commercial shoots?',
    a: 'Yes. Most studios available for monthly rent allow commercial, editorial, and brand work. Some hosts require a certificate of insurance for large production crews — ask about requirements in your inquiry. If you are bringing a full production team, mention your crew size upfront.',
  },
  {
    q: 'What neighborhoods in Portland have photography studios for rent?',
    a: 'Photo studios in Portland are concentrated in the Pearl District, Central Eastside Industrial District, and NE Portland — all with easy access from downtown. Central Eastside warehouse buildings offer high ceilings and loading access suited for large-production setups; Pearl District studios tend toward polished finishes for client-facing work.',
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
    { '@type': 'ListItem', position: 2, name: 'Photography Studios Portland' },
  ],
}

export default async function PhotographyStudiosPortlandPage() {
  const { data: photoListings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .not('title', 'is', null)
    .not('neighborhood', 'ilike', '%Vancouver%')
    .or(
      'type.eq.photo,' +
      'title.ilike.%photography studio%,description.ilike.%photography studio%,' +
      'title.ilike.%photo studio%,description.ilike.%photo studio%,' +
      'title.ilike.%cyclorama%,description.ilike.%cyclorama%,' +
      'title.ilike.%cyc wall%,description.ilike.%cyc wall%,' +
      'title.ilike.%photo shoot%,description.ilike.%photo shoot%'
    )
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(48)

  const listings = photoListings ?? []

  const itemListSchema = listings.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Photography Studios for Rent in Portland, OR',
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
            <span style={{ color: 'var(--ink)' }}>Photography Studios</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            Photography Studios for Rent in Portland, OR
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            Browse photography studios available for monthly rent in Portland, OR. Cyclorama walls, natural light spaces, product photography setups, boudoir studios, and production-ready rooms across every Portland neighborhood. Submit an inquiry from any listing to connect directly with the host.
          </p>

          {listings.length > 0 ? (
            <CategoryFilter listings={listings} />
          ) : (
            <p style={{ color: 'var(--stone)' }} className="mb-14">No photography studios listed yet — check back soon.</p>
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
                { label: 'Portland Photo Studios', href: '/portland/photo-studios' },
                { label: 'Photo Studio Rental', href: '/portland/photo-studio-rental' },
                { label: 'Event Spaces Portland', href: '/event-spaces-portland' },
                { label: 'Content Studios', href: '/portland/content-studios' },
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
