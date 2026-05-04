import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 2592000 // 30 days

export const metadata: Metadata = {
  title: 'Portland Studio Space by Neighborhood — Creative Workspace Guide | FindStudioSpace',
  description:
    'A neighborhood-by-neighborhood guide to renting studio space in Portland, OR. Compare average rents, creative character, and best uses across the Central Eastside, Pearl District, Alberta Arts District, SE Division, Mississippi Ave, and Slabtown.',
  alternates: { canonical: 'https://www.findstudiospace.com/portland-studio-neighborhoods' },
  openGraph: {
    title: 'Portland Studio Space by Neighborhood — Creative Workspace Guide | FindStudioSpace',
    description:
      'A neighborhood-by-neighborhood guide to renting studio space in Portland, OR. Compare average rents, creative character, and best uses across the Central Eastside, Pearl District, Alberta Arts District, SE Division, Mississippi Ave, and Slabtown.',
  },
}

const FAQS = [
  {
    q: 'Which Portland neighborhood is best for art studios?',
    a: 'The Alberta Arts District and Central Eastside are Portland\'s strongest neighborhoods for working art studios. Alberta is a tight-knit NE Portland community with lower rents and strong foot traffic on First Thursday gallery nights. The Central Eastside offers industrial zoning, high ceilings, and loading access — well suited for large-format work, ceramics, and fabrication. Which is better depends on your practice: Alberta fits painters and printmakers; the Central Eastside fits makers and production-heavy studios.',
  },
  {
    q: 'Where is the cheapest studio space in Portland?',
    a: 'Alberta Arts District and SE Division consistently offer Portland\'s most affordable studio rents. Alberta runs roughly $300–$1,500/month depending on size; Division is similar at $400–$2,000/month. Both neighborhoods have residential-scale buildings where small private studios and shared co-ops can be found at the lower end of those ranges. The Pearl District and Central Eastside tend to run higher due to building quality and location.',
  },
  {
    q: 'What neighborhoods have 24-hour studio access?',
    a: 'The Central Eastside is the most reliable neighborhood for 24-hour access — industrial and commercial buildings there routinely offer keycard or fob entry at all hours. The Pearl District\'s commercial buildings also commonly support around-the-clock access. Alberta Arts District and SE Division are more mixed: some buildings offer 24-hour access; others have landlord-set hours. Always confirm access hours directly with the host before signing.',
  },
  {
    q: 'Where do photographers rent studio space in Portland?',
    a: 'The Pearl District is Portland\'s primary market for dedicated photography studios — clean commercial buildings, good light, and proximity to design agencies and brand clients. The Central Eastside is a secondary option, especially for photographers who need loading access for equipment or high-ceiling shooting bays. Some photo studios also operate in Slabtown as NW Portland\'s commercial corridor continues to develop.',
  },
  {
    q: 'What is the best neighborhood for a workshop or fabrication studio?',
    a: 'The Central Eastside Industrial District is the clear choice for workshop and fabrication space in Portland. Industrial zoning means fewer restrictions on noise, dust, and equipment operation. Many buildings offer drive-in loading bays, three-phase power, and freight elevators. If the Central Eastside is too expensive or fully occupied, Mississippi Ave and Slabtown each have a smaller inventory of light-industrial flex space worth exploring.',
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
    { '@type': 'ListItem', position: 3, name: 'Studio Neighborhoods', item: 'https://www.findstudiospace.com/portland-studio-neighborhoods' },
  ],
}

