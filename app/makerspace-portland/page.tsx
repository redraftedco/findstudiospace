import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CategoryFilter from '@/components/CategoryFilter'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Makerspace for Rent in Portland, OR | Shared Studio & Workshop',
  description:
    'Find makerspace and shared workshop space for rent in Portland, OR. Laser cutters, 3D printers, wood shops, metal shops, and shared fabrication tools. Monthly memberships available.',
  alternates: { canonical: 'https://www.findstudiospace.com/makerspace-portland' },
  openGraph: {
    title: 'Makerspace for Rent in Portland, OR | Shared Studio & Workshop',
    description:
      'Find makerspace and shared workshop space for rent in Portland, OR. Laser cutters, 3D printers, wood shops, metal shops, and shared fabrication tools. Monthly memberships available.',
  },
}

const FAQS = [
  {
    q: 'How much does a makerspace membership cost in Portland per month?',
    a: 'Makerspace memberships in Portland typically range from $75–$400/month depending on access level and included equipment. Basic access (limited hours, shared bench space) starts around $75–$150/month; full-access memberships with 24/7 entry and priority tool reservations run $200–$400/month. Some spaces also offer day passes or project-based access.',
  },
  {
    q: 'What equipment and tools do Portland makerspaces typically include?',
    a: 'Portland makerspaces vary widely but commonly include laser cutters, 3D printers (FDM and resin), CNC routers, woodworking tools (table saw, jointer, planer, bandsaw), metal fab equipment (MIG/TIG welders, plasma cutter), vinyl cutters, and electronics benches. Check the specific listing for what\'s included and what requires certification.',
  },
  {
    q: 'Do I need experience to join a Portland makerspace?',
    a: 'No prior experience is required for most makerspaces. Most offer tool orientations and safety certifications as part of membership — either included or at a small additional cost. Some high-risk equipment (welders, plasma cutters, large CNCs) requires a brief certification before unsupervised use, which is standard practice across the industry.',
  },
  {
    q: 'Are there makerspaces in Portland with dedicated private studio space?',
    a: 'Yes. Some Portland makerspaces offer a hybrid model — shared tool access plus a dedicated private studio or bench that is yours to use without reservations. These are typically more expensive than shared-only memberships but give you a permanent workspace to leave projects in progress.',
  },
  {
    q: 'What neighborhoods in Portland have makerspaces?',
    a: 'Portland makerspaces are concentrated in the Central Eastside Industrial District, NE Portland, and SE Portland — areas with industrial zoning that accommodates power tools, dust, and noise. The Central Eastside has several established shared fab spaces in warehouse buildings with high ceilings and loading access.',
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
    { '@type': 'ListItem', position: 2, name: 'Makerspace Portland' },
  ],
}

export default async function MakerspacePortlandPage() {
  const { data: makerspaceListings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .not('title', 'is', null)
    .not('neighborhood', 'ilike', '%Vancouver%')
    .or(
      'title.ilike.%makerspace%,description.ilike.%makerspace%,' +
      'title.ilike.%maker space%,description.ilike.%maker space%,' +
      'title.ilike.%fabrication%,description.ilike.%fabrication%,' +
      'title.ilike.%laser cutter%,description.ilike.%laser cutter%,' +
      'title.ilike.%3d printer%,description.ilike.%3d printer%,' +
      'title.ilike.%cnc%,description.ilike.%cnc%,' +
      'title.ilike.%wood shop%,description.ilike.%wood shop%,' +
      'title.ilike.%metal shop%,description.ilike.%metal shop%,' +
      'title.ilike.%shared workshop%,description.ilike.%shared workshop%'
    )
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(48)

  const listings = makerspaceListings ?? []

  const itemListSchema = listings.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Makerspace for Rent in Portland, OR',
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
            <span style={{ color: 'var(--ink)' }}>Makerspace</span>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-4 text-3xl font-semibold">
            Makerspace for Rent in Portland, OR
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mb-10 max-w-2xl text-sm leading-relaxed">
            Browse makerspaces and shared fabrication studios available for monthly membership in Portland, OR. Laser cutters, 3D printers, CNC routers, wood shops, and metal fabrication equipment — from casual access memberships to dedicated private bench space. Submit an inquiry from any listing to connect directly with the host.
          </p>

          {listings.length > 0 ? (
            <CategoryFilter listings={listings} />
          ) : (
            <p style={{ color: 'var(--stone)' }} className="mb-14">No makerspaces listed yet — check back soon or browse <Link href="/central-eastside" className="underline">Central Eastside studios</Link>.</p>
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
                { label: 'Workshop Space for Rent', href: '/portland/workshop-space-rental' },
                { label: 'Central Eastside Studios', href: '/central-eastside' },
                { label: 'Industrial Space Portland', href: '/industrial-spaces-portland' },
                { label: 'Alberta Arts District', href: '/alberta-arts-district' },
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
