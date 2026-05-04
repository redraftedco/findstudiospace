import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Set Up a Photography Studio on a Budget in Portland | FindStudioSpace',
  description:
    'A practical guide to setting up a photography studio on a budget in Portland, what you actually need, what to rent vs. buy, and how to get started without overspending.',
  alternates: { canonical: 'https://www.findstudiospace.com/blog/photography-studio-setup-budget-portland' },
  openGraph: {
    title: 'How to Set Up a Photography Studio on a Budget in Portland',
    description:
      'What you actually need, what to rent vs. buy, and how to set up a photography studio in Portland without overspending.',
    url: 'https://www.findstudiospace.com/blog/photography-studio-setup-budget-portland',
    type: 'article',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Set Up a Photography Studio on a Budget in Portland',
  datePublished: '2026-05-01',
  dateModified: '2026-05-01',
  author: { '@type': 'Organization', name: 'FindStudioSpace', url: 'https://www.findstudiospace.com' },
  publisher: {
    '@type': 'Organization',
    name: 'FindStudioSpace',
    url: 'https://www.findstudiospace.com',
    logo: { '@type': 'ImageObject', url: 'https://www.findstudiospace.com/og-default.svg' },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.findstudiospace.com/blog/photography-studio-setup-budget-portland' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.findstudiospace.com' },
    { '@type': 'ListItem', position: 2, name: 'Resources', item: 'https://www.findstudiospace.com/blog' },
    { '@type': 'ListItem', position: 3, name: 'Photography Studio Setup on a Budget' },
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
            <span>Photography Studio Setup on a Budget</span>
          </nav>

          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }} className="mb-4 text-xs">May 1, 2026</p>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-8 text-3xl font-semibold leading-tight">
            How to Set Up a Photography Studio on a Budget in Portland
          </h1>

          <div style={{ color: 'var(--ink)' }} className="space-y-6 text-sm leading-relaxed">

            <p>
              A photography studio in Portland doesn&apos;t have to cost a fortune to be functional. The difference between a $500/month setup that produces professional results and a $3,000/month one is mostly branding and polish, not image quality. Here&apos;s how to get started without overspending, and how to know when renting an equipped studio makes more sense than building your own.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Rent vs. build: the honest comparison</h2>

            <p>
              Before you invest in studio gear, run the math on renting versus building. <Link href="/photography-studios-portland" style={{ color: 'var(--ink)' }} className="underline">Photography studios in Portland</Link> rent for $800–$2,500/month equipped, or $35–$150/hour for occasional use. If you&apos;re shooting fewer than 20 hours per month, renting by the hour is almost always cheaper than maintaining your own space, and you get access to cyclorama walls, strobe kits, and backdrops you couldn&apos;t justify buying outright.
            </p>
            <p>
              Build your own studio when: you&apos;re shooting more than 40 hours per month, you need a controlled environment you can leave set up between sessions, or your work requires specialized infrastructure (a permanent product photography setup, a specific background wall color, a shooting table you&apos;ve built yourself).
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">What you actually need vs. nice-to-have</h2>

            <p><strong>The non-negotiables for a functional photo studio:</strong></p>
            <ul className="space-y-2 pl-4">
              <li>A room with controllable light (blackout curtains or a windowless space)</li>
              <li>At least one strobe or LED monolight with a light stand and modifier (umbrella, softbox, or beauty dish)</li>
              <li>A white or gray seamless paper background (9-foot wide roll on a background stand system)</li>
              <li>V-flats, two large white/black foam core boards for fill and negative fill. You can make these for $30 total from Dollar Tree foam core.</li>
              <li>A reflector (5-in-1 collapsible reflector, ~$25)</li>
              <li>An extension cord and power strip</li>
            </ul>

            <p><strong>Useful but not essential to start:</strong></p>
            <ul className="space-y-2 pl-4">
              <li>A second strobe for background separation or hair light</li>
              <li>A boom arm (useful for hair lights, over-head shots)</li>
              <li>Colored seamless paper backgrounds beyond white/gray</li>
              <li>A shooting table (for product work)</li>
              <li>A tethering station (laptop on a stand for live review with clients)</li>
              <li>An air conditioner, strobes and subjects generate heat</li>
            </ul>

            <p><strong>Do not spend money on early:</strong></p>
            <ul className="space-y-2 pl-4">
              <li>A cyclorama wall (concrete + labor project, $5,000+). Rent a cyc when you need one.</li>
              <li>High-end continuous LED panels before you&apos;ve confirmed you prefer continuous over strobes for your work</li>
              <li>Backdrop storage systems before you know which backgrounds you actually use</li>
            </ul>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Budget gear that actually works</h2>

            <p>
              Lighting gear quality has improved dramatically at the low end. These are honest recommendations for photographers on tight budgets:
            </p>
            <ul className="space-y-2 pl-4">
              <li><strong>Strobe:</strong> Godox AD200 or AD300 Pro (~$300–$400). Battery-powered, portable, HSS-capable, TTL or manual. Exceptional for the price. Triggers work with most camera systems.</li>
              <li><strong>Monolight:</strong> Godox SK400II (~$150) for a studio-only setup. Slower recycle time than the AD series but very reliable for portraits and product work.</li>
              <li><strong>Modifiers:</strong> Godox and Glow brand softboxes are adequate starting gear. A 24&quot;×36&quot; softbox is versatile. An octabox (90cm or 120cm) is better for portraits.</li>
              <li><strong>Seamless paper:</strong> Savage Widetone or BD Backlite paper, purchase in-store at Blick Art Materials on NW Couch or online. White and gray first, colors later.</li>
              <li><strong>Background stand:</strong> Neewer or Impact brand, both adequate. Do not buy the cheapest available; flimsy stands fall over and damage gear.</li>
            </ul>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Space requirements by use case</h2>

            <ul className="space-y-3 pl-4">
              <li>
                <strong>Portrait / headshot studio:</strong> 200–300 sq ft minimum. You need roughly 8 feet between your subject and the background, 6–8 feet between you and your subject, and room for lights on both sides. A 12×20 foot room works well.
              </li>
              <li>
                <strong>Full-length fashion / editorial:</strong> 400+ sq ft. You need vertical room (10+ foot ceilings for boom lights), horizontal distance for full-body shots, and enough background width for movement. This is where a rented cyclorama wall beats a DIY setup.
              </li>
              <li>
                <strong>Product photography:</strong> 150–250 sq ft. Smaller footprint, but you may need specialized shooting surfaces and consistent lighting setups you can leave in place. A dedicated product room that stays set up between shoots is extremely useful.
              </li>
              <li>
                <strong>E-commerce product:</strong> Sometimes as small as 100 sq ft, a shooting table, a lightbox or scrim tent, and consistent light. Highly repeatable, space-efficient work.
              </li>
            </ul>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">When to rent a studio instead</h2>

            <p>
              Rent a studio when you need equipment you don&apos;t own and can&apos;t justify buying: a cyclorama wall for a fashion campaign, a 1,000 sq ft production space for a large crew shoot, or a fully equipped commercial kitchen for food photography. Portland has <Link href="/photography-studios-portland" style={{ color: 'var(--ink)' }} className="underline">photography studios available for day and month rental</Link>, it often makes more financial sense to rent the specific infrastructure for the shoot than to build and maintain it yourself.
            </p>

            <div style={{ borderTop: '1px solid var(--rule)' }} className="mt-12 pt-8">
              <p style={{ color: 'var(--stone)' }} className="text-sm">
                Browse <Link href="/photography-studios-portland" style={{ color: 'var(--ink)' }} className="underline">photography studios for rent in Portland</Link>, monthly and day-rate options.
              </p>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