const NEIGHBORHOODS = [
  {
    name: 'Central Eastside',
    href: '/central-eastside',
    description:
      'Portland\'s industrial creative core, directly east of the Willamette. The Central Eastside has been the city\'s working maker district for decades — buildings with high ceilings, loading access, and industrial zoning that tolerates noise, dust, and heavy equipment. Expect a mix of private studios, shared fabrication bays, and production offices.',
    rent: '$500–$3,000/mo',
    bestFor: 'Woodworkers, fabricators, ceramicists, production studios',
  },
  {
    name: 'Pearl District',
    href: '/portland/pearl-district',
    description:
      'Portland\'s premier commercial creative neighborhood, anchored by galleries, design firms, and upscale retail. Buildings are newer and well-maintained, with strong natural light and professional common areas. Rents are among the highest in the city, but the client-facing character of the district suits businesses that need to impress.',
    rent: '$800–$4,000/mo',
    bestFor: 'Photographers, designers, creative agencies',
  },
  {
    name: 'Alberta Arts District',
    href: '/alberta-arts-district',
    description:
      'NE Portland\'s established artist community, centered on Alberta Street between 15th and 30th. A dense concentration of working studios, galleries, and arts nonprofits makes Alberta the strongest neighborhood ecosystem for practicing visual artists. Rents are among the lowest in Portland, and the First Thursday gallery walk brings regular foot traffic.',
    rent: '$300–$1,500/mo',
    bestFor: 'Painters, printmakers, mixed media artists',
  },
  {
    name: 'SE Division',
    href: '/portland/division',
    description:
      'A walkable, neighborhood-scale corridor in SE Portland that has grown into a reliable option for small studios and maker-retail hybrids. Buildings are modest — converted storefronts and older commercial stock — which keeps rents affordable. Good for instructors and retail-facing makers who want a residential customer base and street-level visibility.',
    rent: '$400–$2,000/mo',
    bestFor: 'Retail makers, instructors, small private studios',
  },
  {
    name: 'N Mississippi Ave',
    href: '/portland/mississippi',
    description:
      'A boutique creative corridor in North Portland with a curated mix of shops, galleries, and maker businesses. Mississippi has a visible storefront culture — fewer raw warehouse spaces, more finished retail-adjacent studios. Suited to creative businesses that want a neighborhood identity and foot traffic without the Pearl District\'s price point.',
    rent: '$500–$2,500/mo',
    bestFor: 'Jewelers, designers, visible storefronts',
  },
  {
    name: 'Slabtown / NW Portland',
    href: '/slabtown',
    description:
      'An emerging corridor in NW Portland between the Pearl and the old industrial waterfront. Slabtown is less established than the other neighborhoods on this list — inventory is limited and rents vary widely — but creative offices and small studios are appearing as the area develops. Worth monitoring if you want to be early in a neighborhood on the rise.',
    rent: 'Varies',
    bestFor: 'Creative offices, small studios',
  },
]

export default function PortlandStudioNeighborhoodsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen">
        <div className="mx-auto max-w-4xl px-6 py-10">

          {/* Breadcrumb nav */}
          <nav style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mb-6 text-xs">
            <Link href="/" className="hover:underline">FindStudioSpace</Link>
            <span className="mx-2">→</span>
            <Link href="/portland" className="hover:underline">Portland</Link>
            <span className="mx-2">→</span>
            <span style={{ color: 'var(--ink)' }}>Studio Neighborhoods</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            Portland Studio Space by Neighborhood
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            Portland&apos;s creative studio market is spread across a half-dozen distinct neighborhoods, each with its own character, price range, and creative community. This guide covers where to rent studio space in Portland — what you&apos;ll find, what it costs, and who each neighborhood suits best.
          </p>

          {/* Neighborhood cards */}
          <section className="mb-14">
            <div className="space-y-8">
              {NEIGHBORHOODS.map(({ name, href, description, rent, bestFor }) => (
                <article
                  key={href}
                  style={{ border: '1px solid var(--rule)', background: 'var(--surface)' }}
                  className="p-6"
                >
                  <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-3 text-xl font-semibold">
                    {name}
                  </h2>
                  <p style={{ color: 'var(--stone)' }} className="mb-4 text-sm leading-relaxed">
                    {description}
                  </p>
                  <dl style={{ fontFamily: 'var(--font-mono)' }} className="mb-4 flex flex-wrap gap-x-8 gap-y-2 text-xs">
                    <div>
                      <dt style={{ color: 'var(--sub)' }} className="mb-0.5 uppercase tracking-wider">Avg. rent</dt>
                      <dd style={{ color: 'var(--ink)' }} className="font-medium">{rent}</dd>
                    </div>
                    <div>
                      <dt style={{ color: 'var(--sub)' }} className="mb-0.5 uppercase tracking-wider">Best for</dt>
                      <dd style={{ color: 'var(--ink)' }}>{bestFor}</dd>
                    </div>
                  </dl>
                  <Link
                    href={href}
                    style={{ color: 'var(--action)', fontFamily: 'var(--font-mono)' }}
                    className="text-xs hover:underline"
                  >
                    Browse {name} listings →
                  </Link>
                </article>
              ))}
            </div>
          </section>

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

          {/* Related searches */}
          <section style={{ borderTop: '1px solid var(--rule)' }} className="mt-12 pt-8">
            <h2 style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mb-4 text-xs uppercase tracking-wider">
              Related Searches
            </h2>
            <ul className="flex flex-wrap gap-3">
              {[
                { label: 'Art Studio Rental Portland', href: '/portland/art-studio-rental' },
                { label: 'Photo Studios Portland', href: '/portland/photo-studios' },
                { label: 'Workshop Space Rental Portland', href: '/portland/workshop-space-rental' },
                { label: 'All Portland Listings', href: '/portland' },
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
