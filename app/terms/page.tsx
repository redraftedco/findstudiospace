import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | FindStudioSpace',
  description:
    'Terms for using FindStudioSpace, including platform role, user responsibilities, warranties, and limitation of liability.',
  alternates: { canonical: '/terms' },
}

const CONTACT_EMAIL = 'hello@findstudiospace.com'

export default function TermsPage() {
  return (
    <main className="px-6 py-12 md:py-16">
      <article
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          color: 'var(--ink)',
          fontFamily: 'var(--font-body)',
        }}
      >
        <h1
          style={{ fontFamily: 'var(--font-heading)' }}
          className="text-4xl md:text-5xl font-semibold tracking-tight mb-2"
        >
          Terms of Service
        </h1>
        <p style={{ color: 'var(--stone)' }} className="text-sm mb-10">
          Last updated: April 27, 2026
        </p>

        <section className="mb-8">
          <p className="text-base leading-relaxed">
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of FindStudioSpace.
            By using the site, you agree to these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-semibold mb-3">
            Platform role (lead-generation only)
          </h2>
          <p className="text-base leading-relaxed">
            FindStudioSpace is a lead-generation directory. We publish listing information and route
            inquiries to listing contacts. We do not broker deals, process rent, hold deposits,
            guarantee bookings, or act as landlord, tenant, property manager, agent, or fiduciary.
          </p>
        </section>

        <section className="mb-8">
          <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-semibold mb-3">
            User responsibility and assumption of risk
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
            <li>You are responsible for evaluating listings, owners, and any transaction terms.</li>
            <li>You must independently verify identity, pricing, availability, permits, and suitability.</li>
            <li>You assume all risk arising from tours, negotiations, agreements, payments, and occupancy.</li>
            <li>Any agreement is solely between the renter and the listing operator.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-semibold mb-3">
            Listing ownership, claims, and content
          </h2>
          <p className="text-base leading-relaxed mb-3">
            If you claim or submit a listing, you represent that you are authorized to do so and that
            submitted information is accurate to the best of your knowledge. You must update material
            changes promptly.
          </p>
          <p className="text-base leading-relaxed mb-3">
            You retain ownership of content you submit. You grant FindStudioSpace a non-exclusive,
            worldwide license to host, display, and distribute that content as needed to operate and
            market the directory.
          </p>
          <p className="text-base leading-relaxed">
            To request listing edits/removal, email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--action)' }}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-semibold mb-3">
            Acceptable use
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
            <li>No fraudulent listings, impersonation, spam, harassment, or unlawful use.</li>
            <li>No attempts to scrape at volume, probe, disrupt, or bypass security controls.</li>
            <li>No content that infringes intellectual property or privacy rights.</li>
          </ul>
          <p className="text-base leading-relaxed mt-3">
            We may remove content, suspend access, or block use for violations.
          </p>
        </section>

        <section className="mb-8">
          <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-semibold mb-3">
            Subscriptions and billing
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
            <li>Studio Pro includes a 30-day trial, then monthly billing unless canceled.</li>
            <li>You can cancel any time from dashboard/portal; service remains through paid period end.</li>
            <li>Refund terms are in our <Link href="/refund-policy" style={{ color: 'var(--action)' }}>Refund Policy</Link>.</li>
            <li>Price changes for active subscribers are communicated in advance.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-semibold mb-3">
            Disclaimer of warranties (as-is)
          </h2>
          <p className="text-base leading-relaxed">
            The site and all content are provided &quot;as is&quot; and &quot;as available.&quot; To the maximum extent
            allowed by law, we disclaim all warranties (express or implied), including accuracy,
            availability, merchantability, fitness for a particular purpose, and non-infringement.
          </p>
        </section>

        <section className="mb-8">
          <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-semibold mb-3">
            Limitation of liability
          </h2>
          <p className="text-base leading-relaxed mb-3">
            To the maximum extent allowed by law, FindStudioSpace and its operators are not liable
            for indirect, incidental, special, consequential, exemplary, or punitive damages, or for
            lost profits, lost data, lost opportunities, reputational harm, or business interruption.
          </p>
          <p className="text-base leading-relaxed">
            Our total aggregate liability for any claim relating to the site or these Terms is capped
            at the greater of (a) amounts you paid us in the 12 months before the claim, or (b) USD
            $100.
          </p>
        </section>

        <section className="mb-8">
          <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-semibold mb-3">
            Indemnification
          </h2>
          <p className="text-base leading-relaxed">
            You agree to defend, indemnify, and hold harmless FindStudioSpace from claims, damages,
            liabilities, costs, and reasonable legal fees arising from your content, your misuse of
            the site, or your violation of these Terms or applicable law.
          </p>
        </section>

        <section className="mb-8">
          <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-semibold mb-3">
            Governing law
          </h2>
          <p className="text-base leading-relaxed">
            These Terms are governed by Oregon law. Venue for disputes is in state or federal courts
            located in Multnomah County, Oregon, except where prohibited by law.
          </p>
        </section>

        <section className="mb-8">
          <h2 style={{ fontFamily: 'var(--font-heading)' }} className="text-2xl font-semibold mb-3">
            Changes and contact
          </h2>
          <p className="text-base leading-relaxed mb-3">
            We may update these Terms. Continued use after updates means you accept the revised Terms.
          </p>
          <p className="text-base leading-relaxed">
            Questions: <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--action)' }}>{CONTACT_EMAIL}</a>
          </p>
        </section>
      </article>
    </main>
  )
}
