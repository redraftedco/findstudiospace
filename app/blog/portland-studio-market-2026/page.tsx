import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Portland Studio Space Market Report 2026 | Rents by Type & Neighborhood',
  description:
    'Average monthly rents for art studios, photo studios, workshops, and creative offices in Portland, OR, broken down by neighborhood and space type. Updated 2026.',
  alternates: { canonical: 'https://www.findstudiospace.com/blog/portland-studio-market-2026' },
  openGraph: {
    title: 'Portland Studio Space Market Report 2026',
    description:
      'Average monthly rents for art studios, photo studios, workshops, and creative offices in Portland by neighborhood and type. Updated 2026.',
    url: 'https://www.findstudiospace.com/blog/portland-studio-market-2026',
    type: 'article',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Portland Studio Space Market Report 2026',
  datePublished: '2026-05-01',
  dateModified: '2026-05-01',
  author: { '@type': 'Organization', name: 'FindStudioSpace', url: 'https://www.findstudiospace.com' },
  publisher: {
    '@type': 'Organization',
    name: 'FindStudioSpace',
    url: 'https://www.findstudiospace.com',
    logo: { '@type': 'ImageObject', url: 'https://www.findstudiospace.com/og-default.svg' },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.findstudiospace.com/blog/portland-studio-market-2026' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.findstudiospace.com' },
    { '@type': 'ListItem', position: 2, name: 'Resources', item: 'https://www.findstudiospace.com/blog' },
    { '@type': 'ListItem', position: 3, name: 'Portland Studio Market Report 2026' },
  ],
}

