import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About FindStudioSpace | Portland Creative Studio Directory',
  description:
    'FindStudioSpace is an independent directory of monthly creative studio rentals in Portland, OR. Learn how we vet listings, what we list, and our methodology.',
  alternates: {
    canonical: 'https://www.findstudiospace.com/about',
  },
  openGraph: {
    title: 'About FindStudioSpace',
    description:
      'An independent directory of monthly creative studio rentals in Portland, OR.',
    url: 'https://www.findstudiospace.com/about',
    type: 'website',
  },
}

const SITE_URL = 'https://www.findstudiospace.com'

export default function AboutPage() {
  // Organization schema — entity-level data for Knowledge Panel eligibility
  // and trust signal. No Person schema (founder identity not exposed by design).
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FindStudioSpace',
    url: SITE_URL,
    logo: `${SITE_URL}/og-default.svg`,
    description:
      'An independent directory of monthly creative studio rentals in Portland, OR — photo studios, art studios, content studios, makerspaces, and event spaces.',
    foundingDate: '2026',
    founder: {
      '@type': 'Person',
      name: 'Taylor',
    },
    areaServed: {
      '@type': 'City',
      name: 'Portland',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Portland',
        addressRegion: 'OR',
        addressCountry: 'US',
      },
    },
    knowsAbout: [
      'Photography studios',
      'Art studios',
      'Workshop space',
      'Makerspace',
      'Event venues',
      'Podcast studios',
      'Video production studios',
      'Cyclorama wall studios',
      'Natural light studios',
      'Monthly studio rentals',
      'Creative workspace',
    ],
    sameAs: [
      // Add public business social profiles here when available.
      // No personal accounts. Only brand-owned, public profiles.
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'About' },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen">
        <div className="mx-auto max-w-2xl px-6 py-14">

          <nav style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }} className="mb-10 text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            {' / '}
            <span>About</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-6 text-3xl font-semibold leading-tight">
            About FindStudioSpace
          </h1>

          <p style={{ color: 'var(--stone)' }} className="mb-10 text-base leading-relaxed">
            FindStudioSpace is an independent directory of monthly creative studio rentals in Portland, OR. We list photo studios, art studios, content studios, makerspaces, and event spaces — focused exclusively on month-to-month rental terms, not hourly or daily bookings.
          </p>

          <div style={{ borderTop: '1px solid var(--rule)' }} className="space-y-10 pt-10">

            <section>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-3 text-xl font-semibold">
                Why this directory exists
              </h2>
              <p style={{ color: 'var(--stone)' }} className="text-sm leading-relaxed">
                Portland has one of the highest concentrations of working artists, photographers, makers, and creative producers per capita in the Pacific Northwest. Studio inventory exists — converted warehouses in the Central Eastside, north-light artist studios in the Pearl, photo studios in NE Portland, fabrication bays in industrial buildings.
              </p>
              <p style={{ color: 'var(--stone)' }} className="mt-3 text-sm leading-relaxed">
                The problem isn&apos;t supply. It&apos;s discoverability. Listings are scattered across Craigslist, Facebook groups, property-management websites, and word-of-mouth networks that require knowing the right people. National platforms like Peerspace and Giggster optimize for hourly bookings and take 15–30% of every transaction. Neither solves the problem creatives actually have: finding monthly workspace, in Portland, without paying a commission.
              </p>
              <p style={{ color: 'var(--stone)' }} className="mt-3 text-sm leading-relaxed">
                FindStudioSpace was founded in 2026 to fill that gap. Free to browse. Free to list. No commissions on rent. No platform booking fees. Direct contact between renter and host.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-3 text-xl font-semibold">
                What we list
              </h2>
              <p style={{ color: 'var(--stone)' }} className="mb-3 text-sm leading-relaxed">
                Every listing falls into one of four pillar categories:
              </p>
              <ul style={{ color: 'var(--stone)' }} className="space-y-2 text-sm">
                <li>
                  <Link href="/portland/photo-studios" style={{ color: 'var(--lime)' }} className="hover:underline">
                    <strong>Photo Studios</strong>
                  </Link>{' '}— cyc walls, natural light, product setups, green screen rooms, and general photography studios for monthly rental.
                </li>
                <li>
                  <Link href="/portland/content-studios" style={{ color: 'var(--lime)' }} className="hover:underline">
                    <strong>Content Studios</strong>
                  </Link>{' '}— podcast rooms, video production spaces, and creator-focused studios for media work.
                </li>
                <li>
                  <Link href="/portland/event-space" style={{ color: 'var(--lime)' }} className="hover:underline">
                    <strong>Event Space</strong>
                  </Link>{' '}— private venues and event-ready studios for community events, pop-ups, and brand activations.
                </li>
                <li>
                  <Link href="/portland/makerspace" style={{ color: 'var(--lime)' }} className="hover:underline">
                    <strong>Makerspace</strong>
                  </Link>{' '}— workshop rentals, fabrication bays, ceramics studios, and art studios for hands-on production.
                </li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-3 text-xl font-semibold">
                How we vet listings
              </h2>
              <p style={{ color: 'var(--stone)' }} className="mb-3 text-sm leading-relaxed">
                Before any listing is published, it passes a manual review:
              </p>
              <ul style={{ color: 'var(--stone)' }} className="space-y-3 text-sm">
                <li>
                  <strong style={{ color: 'var(--ink)' }}>Listing legitimacy.</strong> The space must be a real, currently available rental in Portland or its immediate metro area (Vancouver, WA listings are excluded). We verify the space exists, the host is reachable, and the listing is not duplicated from another platform without permission.
                </li>
                <li>
                  <strong style={{ color: 'var(--ink)' }}>Monthly term.</strong> Listings must accept month-to-month or longer terms. Hourly-only or day-rental-only spaces are excluded — those have other platforms.
                </li>
                <li>
                  <strong style={{ color: 'var(--ink)' }}>Category fit.</strong> Each listing is classified into exactly one of the four pillar categories using a rules-based classifier. Office and coworking listings are filtered out of creative pillars to keep results focused.
                </li>
                <li>
                  <strong style={{ color: 'var(--ink)' }}>Contact verification.</strong> Hosts must provide a working contact email. Inquiries route directly to the host with a copy to the platform for quality monitoring.
                </li>
                <li>
                  <strong style={{ color: 'var(--ink)' }}>Honest descriptions.</strong> Listings claiming amenities they don&apos;t have (cyc walls, natural light, equipment) are removed when the discrepancy is reported.
                </li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-3 text-xl font-semibold">
                What we exclude
              </h2>
              <p style={{ color: 'var(--stone)' }} className="mb-3 text-sm leading-relaxed">
                Transparency about exclusions matters more than completeness. We deliberately leave out:
              </p>
              <ul style={{ color: 'var(--stone)' }} className="space-y-2 text-sm">
                <li><strong style={{ color: 'var(--ink)' }}>Hourly and day-rental spaces.</strong> Different product. Use Peerspace or Giggster for those.</li>
                <li><strong style={{ color: 'var(--ink)' }}>Coworking memberships.</strong> WeWork, Industrious, and similar are easy to find elsewhere — they don&apos;t need a directory.</li>
                <li><strong style={{ color: 'var(--ink)' }}>Residential-only spaces.</strong> If it&apos;s primarily a home, it doesn&apos;t belong here.</li>
                <li><strong style={{ color: 'var(--ink)' }}>Vancouver, WA listings.</strong> Different city, different creative scene. Outside our service area.</li>
                <li><strong style={{ color: 'var(--ink)' }}>Listings without working contact info.</strong> A directory entry that can&apos;t be reached is worse than no entry.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-3 text-xl font-semibold">
                Service area
              </h2>
              <p style={{ color: 'var(--stone)' }} className="text-sm leading-relaxed">
                Portland, Oregon — every neighborhood from the Central Eastside Industrial District to Alberta Arts, the Pearl District, SE Division, N Mississippi, and beyond. We cover the city limits and immediately adjacent unincorporated Multnomah County. Vancouver, WA and outlying suburbs are not currently in scope.
              </p>
              <p style={{ color: 'var(--stone)' }} className="mt-3 text-sm leading-relaxed">
                Browse listings by{' '}
                <Link href="/portland/central-eastside" style={{ color: 'var(--lime)' }} className="hover:underline">Central Eastside</Link>,{' '}
                <Link href="/portland/pearl-district" style={{ color: 'var(--lime)' }} className="hover:underline">Pearl District</Link>,{' '}
                <Link href="/portland/alberta-arts" style={{ color: 'var(--lime)' }} className="hover:underline">Alberta Arts</Link>,{' '}
                <Link href="/portland/division" style={{ color: 'var(--lime)' }} className="hover:underline">SE Division</Link>, or{' '}
                <Link href="/portland/mississippi" style={{ color: 'var(--lime)' }} className="hover:underline">N Mississippi</Link>.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-3 text-xl font-semibold">
                Independent and bootstrapped
              </h2>
              <p style={{ color: 'var(--stone)' }} className="text-sm leading-relaxed">
                FindStudioSpace was founded and is independently operated by Taylor, a Portland-based founder. No outside investors, no parent company, no affiliate relationships with the platforms we&apos;re alternatives to. Listings are not paid placements unless explicitly marked as &quot;Featured.&quot; Hosts can purchase sponsored category and neighborhood placement starting at $49/month — always clearly distinguished from organic results.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-3 text-xl font-semibold">
                Contact
              </h2>
              <p style={{ color: 'var(--stone)' }} className="text-sm leading-relaxed">
                Questions, takedown requests, or corrections to a listing — submit through any listing&apos;s inquiry form, or list your own space at{' '}
                <Link href="/list-your-space" style={{ color: 'var(--lime)' }} className="hover:underline">findstudiospace.com/list-your-space</Link>. We respond to all messages within 48 hours.
              </p>
            </section>

          </div>

          <div style={{ borderTop: '1px solid var(--rule)' }} className="mt-12 pt-10">
            <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mb-4 text-xs uppercase tracking-wider">Browse the directory</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'All Studios', href: '/portland' },
                { label: 'Photo Studios', href: '/portland/photo-studios' },
                { label: 'Content Studios', href: '/portland/content-studios' },
                { label: 'Event Space', href: '/portland/event-space' },
                { label: 'Makerspace', href: '/portland/makerspace' },
                { label: 'List Your Space', href: '/list-your-space' },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  style={{ border: '1px solid var(--rule)', color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}
                  className="inline-block px-3 py-1.5 text-xs hover:bg-[var(--surface)] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
