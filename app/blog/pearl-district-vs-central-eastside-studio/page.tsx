import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pearl District vs. Central Eastside: Which Is Right for Your Studio? | FindStudioSpace',
  description:
    "Comparing Portland's two top studio neighborhoods, Pearl District and the Central Eastside Industrial District. Prices, character, and who belongs where.",
  alternates: { canonical: 'https://www.findstudiospace.com/blog/pearl-district-vs-central-eastside-studio' },
  openGraph: {
    title: 'Pearl District vs. Central Eastside: Which Is Right for Your Studio?',
    description:
      "Comparing Portland's two top studio neighborhoods, price, character, and who belongs where.",
    url: 'https://www.findstudiospace.com/blog/pearl-district-vs-central-eastside-studio',
    type: 'article',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Pearl District vs. Central Eastside: Which Is Right for Your Studio?',
  datePublished: '2026-05-01',
  dateModified: '2026-05-01',
  author: { '@type': 'Organization', name: 'FindStudioSpace', url: 'https://www.findstudiospace.com' },
  publisher: {
    '@type': 'Organization',
    name: 'FindStudioSpace',
    url: 'https://www.findstudiospace.com',
    logo: { '@type': 'ImageObject', url: 'https://www.findstudiospace.com/og-default.svg' },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.findstudiospace.com/blog/pearl-district-vs-central-eastside-studio' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.findstudiospace.com' },
    { '@type': 'ListItem', position: 2, name: 'Resources', item: 'https://www.findstudiospace.com/blog' },
    { '@type': 'ListItem', position: 3, name: 'Pearl District vs. Central Eastside' },
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
            <span>Pearl District vs. Central Eastside</span>
          </nav>

          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }} className="mb-4 text-xs">May 1, 2026</p>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-8 text-3xl font-semibold leading-tight">
            Pearl District vs. Central Eastside: Which Is Right for Your Studio?
          </h1>

          <div style={{ color: 'var(--ink)' }} className="space-y-6 text-sm leading-relaxed">

            <p>
              Portland&apos;s two most active creative districts are separated by the Willamette River and about $600/month. The <Link href="/portland/pearl-district" style={{ color: 'var(--ink)' }} className="underline">Pearl District</Link> is polished, client-facing, and priced accordingly. The <Link href="/central-eastside" style={{ color: 'var(--ink)' }} className="underline">Central Eastside Industrial District</Link> is working, raw, and one of the better values in Portland for studio space. Neither is universally better, the right answer depends on what you do and who you need to impress.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Price comparison</h2>

            <p>The gap is significant:</p>
            <ul className="space-y-2 pl-4">
              <li><strong>Pearl District:</strong> $1,200–$3,500/month for creative offices and studio space. Photography and production studios with polished finishes run toward the top of that range. Smaller private art studios rarely appear below $900/month.</li>
              <li><strong>Central Eastside:</strong> $500–$2,500/month. Small private studios and workshop bays start around $500–$700; large warehouse bays with loading docks and 220v power run $1,500–$2,500+. More space for the dollar across the board.</li>
            </ul>
            <p>
              For the same $1,200/month, you&apos;ll rent roughly 200 sq ft in the Pearl or 400–600 sq ft in the Central Eastside. If you&apos;re doing production work, fabrication, or anything that benefits from space, the math runs heavily in the CEID&apos;s favor.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Character and environment</h2>

            <p>
              The Pearl District feels like a designed neighborhood, galleries, restaurants, boutiques, new residential towers, and well-maintained streetscapes. The buildings are cleaner and quieter. Client visits feel professional. It&apos;s a good address if your clients care about addresses.
            </p>
            <p>
              The Central Eastside is a working district. Loading docks, delivery trucks, salvage yards, breweries, and fabrication shops share blocks with photo studios and creative agencies. It&apos;s louder. Parking is easier. The buildings are older and often more interesting. If you do physical work, the industrial infrastructure (drive-in access, high ceilings, concrete floors) actually serves your practice rather than fighting it.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Who belongs in each</h2>

            <p><strong>Pearl District is the better fit if you:</strong></p>
            <ul className="space-y-2 pl-4">
              <li>Meet clients at your studio regularly and need the space to make an impression</li>
              <li>Run a design studio, architecture firm, or creative consultancy with a client-facing identity</li>
              <li>Need a photo studio for editorial or commercial work where polished presentation matters</li>
              <li>Want walkable lunch options and a neighborhood that feels alive during business hours</li>
            </ul>

            <p><strong>Central Eastside is the better fit if you:</strong></p>
            <ul className="space-y-2 pl-4">
              <li>Make physical things, furniture, ceramics, sculpture, fabricated goods, and need space and infrastructure over polish</li>
              <li>Do production work (photography, video, podcasting) where you control the environment regardless of the building exterior</li>
              <li>Want 24-hour access, loading dock capability, or drive-in bays</li>
              <li>Are working on a tight budget and need more square footage per dollar</li>
              <li>Want to be surrounded by other working artists and makers rather than galleries and boutiques</li>
            </ul>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Transit and parking</h2>

            <p>
              The Pearl District has excellent transit (streetcar, multiple bus lines) but street parking is limited and garages are expensive, a real concern if you move materials regularly. The Central Eastside has easier and often free street parking, especially on side streets east of Grand Avenue. Both are bikeable from most Portland neighborhoods. The Morrison, Burnside, and Hawthorne bridges connect the Central Eastside directly to downtown in under 10 minutes by bike.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">The verdict by use case</h2>

            <ul className="space-y-3 pl-4">
              <li><strong>Photographer, editorial/commercial:</strong> Pearl for client-facing work; CEID if you prioritize ceiling height, loading access, or a larger shooting area.</li>
              <li><strong>Ceramicist / sculptor / fabricator:</strong> Central Eastside, unambiguously. Industrial zoning, loading access, fewer noise complaints.</li>
              <li><strong>Creative agency or design studio:</strong> Pearl if clients visit frequently; CEID if most work is remote and you want more space for the money.</li>
              <li><strong>Painter / visual artist:</strong> Either works. Alberta Arts District is worth considering as a third option, community, natural light, more affordable.</li>
              <li><strong>Podcast / video production:</strong> Central Eastside. Acoustic treatment and production quality matter more than neighborhood polish.</li>
            </ul>

            <div style={{ borderTop: '1px solid var(--rule)' }} className="mt-12 pt-8">
              <p style={{ color: 'var(--stone)' }} className="text-sm">
                Browse <Link href="/portland/pearl-district" style={{ color: 'var(--ink)' }} className="underline">Pearl District studios</Link> and{' '}
                <Link href="/central-eastside" style={{ color: 'var(--ink)' }} className="underline">Central Eastside studios</Link> on FindStudioSpace.
              </p>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