export default function Post() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <nav style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }} className="mb-10 text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            {' / '}
            <Link href="/blog" className="hover:underline">Resources</Link>
            {' / '}
            <span>Portland Studio Market 2026</span>
          </nav>

          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }} className="mb-4 text-xs">May 1, 2026</p>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-8 text-3xl font-semibold leading-tight">
            Portland Studio Space Market Report 2026
          </h1>

          <div style={{ color: 'var(--ink)' }} className="space-y-6 text-sm leading-relaxed">

            <p>
              This report aggregates pricing data from active listings on FindStudioSpace and publicly available rental data across Portland&apos;s creative districts. All figures represent monthly rents for creative studio, workshop, and production space, not hourly or daily rates. Data reflects the market as of Q2 2026.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Prices by space type</h2>

            <ul className="space-y-3 pl-4">
              <li>
                <strong>Private art studio (100–200 sq ft):</strong> $300–$700/month<br />
                <span style={{ color: 'var(--stone)' }}>The most common rental unit in Portland&apos;s creative district. Typically includes utilities, 24-hour access, and shared bathroom. Natural north-light studios command a premium at the top of this range.</span>
              </li>
              <li>
                <strong>Shared art studio / co-op desk:</strong> $150–$400/month<br />
                <span style={{ color: 'var(--stone)' }}>Shared space with communal equipment, common on NE Alberta and in Central Eastside co-op buildings. Lower cost, built-in community, less storage.</span>
              </li>
              <li>
                <strong>Workshop / fabrication bay (400–800 sq ft):</strong> $700–$2,000/month<br />
                <span style={{ color: 'var(--stone)' }}>Ground-floor bays with roll-up door access and 220v power in industrial-zoned buildings. Central Eastside is the primary source. Price scales sharply with ceiling height and loading infrastructure.</span>
              </li>
              <li>
                <strong>Photography studio (400–1,000 sq ft):</strong> $800–$2,500/month<br />
                <span style={{ color: 'var(--stone)' }}>Monthly rates for dedicated photo studios with background infrastructure. Day-rate options ($75–$250/day) are widely available for occasional use. Cyclorama wall studios sit at the top of the monthly range.</span>
              </li>
              <li>
                <strong>Creative office (200–500 sq ft):</strong> $500–$1,800/month<br />
                <span style={{ color: 'var(--stone)' }}>Suitable for architects, designers, small agencies. Pearl District offices run highest; Central Eastside and NE Portland offer more room for less.</span>
              </li>
              <li>
                <strong>Podcast / recording studio (private booth or room):</strong> $400–$1,200/month<br />
                <span style={{ color: 'var(--stone)' }}>Soundproofed, treated spaces. Most Portland podcast studios are offered on monthly terms with equipment included. Smaller booths start low; full production rooms with control room access run higher.</span>
              </li>
              <li>
                <strong>Event space (for pop-ups, community events):</strong> $600–$3,500/month<br />
                <span style={{ color: 'var(--stone)' }}>Wide range based on size, finishes, and frequency of use. Monthly venue rentals for recurring activations are increasingly common in Pearl District and Central Eastside.</span>
              </li>
            </ul>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Prices by neighborhood</h2>

            <ul className="space-y-3 pl-4">
              <li>
                <strong><Link href="/portland/pearl-district" style={{ color: 'var(--ink)' }} className="underline">Pearl District:</Link></strong> $1,000–$3,500/month<br />
                <span style={{ color: 'var(--stone)' }}>Portland&apos;s most expensive creative neighborhood. Polished finishes, strong foot traffic, client-appropriate addresses. Best for design studios, photo studios with commercial clients, and event venues.</span>
              </li>
              <li>
                <strong><Link href="/central-eastside" style={{ color: 'var(--ink)' }} className="underline">Central Eastside:</Link></strong> $500–$2,500/month<br />
                <span style={{ color: 'var(--stone)' }}>The city&apos;s working creative district. Widest range of space types and sizes. Industrial zoning supports loud, messy, and large-format work. Best overall value in Portland for production and fabrication.</span>
              </li>
              <li>
                <strong><Link href="/slabtown" style={{ color: 'var(--ink)' }} className="underline">Slabtown (NW Portland):</Link></strong> $700–$2,200/month<br />
                <span style={{ color: 'var(--stone)' }}>Pearl-adjacent pricing in converted industrial buildings. Better for creative offices and design studios than for fabrication work. Growing corridor with limited studio inventory.</span>
              </li>
              <li>
                <strong><Link href="/alberta-arts-district" style={{ color: 'var(--ink)' }} className="underline">Alberta Arts District:</Link></strong> $300–$1,200/month<br />
                <span style={{ color: 'var(--stone)' }}>Portland&apos;s most established artist community. Most affordable private studio options in the city. Strong for visual artists, ceramicists, and printmakers who value community over infrastructure.</span>
              </li>
              <li>
                <strong>SE Portland (Division, Woodstock, Sellwood):</strong> $400–$1,500/month<br />
                <span style={{ color: 'var(--stone)' }}>Scattered studio inventory in mixed residential and commercial buildings. Good natural light, walkable neighborhoods, fewer industrial-infrastructure amenities.</span>
              </li>
              <li>
                <strong>N Portland (Mississippi Ave, St. Johns):</strong> $350–$1,200/month<br />
                <span style={{ color: 'var(--stone)' }}>Some of Portland&apos;s most affordable studio options in the city. Less inventory than Central Eastside or NE, but worth watching as both corridors develop. Good for artists who want a neighborhood feel without Pearl District pricing.</span>
              </li>
            </ul>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Market trends</h2>

            <ul className="space-y-2 pl-4">
              <li><strong>Demand is outpacing supply for sub-$600 studios.</strong> Spaces in this range fill within days of listing and rarely make it to public directories. Word-of-mouth and existing tenant networks are the primary channel.</li>
              <li><strong>Photo studio monthly rents have risen 15–25% since 2023</strong>, driven by creator economy demand and short supply of purpose-built shooting spaces in Portland.</li>
              <li><strong>Central Eastside vacancy is low.</strong> Industrial redevelopment pressure has converted some traditional creative space to higher-value uses, reducing supply without a corresponding reduction in demand.</li>
              <li><strong>Month-to-month premiums are holding at 10–20%</strong> over annual lease rates, consistent with prior years. Landlords are not compressing this spread despite economic softness elsewhere.</li>
              <li><strong>Podcast and recording studios are undersupplied.</strong> Demand from creator-economy workers and hybrid remote professionals has outpaced new purpose-built studio development.</li>
            </ul>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Methodology</h2>
            <p style={{ color: 'var(--stone)' }}>
              Data is drawn from active listings on FindStudioSpace and supplemented by publicly listed rental rates from Craigslist, property management sites, and landlord-reported data. This is directional market intelligence, not a statistically rigorous survey. Pricing varies significantly based on included utilities, amenities, access hours, and lease terms. Confirm current rates directly with hosts.
            </p>

            <div style={{ borderTop: '1px solid var(--rule)' }} className="mt-12 pt-8">
              <p style={{ color: 'var(--stone)' }} className="text-sm">
                Browse current listings: <Link href="/portland" style={{ color: 'var(--ink)' }} className="underline">all Portland studios</Link> ·{' '}
                <Link href="/central-eastside" style={{ color: 'var(--ink)' }} className="underline">Central Eastside</Link> ·{' '}
                <Link href="/portland/pearl-district" style={{ color: 'var(--ink)' }} className="underline">Pearl District</Link> ·{' '}
                <Link href="/alberta-arts-district" style={{ color: 'var(--ink)' }} className="underline">Alberta Arts District</Link>
              </p>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
