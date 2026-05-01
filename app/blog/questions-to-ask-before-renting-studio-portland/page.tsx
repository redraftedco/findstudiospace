import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '12 Questions to Ask Before Renting a Studio Space in Portland | FindStudioSpace',
  description:
    'Before you sign a studio lease in Portland, ask these 12 questions. Access hours, utilities, permitted uses, storage, and what must be in writing.',
  alternates: { canonical: 'https://www.findstudiospace.com/blog/questions-to-ask-before-renting-studio-portland' },
  openGraph: {
    title: '12 Questions to Ask Before Renting a Studio Space in Portland',
    description:
      'Before you sign a studio lease in Portland, ask these 12 questions — access hours, utilities, permitted uses, storage, and what must be in writing.',
    url: 'https://www.findstudiospace.com/blog/questions-to-ask-before-renting-studio-portland',
    type: 'article',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '12 Questions to Ask Before Renting a Studio Space in Portland',
  datePublished: '2026-05-01',
  dateModified: '2026-05-01',
  author: { '@type': 'Organization', name: 'FindStudioSpace', url: 'https://www.findstudiospace.com' },
  publisher: {
    '@type': 'Organization',
    name: 'FindStudioSpace',
    url: 'https://www.findstudiospace.com',
    logo: { '@type': 'ImageObject', url: 'https://www.findstudiospace.com/og-default.svg' },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.findstudiospace.com/blog/questions-to-ask-before-renting-studio-portland' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.findstudiospace.com' },
    { '@type': 'ListItem', position: 2, name: 'Resources', item: 'https://www.findstudiospace.com/blog' },
    { '@type': 'ListItem', position: 3, name: '12 Questions Before Renting a Studio' },
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
            <span>12 Questions Before Renting</span>
          </nav>

          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }} className="mb-4 text-xs">May 1, 2026</p>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-8 text-3xl font-semibold leading-tight">
            12 Questions to Ask Before Renting a Studio Space in Portland
          </h1>

          <div style={{ color: 'var(--ink)' }} className="space-y-6 text-sm leading-relaxed">

            <p>
              Most studio listings are thin on detail. Landlords post photos, a price, and a square footage — and leave the rest to be figured out during the viewing or, worse, after you&apos;ve signed. These 12 questions will surface the information that actually determines whether a space works for your practice before you commit.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">1. What are the access hours?</h2>
            <p>
              Many shared buildings default to 7am–10pm access even when they don&apos;t advertise it. If you work early mornings, late nights, or weekends on irregular schedules, confirm access hours explicitly. 24-hour keycard access is available in most industrial and commercial buildings in Portland — but you have to ask for it, and sometimes pay a small additional fee.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">2. What&apos;s included in the monthly rent?</h2>
            <p>
              Utilities — electricity, water, heat, internet — vary widely. Some Portland studios include everything; others meter electricity separately, which matters enormously if you run power-hungry equipment (kilns, compressors, grow lights, welders). Get an itemized list of what&apos;s included and what&apos;s billed separately before comparing prices across listings.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">3. What are the permitted uses?</h2>
            <p>
              This is the most commonly glossed-over question and the most important one for working artists and makers. Some buildings prohibit noise above a threshold, restrict commercial client visits, bar certain materials (aerosols, resins, flammable solvents), or limit operating hours for loud tools. If you plan to use the space in a non-standard way, get written confirmation that it&apos;s permitted before you sign.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">4. Who handles maintenance — and how quickly?</h2>
            <p>
              In shared buildings, responsibility for maintenance is frequently ambiguous. Ask who to contact for HVAC issues, plumbing problems, broken locks, and pest problems. Ask how quickly they typically respond. A building where the landlord lives out of state and relies on a property manager who relies on a contractor is a building where small problems linger for weeks.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">5. Is there storage, and is it secure?</h2>
            <p>
              For artists and makers, secure storage is often as important as working space. Ask whether you get dedicated storage (locked room or cage), access to shared building storage, or neither. Also ask whether your working space itself locks securely — building common areas accessible to all tenants are not appropriate for storing materials or finished work overnight.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">6. Who are the other tenants?</h2>
            <p>
              The character of a building is largely determined by who else is in it. A photography studio sharing a building with a woodshop is going to have dust in the air. A ceramics studio adjacent to a live music rehearsal space will have sound bleed. Ask who your immediate neighbors are and what they do. If you can, visit during business hours to get a feel for the actual noise and activity level.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">7. What are the lease terms and notice requirements?</h2>
            <p>
              Month-to-month vs. annual makes a significant difference in flexibility and price. Oregon commercial tenants on month-to-month arrangements are entitled to 90 days&apos; notice before a rent increase. Get the lease term, required notice to vacate, and the landlord&apos;s notice requirements to you — all in writing.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">8. Is the building code-compliant for your intended use?</h2>
            <p>
              Some Portland buildings have open code violations or occupancy issues that the landlord hasn&apos;t disclosed. For spaces where fire safety matters — anything involving flammable materials, kiln use, or densely occupied buildings — ask directly whether the building has any open violations. You can also look up Portland&apos;s development permit database online before signing.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">9. Can I have guests and clients on-site?</h2>
            <p>
              If you plan to have customers, collectors, shoot clients, or students visit your studio, confirm this is permitted. Some residential-adjacent buildings restrict commercial client traffic. Others have guest policies (sign in at the front desk, limited hours). A studio where you can&apos;t bring clients is a very different asset than one where you can.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">10. Has the building had flooding, pest, or structural issues?</h2>
            <p>
              Portland&apos;s older commercial and industrial buildings have histories. Basement studios flood. Older buildings have rodent pressure. Some industrial spaces have soil contamination from prior tenants. These problems tend to recur — ask directly, and listen for hesitation in the answer. The landlord&apos;s reaction to the question tells you as much as the answer.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">11. What happens if I need to exit early?</h2>
            <p>
              On a month-to-month lease, early exit is generally just a matter of giving the agreed notice (typically 30 days). On an annual lease, the terms vary — some landlords allow subletting, others require you to find a replacement tenant, others hold you to the full term. Know what your exit looks like before you sign, especially on any agreement longer than month-to-month.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">12. Is there parking, and who has access to it?</h2>
            <p>
              Parking matters more for makers than for most creative professionals. If you regularly transport large materials, finished goods, or equipment, on-site or immediately adjacent parking is a real operational consideration. Confirm whether designated parking is included, how many spots, and whether loading zones are available for deliveries and pickups.
            </p>

            <div style={{ borderTop: '1px solid var(--rule)' }} className="mt-12 pt-8">
              <p style={{ color: 'var(--stone)' }} className="text-sm">
                Browse <Link href="/portland" style={{ color: 'var(--ink)' }} className="underline">studio space for rent in Portland</Link>. Related:{' '}
                <Link href="/blog/how-to-negotiate-studio-lease-portland" style={{ color: 'var(--ink)' }} className="underline">How to negotiate a studio lease</Link> ·{' '}
                <Link href="/blog/how-to-find-studio-space-portland" style={{ color: 'var(--ink)' }} className="underline">How to find studio space in Portland</Link>
              </p>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
