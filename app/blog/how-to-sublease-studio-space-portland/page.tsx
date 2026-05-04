import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Sublease a Studio Space in Portland, OR | FindStudioSpace',
  description:
    'A practical guide to subleasing a studio space in Portland, getting landlord approval, setting a price, finding a subtenant, and documenting the arrangement.',
  alternates: { canonical: 'https://www.findstudiospace.com/blog/how-to-sublease-studio-space-portland' },
  openGraph: {
    title: 'How to Sublease a Studio Space in Portland, OR',
    description:
      'How to sublease a studio in Portland legally, landlord approval, pricing, finding a subtenant, and what to put in writing.',
    url: 'https://www.findstudiospace.com/blog/how-to-sublease-studio-space-portland',
    type: 'article',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Sublease a Studio Space in Portland, OR',
  datePublished: '2026-05-01',
  dateModified: '2026-05-01',
  author: { '@type': 'Organization', name: 'FindStudioSpace', url: 'https://www.findstudiospace.com' },
  publisher: {
    '@type': 'Organization',
    name: 'FindStudioSpace',
    url: 'https://www.findstudiospace.com',
    logo: { '@type': 'ImageObject', url: 'https://www.findstudiospace.com/og-default.svg' },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.findstudiospace.com/blog/how-to-sublease-studio-space-portland' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.findstudiospace.com' },
    { '@type': 'ListItem', position: 2, name: 'Resources', item: 'https://www.findstudiospace.com/blog' },
    { '@type': 'ListItem', position: 3, name: 'How to Sublease a Studio Space in Portland' },
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
            <span>How to Sublease a Studio in Portland</span>
          </nav>

          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }} className="mb-4 text-xs">May 1, 2026</p>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-8 text-3xl font-semibold leading-tight">
            How to Sublease a Studio Space in Portland, OR
          </h1>

          <div style={{ color: 'var(--ink)' }} className="space-y-6 text-sm leading-relaxed">

            <p>
              Subleasing, renting your studio to someone else while you remain the primary tenant on the lease, is common in Portland&apos;s creative community. Artists go on residencies, travel for projects, take on teaching positions, or simply find that their space is larger than they need full-time. A properly structured sublease protects both you and your subtenant. Here&apos;s how to do it correctly.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Step 1: Check your lease before doing anything</h2>

            <p>
              The most common sublease mistake is assuming it&apos;s allowed. Read your lease. Commercial leases in Oregon frequently prohibit subletting without explicit landlord consent. Some prohibit it entirely. Subleasing without permission is a lease violation that can result in termination of your tenancy, including loss of your studio deposit.
            </p>
            <p>
              If your lease is silent on subletting, it&apos;s not automatically permitted. Commercial tenancy law in Oregon does not give tenants a default right to sublet. Silence means you need to ask.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Step 2: Get landlord approval in writing</h2>

            <p>
              Contact your landlord with a clear, professional request. Include:
            </p>
            <ul className="space-y-2 pl-4">
              <li>The dates of the proposed sublease</li>
              <li>Who the subtenant is (name, contact info, what they do)</li>
              <li>How the space will be used during the sublease period</li>
              <li>Confirmation that you remain responsible for rent and any damage</li>
            </ul>
            <p>
              Most Portland landlords who rent to creatives have seen this request before and will approve it, especially for short-term subleases (30–90 days). Frame it as reducing their vacancy risk rather than asking a favor. Get the approval in writing, an email is sufficient, but keep it.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Step 3: Set a fair price</h2>

            <p>
              Sublease pricing in Portland creative studios typically runs at or slightly below market rate. You can charge up to what you pay, but charging significantly above your rent is ethically murky and can damage your relationship with both the landlord and the subtenant if it comes out.
            </p>
            <p>
              Common structures:
            </p>
            <ul className="space-y-2 pl-4">
              <li><strong>Pass-through:</strong> The subtenant pays exactly what you pay. Simple, transparent. You break even on rent for the period and get your studio covered while you&apos;re away.</li>
              <li><strong>Partial sublease:</strong> You split the studio, they use it certain days or hours, you keep the rest. Price proportionally to the access they&apos;re getting.</li>
              <li><strong>Market rate:</strong> If you negotiated below-market rent and the space is worth more, charging market rate is reasonable, but disclose this dynamic to your subtenant.</li>
            </ul>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Step 4: Find a subtenant</h2>

            <p>
              The best subtenants are people already in your network, other artists in the building, members of organizations you belong to, people you&apos;ve worked with. They come pre-vetted, are less likely to cause problems with the landlord, and are easier to address if issues arise.
            </p>
            <p>
              If you need to post publicly: <Link href="/portland" style={{ color: 'var(--ink)' }} className="underline">FindStudioSpace</Link> accepts sublease listings, as does Craigslist (commercial &gt; office section) and Portland-specific Facebook groups for artists and makers. Be specific about the space, the dates, and what&apos;s included, vague listings attract the wrong inquiries.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Step 5: Write a sublease agreement</h2>

            <p>
              A written sublease agreement doesn&apos;t need to be complex, but it needs to cover the basics:
            </p>
            <ul className="space-y-2 pl-4">
              <li>Names of both parties and the address of the space</li>
              <li>Dates of the sublease (start and end)</li>
              <li>Monthly rent, due date, and payment method</li>
              <li>Security deposit amount and refund conditions</li>
              <li>Permitted uses and any restrictions that carry over from your primary lease</li>
              <li>Access hours and access method</li>
              <li>Who is responsible for what, utilities during the period, maintenance reporting, etc.</li>
              <li>What happens if the subtenant causes damage (you&apos;re on the hook with the landlord, so you need a clear path to recover from the subtenant)</li>
              <li>Notice requirements to exit</li>
            </ul>
            <p>
              Boilerplate sublease templates are available from Oregon&apos;s Small Business Development Center network and from legal aid organizations in Portland. For anything longer than 90 days, it&apos;s worth having a commercial attorney review the document.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">What you remain responsible for</h2>

            <p>
              As the primary tenant, you remain fully responsible to your landlord for rent, damage, and compliance with the lease terms, regardless of what your subtenant does. If your subtenant stops paying you, you still owe rent to the landlord. If your subtenant damages the space, you owe the landlord for repairs. Structure your sublease so that you can recover from the subtenant in these scenarios, and collect a security deposit from them at the outset.
            </p>

            <div style={{ borderTop: '1px solid var(--rule)' }} className="mt-12 pt-8">
              <p style={{ color: 'var(--stone)' }} className="text-sm">
                Listing a studio for sublease? <Link href="/list-your-space" style={{ color: 'var(--ink)' }} className="underline">List your space on FindStudioSpace</Link>, free to list, no commission.
              </p>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
