import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Studio Space for Rent in Sellwood, Portland | FindStudioSpace',
  description:
    'Find monthly studio and creative workspace for rent in the Sellwood neighborhood of SE Portland. Artist studios and creative workspace in a quiet, village-like neighborhood.',
  alternates: { canonical: 'https://www.findstudiospace.com/sellwood' },
  openGraph: {
    title: 'Studio Space for Rent in Sellwood, Portland | FindStudioSpace',
    description:
      'Find monthly studio and creative workspace for rent in the Sellwood neighborhood of SE Portland.',
  },
}

const FAQS = [
  {
    q: 'What is the Sellwood neighborhood in Portland?',
    a: 'Sellwood is a quiet, village-like neighborhood in the far SE of Portland, along the Willamette River. It has a distinct small-town character with antique shops, independent restaurants, and a slower pace than inner SE. Sellwood is less dense in creative studio inventory than the Central Eastside or Alberta, but offers affordable space with a distinctive residential neighborhood character.',
  },
  {
    q: 'How much does studio space cost in Sellwood?',
    a: 'Monthly studio rentals in Sellwood are among the more affordable in Portland, typically ranging from $350–$1,000/month. The neighborhood\'s lower commercial density means less competition for space and more negotiating room on terms.',
  },
  {
    q: 'What types of studios are available in Sellwood?',
    a: 'Sellwood\'s studio inventory is primarily small art studios and teaching spaces in commercial mixed-use buildings along SE Milwaukie Avenue and SE 13th. It\'s a good fit for artists who want a quiet working environment, lower rent, and a residential neighborhood character over industrial infrastructure.',
  },
  {
    q: 'Is Sellwood accessible from the rest of Portland?',
    a: 'Sellwood is in the far SE, roughly 15–20 minutes from downtown by car or bike via the Sellwood Bridge. Bus service runs on SE Milwaukie Avenue. The neighborhood is quite bikeable for local trips but is one of Portland\'s more car-dependent areas for cross-city travel.',
  },
  {
    q: 'How does Sellwood compare to other SE Portland neighborhoods for studios?',
    a: 'Sellwood is quieter and more residential than the Division Street or Hawthorne corridors. It has less studio inventory but also less competition, spaces tend to stay available longer and landlords are often more flexible on terms. It\'s a good option for artists who prioritize quiet, outdoor access (the Sellwood riverfront park is nearby), and lower rent over urban density.',
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
    { '@type': 'ListItem', position: 3, name: 'Sellwood' },
  ],
}

const placeSchema = {
  '@context': 'https://schema.org',
  '@type': 'Place',
  name: 'Sellwood, Portland',
  geo: { '@type': 'GeoCoordinates', latitude: 45.4692, longitude: -122.6527 },
  address: { '@type': 'PostalAddress', addressLocality: 'Portland', addressRegion: 'OR', addressCountry: 'US' },
  containedInPlace: { '@type': 'City', name: 'Portland' },
}

export default async function SellwoodPage() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .not('title', 'is', null)
    .or('neighborhood.ilike.%Sellwood%,neighborhood.ilike.%Moreland%,neighborhood.ilike.%SE Portland%')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(48)

  const rows = listings ?? []

  const itemListSchema = rows.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Studio Space for Rent in Sellwood, Portland',
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
            <span style={{ color: 'var(--ink)' }}>Sellwood</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            Studio Space for Rent in Sellwood, Portland
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            Sellwood is one of Portland&apos;s quietest and most village-like neighborhoods, a riverside SE district with independent studios and creative workspace at some of the city&apos;s most accessible monthly rents. Browse studio rentals in Sellwood and submit an inquiry from any listing to connect directly with the host.
          </p>

          {rows.length > 0 ? (
            <CategoryFilter listings={rows} />
          ) : (
            <p style={{ color: 'var(--stone)' }} className="mb-14">No studios listed in Sellwood yet, check back soon or browse <Link href="/division-street" className="underline">Division Street studios</Link> or <Link href="/central-eastside" className="underline">Central Eastside studios</Link>.</p>
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
                { label: 'Division Street Studios', href: '/division-street' },
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
