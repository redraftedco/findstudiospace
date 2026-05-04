import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.findstudiospace.com/blog/studio-space-cost-portland' },
  title: 'How Much Does Studio Space Cost in Portland, OR? | FindStudioSpace',
  description:
    'Current price ranges for art studios, workshops, photo studios, offices, and rehearsal rooms in Portland, OR. What to expect by space type and neighborhood.',
  openGraph: {
    title: 'How Much Does Studio Space Cost in Portland, OR?',
    description:
      'Current price ranges for art studios, workshops, photo studios, offices, and rehearsal rooms in Portland. What to expect by space type and neighborhood.',
    url: 'https://www.findstudiospace.com/blog/studio-space-cost-portland',
    type: 'article',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How Much Does Studio Space Cost in Portland, OR?',
  datePublished: '2025-04-12',
  dateModified: '2026-05-01',
  author: { '@type': 'Organization', name: 'FindStudioSpace', url: 'https://www.findstudiospace.com' },
  publisher: { '@type': 'Organization', name: 'FindStudioSpace', url: 'https://www.findstudiospace.com', logo: { '@type': 'ImageObject', url: 'https://www.findstudiospace.com/og-default.svg' } },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.findstudiospace.com/blog/studio-space-cost-portland' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.findstudiospace.com' },
    { '@type': 'ListItem', position: 2, name: 'Resources', item: 'https://www.findstudiospace.com/blog' },
    { '@type': 'ListItem', position: 3, name: 'Studio Space Cost in Portland' },
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
          <span>Studio Space Cost in Portland</span>
        </nav>

        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }} className="mb-4 text-xs">April 2025</p>

        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-6 text-3xl font-semibold leading-tight">
          How Much Does Studio Space Cost in Portland, OR?
        </h1>

        <p style={{ color: 'var(--stone)' }} className="mb-8 text-sm leading-relaxed">
          Portland&apos;s creative workspace market covers a wide range, from $150/month shared ceramics co-ops to $3,000+/month private warehouse bays. What you pay depends mostly on space type, size, and neighborhood. Here are current price ranges across the categories we list.
        </p>

        <div style={{ borderTop: '1px solid var(--rule)' }} className="space-y-10 pt-10">

          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-3 text-xl font-semibold">
              Art Studios
            </h2>
            <p style={{ color: 'var(--stone)' }} className="mb-3 text-sm leading-relaxed">
              <strong style={{ color: 'var(--ink)' }}>Typical range: $200–$800/month</strong>
            </p>
            <p style={{ color: 'var(--stone)' }} className="text-sm leading-relaxed">
              Private art studios in Portland, a dedicated room with your own key, run $350–$700/month for a mid-size space. Shared co-op arrangements, where you have a designated area within a larger studio, start lower, sometimes $150–$300/month. Studios with north-facing natural light, ventilation for messy work, and 24-hour access command the higher end. Expect to pay more in the Pearl District or NW Portland; better value in NE and SE.
            </p>
            <p style={{ color: 'var(--stone)' }} className="mt-3 text-sm">
              <Link href="/portland/art-studio-rental" style={{ color: 'var(--lime)' }} className="hover:underline">Browse art studios for rent in Portland →</Link>
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-3 text-xl font-semibold">
              Workshop and Fabrication Space
            </h2>
            <p style={{ color: 'var(--stone)' }} className="mb-3 text-sm leading-relaxed">
              <strong style={{ color: 'var(--ink)' }}>Typical range: $400–$2,000/month</strong>
            </p>
            <p style={{ color: 'var(--stone)' }} className="text-sm leading-relaxed">
              Workshop space pricing is driven by infrastructure: 220v power, ceiling height, roll-up door access, dust collection, and concrete floors all push rates up. Smaller shop bays (400–600 sq ft) run $400–$900/month. Larger industrial spaces with loading dock access and full infrastructure run $1,200–$2,500/month. The Central Eastside Industrial District and inner SE are the best places to look. Shared makerspace memberships are an option starting around $100–$250/month, but these typically don&apos;t offer private lockable space.
            </p>
            <p style={{ color: 'var(--stone)' }} className="mt-3 text-sm">
              <Link href="/portland/workshop-space-rental" style={{ color: 'var(--lime)' }} className="hover:underline">Browse workshop space for rent in Portland →</Link>
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-3 text-xl font-semibold">
              Photo Studios
            </h2>
            <p style={{ color: 'var(--stone)' }} className="mb-3 text-sm leading-relaxed">
              <strong style={{ color: 'var(--ink)' }}>Typical range: $600–$2,500/month</strong>
            </p>
            <p style={{ color: 'var(--stone)' }} className="text-sm leading-relaxed">
              Monthly photo studio rentals depend heavily on what&apos;s included. A bare room with good light runs $600–$900/month. A fully equipped space with seamless paper, strobes, and a cyclorama wall runs $1,500–$2,500/month. Production studios with hair and makeup stations and client lounge areas are at the top of the range. If you need a studio occasionally rather than full-time, ask hosts about part-time arrangements, some will negotiate shared access at a lower rate.
            </p>
            <p style={{ color: 'var(--stone)' }} className="mt-3 text-sm">
              <Link href="/portland/photo-studio-rental" style={{ color: 'var(--lime)' }} className="hover:underline">Browse photo studios for rent in Portland →</Link>
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-3 text-xl font-semibold">
              Creative Offices
            </h2>
            <p style={{ color: 'var(--stone)' }} className="mb-3 text-sm leading-relaxed">
              <strong style={{ color: 'var(--ink)' }}>Typical range: $500–$2,000/month</strong>
            </p>
            <p style={{ color: 'var(--stone)' }} className="text-sm leading-relaxed">
              Creative office space, private rooms in commercial buildings, rather than coworking desks, runs $500–$1,200/month for a small private office or suite. Larger spaces with multiple rooms, reception areas, or client-facing features run higher. Pearl District offices are at the top; Central Eastside and NE Portland offer comparable quality for less. Month-to-month terms are common for smaller suites; larger spaces often require a 6–12 month commitment.
            </p>
            <p style={{ color: 'var(--stone)' }} className="mt-3 text-sm">
              <Link href="/portland/office-space-rental" style={{ color: 'var(--lime)' }} className="hover:underline">Browse creative office space in Portland →</Link>
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-3 text-xl font-semibold">
              Music Rehearsal Space
            </h2>
            <p style={{ color: 'var(--stone)' }} className="mb-3 text-sm leading-relaxed">
              <strong style={{ color: 'var(--ink)' }}>Typical range: $250–$700/month</strong>
            </p>
            <p style={{ color: 'var(--stone)' }} className="text-sm leading-relaxed">
              Monthly lockout rehearsal rooms, private, 24/7 access, your gear stays set up, run $300–$600/month for a small to medium room. Rooms large enough for a full band with a drum kit and backline run $450–$700/month. If you only need access a few times per week, some studios offer shared rehearsal blocks for $100–$200/month. Confirm soundproofing quality and whether drum kits are permitted before committing.
            </p>
            <p style={{ color: 'var(--stone)' }} className="mt-3 text-sm">
              <Link href="/portland/music-rehearsal-space" style={{ color: 'var(--lime)' }} className="hover:underline">Browse music rehearsal space in Portland →</Link>
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-3 text-xl font-semibold">
              What Drives Price Up or Down
            </h2>
            <p style={{ color: 'var(--stone)' }} className="text-sm leading-relaxed">
              Across all space types, the same factors determine where a listing falls in its range:
            </p>
            <ul style={{ color: 'var(--stone)' }} className="mt-3 space-y-2 text-sm">
              <li><strong style={{ color: 'var(--ink)' }}>Neighborhood.</strong> Pearl District and NW Portland are the most expensive. Central Eastside, NE, and N Portland offer good value. SE Portland is middle ground.</li>
              <li><strong style={{ color: 'var(--ink)' }}>Infrastructure.</strong> 220v power, roll-up door, ventilation system, sprung floor, cyclorama wall, specialized features add to the base rate.</li>
              <li><strong style={{ color: 'var(--ink)' }}>What&apos;s included.</strong> Utilities, internet, parking, equipment, and materials storage all affect the real cost. A higher-priced listing that includes utilities and parking may be cheaper than a lower-priced one with add-ons.</li>
              <li><strong style={{ color: 'var(--ink)' }}>Term flexibility.</strong> Month-to-month costs more than a 6-month or annual commitment. If you know you&apos;ll stay, ask about a longer-term rate.</li>
              <li><strong style={{ color: 'var(--ink)' }}>Size.</strong> Square footage is not always listed, but it&apos;s worth asking. A larger space at a lower per-square-foot rate may be better value than a smaller space at the top of its range.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-3 text-xl font-semibold">
              How to Get the Right Price
            </h2>
            <p style={{ color: 'var(--stone)' }} className="text-sm leading-relaxed">
              Most studio rents in Portland are negotiable, especially for longer terms or immediate move-in. When you submit an inquiry, include your preferred start date, how long you intend to stay, and what you need the space for. Hosts who see a qualified, specific tenant are more likely to work on price than those responding to a vague inquiry.
            </p>
            <p style={{ color: 'var(--stone)' }} className="mt-4 text-sm leading-relaxed">
              If a listing doesn&apos;t show a price, ask. Some hosts leave pricing off intentionally to qualify inquiries, they&apos;re not hiding bad news, they&apos;re filtering for serious tenants.
            </p>
          </section>

        </div>

        <div style={{ borderTop: '1px solid var(--rule)' }} className="mt-12 pt-10">
          <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mb-4 text-xs uppercase tracking-wider">Browse by type</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Art Studios', href: '/portland/art-studio-rental' },
              { label: 'Workshop Space', href: '/portland/workshop-space-rental' },
              { label: 'Photo Studios', href: '/portland/photo-studio-rental' },
              { label: 'Office Space', href: '/portland/office-space-rental' },
              { label: 'Music Rehearsal', href: '/portland/music-rehearsal-space' },
              { label: 'Fitness & Dance', href: '/portland/fitness-studio-rental' },
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
