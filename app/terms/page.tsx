import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | FindStudioSpace',
  description:
    'The terms for using FindStudioSpace — acceptable use, listing ownership, Pro subscription terms, and contact information.',
  alternates: { canonical: '/terms' },
}

{/* TODO: confirm this email is monitored before cold email goes out */}
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
          Last updated: April 2026
        </p>

        <section className="mb-8">
          <p className="text-base leading-relaxed">
            These terms govern your use of FindStudioSpace (&ldquo;the site&rdquo;). By using the site
            you agree to them. We&apos;ve written them in plain English.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            What FindStudioSpace is
          </h2>
          <p className="text-base leading-relaxed">
            A directory of creative studio spaces available for monthly rent. We connect people
            looking for space with the operators who run those spaces. We are not a party to the
            rental agreement between a renter and a studio; we are not a broker, landlord, or
            leasing agent.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Acceptable use
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
            <li>Don&apos;t submit listings for spaces you don&apos;t operate or have permission to list.</li>
            <li>Don&apos;t use the inquiry form to send spam, scams, or harassment.</li>
            <li>Don&apos;t scrape the directory at volume. If you want access to the data, ask.</li>
            <li>Don&apos;t try to break, probe, or overload the site.</li>
            <li>Don&apos;t post illegal content or content that infringes someone else&apos;s rights.</li>
          </ul>
          <p className="text-base leading-relaxed mt-3">
            We can remove listings, block accounts, or refuse service for any of the above.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Listing ownership and claiming
          </h2>
          <p className="text-base leading-relaxed">
            If you claim a listing, you&apos;re telling us you operate that studio or have permission
            to represent it. Claiming is passwordless via magic link to an email you control. We can
            ask for reasonable verification at any time. If we have a credible report that a claim is
            fraudulent, we can unclaim the listing and restore it to its pre-claim state.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Content ownership
          </h2>
          <p className="text-base leading-relaxed mb-3">
            Listings in our directory were initially populated from publicly available sources. If
            you are the operator of a studio listed on our site and wish to remove or modify your
            listing, contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--action)' }}>
              {CONTACT_EMAIL}
            </a>{' '}
            &mdash; there is no charge, and we do not require formal proof of ownership beyond
            reasonable verification.
          </p>
          <p className="text-base leading-relaxed mb-3">
            Once you claim a listing and edit it, the content you add &mdash; your description, your
            photos, your contact details &mdash; is yours. By submitting it to the directory, you
            give us a non-exclusive license to display it on the site and in search results and
            social previews pointing to the site. You can ask us to remove your content at any time
            by emailing us; removal takes effect going forward and does not retroactively unpublish
            cached copies held by search engines or third parties.
          </p>
          <p className="text-base leading-relaxed">
            Please don&apos;t upload photos you don&apos;t have the right to use.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Pro subscriptions
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
            <li>
              <strong>Free trial.</strong> Studio Pro includes a 30-day free trial. You will not be
              charged until the trial ends.
            </li>
            <li>
              <strong>Billing.</strong> After the trial, Studio Pro is $29 per month, billed each
              month until you cancel.
            </li>
            <li>
              <strong>Cancellation.</strong> You can cancel at any time from your dashboard or via
              the Stripe billing portal. Pro features remain active through the end of the current
              billing period, then your listing reverts to the free tier.
            </li>
            <li>
              <strong>Refunds.</strong> We do not refund partial months. If you cancel mid-cycle,
              your paid period runs out its term.{' '}
              <a href="/refund-policy" style={{ color: 'var(--action)' }}>
                See our full Refund Policy.
              </a>
            </li>
            <li>
              <strong>Price changes.</strong> If we change pricing for Studio Pro, we&apos;ll email
              existing subscribers at least 30 days before any change takes effect on their
              subscription.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Relationship with studios and renters
          </h2>
          <p className="text-base leading-relaxed">
            We are not a party to any rental agreement, tour, deposit, lease, or transaction between
            a renter and a studio operator. We don&apos;t verify studio operators or the accuracy of
            listing information beyond what&apos;s submitted or publicly available. Use common
            sense: verify the space in person, read any agreement before signing, and don&apos;t send
            money before you&apos;ve done basic diligence.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Disclaimer of warranties
          </h2>
          <p className="text-base leading-relaxed">
            The site is provided &ldquo;as is.&rdquo; We don&apos;t promise the directory is
            complete, that listings are accurate, or that the site will always be available. We do
            our best.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Limitation of liability
          </h2>
          <p className="text-base leading-relaxed">
            To the extent allowed by law, FindStudioSpace is not liable for indirect, incidental,
            consequential, or punitive damages arising out of your use of the site, including but
            not limited to disputes with studio operators or renters. Our total liability to you
            under these terms is limited to the amount you have paid us in the twelve months before
            the claim.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Indemnification
          </h2>
          <p className="text-base leading-relaxed">
            If someone brings a claim against us because of content you submitted, your use of the
            site, or your violation of these terms, you agree to defend and indemnify us for that
            claim, including reasonable legal fees.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Governing law
          </h2>
          <p className="text-base leading-relaxed">
            These terms are governed by the laws of the State of Oregon, without regard to its
            conflict-of-laws rules. Any dispute arising out of or related to these terms or the
            site will be brought in the state or federal courts located in Multnomah County,
            Oregon.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Changes to these terms
          </h2>
          <p className="text-base leading-relaxed">
            We may update these terms as the site evolves. The &ldquo;Last updated&rdquo; date at
            the top reflects the most recent change. If we make a material change, we&apos;ll flag
            it on the site and, for Pro subscribers, by email.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Contact
          </h2>
          <p className="text-base leading-relaxed">
            Questions about these terms, or a dispute you want to raise before litigation:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--action)' }}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  )
}
