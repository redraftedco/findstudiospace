import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | FindStudioSpace',
  description:
    'How FindStudioSpace collects, uses, and protects information. Plain-language summary of data practices, third-party services, and how to request removal of a listing.',
  alternates: { canonical: '/privacy' },
}

const CONTACT_EMAIL = 'hello@findstudiospace.com'

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--stone)' }} className="text-sm mb-10">
          Last updated: April 2026
        </p>

        <section className="mb-8">
          <p className="text-base leading-relaxed mb-4">
            FindStudioSpace is a directory of creative studio spaces available for monthly rent.
            This policy describes what information we collect, how we use it, and what choices you have.
            We wrote this in plain English. If anything is unclear, email us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--action)' }}>
              {CONTACT_EMAIL}
            </a>.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            What we collect
          </h2>
          <p className="text-base leading-relaxed mb-3">
            We collect a limited set of information to run the directory:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
            <li>
              <strong>Listing data.</strong> Studio name, location, price, photos, description, and
              contact details either submitted by a studio operator or initially populated from
              publicly available sources (see &ldquo;Requesting removal of your listing&rdquo; below).
            </li>
            <li>
              <strong>Inquiry submissions.</strong> When a renter contacts a studio through our form,
              we store their name, email, and message so we can forward the inquiry to the studio
              and keep a record for attribution.
            </li>
            <li>
              <strong>View counts.</strong> We count how many times each listing is viewed. To avoid
              inflating the count from the same visitor, we set a signed cookie and store a
              short-lived hash of the visitor&apos;s IP address. We do not store raw IPs.
            </li>
            <li>
              <strong>Account data for claimed listings.</strong> If a studio operator claims their
              listing, we store their email and a Supabase-issued user ID. Authentication is
              passwordless via magic link.
            </li>
            <li>
              <strong>Subscription data for Pro subscribers.</strong> Stripe customer ID, subscription
              status, and current billing period end date. We do not store card numbers or CVV.
            </li>
            <li>
              <strong>Usage analytics.</strong> Page views and basic interaction events via PostHog,
              used to understand what parts of the site are working.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            How payments work
          </h2>
          <p className="text-base leading-relaxed">
            Pro subscriptions are processed by Stripe. We never see full card numbers, CVV codes, or
            bank account details &mdash; those go directly to Stripe. We receive a confirmation from
            Stripe when a subscription starts, changes, or cancels, and we store only the identifiers
            we need to link your subscription to your listing.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Email we send you
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
            <li>
              <strong>Magic link sign-in.</strong> When you claim a listing or sign in, we email you a
              one-time link.
            </li>
            <li>
              <strong>Inquiry forwards.</strong> When a renter submits an inquiry to your listing, we
              forward it to the contact address on file.
            </li>
            <li>
              <strong>Occasional product updates.</strong> We may occasionally email claimed-listing
              owners about the service. You can opt out at any time by replying or emailing us.
            </li>
          </ul>
          <p className="text-base leading-relaxed mt-3">
            When you submit an inquiry, your name, email, and message are shared with the listing
            contact (studio owner/operator) so they can reply to you directly.
          </p>
          <p className="text-base leading-relaxed mt-3">
            We do not sell or rent email addresses. We do not use your email for marketing from third
            parties.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Cookies
          </h2>
          <p className="text-base leading-relaxed">
            We use a signed cookie to deduplicate listing view counts so the same visitor doesn&apos;t
            inflate the number. We do not use advertising cookies. Our analytics provider (PostHog)
            may set a first-party cookie to remember your session. Authentication uses a standard
            session cookie managed by Supabase.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Third-party services we rely on
          </h2>
          <p className="text-base leading-relaxed mb-3">
            We use the following vendors to run the site. Each has their own privacy policy:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
            <li><strong>Supabase</strong> &mdash; database and authentication.</li>
            <li><strong>Vercel</strong> &mdash; hosting and edge delivery.</li>
            <li><strong>Stripe</strong> &mdash; subscription payments.</li>
            <li><strong>Resend</strong> &mdash; transactional email delivery.</li>
            <li><strong>PostHog</strong> &mdash; product analytics.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            How long we keep data
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
            <li>Listings stay active until removed by the operator or by us.</li>
            <li>Inquiry records are retained so we can answer &ldquo;did that renter reach me?&rdquo; questions. Ask us and we will delete yours.</li>
            <li>The signed visitor cookie we use to deduplicate listing views lasts up to one year. Views are deduplicated within a 30-minute window.</li>
            <li>Analytics events are retained by PostHog per their defaults.</li>
            <li>Canceled subscription records are retained for basic billing history.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Requesting removal of your listing
          </h2>
          <p className="text-base leading-relaxed mb-3">
            Some listings in the directory were initially populated from publicly available sources.
            If you operate a studio that appears on our site and you want it removed or updated:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
            <li>
              Email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--action)' }}>
                {CONTACT_EMAIL}
              </a>{' '}
              with the listing URL and what you&apos;d like changed or removed.
            </li>
            <li>There is no charge.</li>
            <li>
              We don&apos;t require formal proof of ownership. Reasonable verification &mdash;
              responding from an email address associated with the studio, for example &mdash; is
              enough for most cases.
            </li>
            <li>We aim to respond to removal requests promptly.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Your choices
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
            <li>You can ask us what we have on file about you.</li>
            <li>You can ask us to correct or delete your information.</li>
            <li>You can unsubscribe from optional emails by replying or emailing us.</li>
            <li>
              You can close a claimed-listing account by emailing us. We will remove your account
              record; the listing itself may remain in the directory unless you also request its
              removal per the section above.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Children
          </h2>
          <p className="text-base leading-relaxed">
            FindStudioSpace is not directed to children under 13 and we do not knowingly collect data
            from them.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Changes to this policy
          </h2>
          <p className="text-base leading-relaxed">
            We may update this policy as the site evolves. The &ldquo;Last updated&rdquo; date at the
            top of the page will reflect the most recent change. Material changes will be flagged more
            prominently.
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
            Questions, requests, or complaints:{' '}
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
