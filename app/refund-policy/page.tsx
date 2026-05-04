import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy | FindStudioSpace',
  description:
    'How refunds work on sponsored placements, monthly billing, no partial-month refunds, and how to request a billing correction.',
  alternates: { canonical: '/refund-policy' },
}

const CONTACT_EMAIL = 'hello@findstudiospace.com'

export default function RefundPolicyPage() {
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
          Refund Policy
        </h1>
        <p style={{ color: 'var(--stone)' }} className="text-sm mb-10">
          Last updated: April 2026
        </p>

        <section className="mb-8">
          <p className="text-base leading-relaxed">
            Sponsored placements are billed monthly through Stripe. You can cancel any time, but
            we do not refund partial months unless there was a billing error. Full details below.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Monthly sponsored placement billing
          </h2>
          <p className="text-base leading-relaxed mb-3">
            Sponsored placement buys visibility in a clearly labeled ad slot. It does not guarantee
            renters, inquiries, bookings, or revenue.
          </p>
          <p className="text-base leading-relaxed">
            Billing starts when your placement order is confirmed. You can cancel from the Stripe
            billing portal, and your placement remains active through the end of the paid period.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Cancellations
          </h2>
          <p className="text-base leading-relaxed mb-3">
            Sponsored placement renews each month at the price shown on the{' '}
            <Link href="/pricing" style={{ color: 'var(--action)' }} className="hover:underline">
              pricing page
            </Link>
            . If you cancel mid-cycle, the placement remains active through the end of the period
            you already paid for. We do not refund partial months.
          </p>
          <p className="text-base leading-relaxed">
            This matches the{' '}
            <Link href="/terms" style={{ color: 'var(--action)' }} className="hover:underline">
              Terms of Service
            </Link>{' '}
           , if anything here conflicts with the Terms, the Terms control.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Exceptions
          </h2>
          <p className="text-base leading-relaxed mb-3">
            One case breaks the no-partial-refund rule:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
            <li>
              <strong>Billing error or double-charge.</strong> If you were charged by mistake,
              duplicate transaction, wrong amount, charge after a confirmed cancellation, email us
              and we&apos;ll correct it. This is a billing correction, not a discretionary refund.
            </li>
          </ul>
          <p className="text-base leading-relaxed mt-3">
            Other situations are handled case by case, email us and describe what happened. We
            don&apos;t pre-commit to categories beyond billing corrections.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            How to request a refund
          </h2>
          <p className="text-base leading-relaxed mb-3">
            Email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--action)' }}>
              {CONTACT_EMAIL}
            </a>{' '}
            with:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
            <li>Your listing ID or listing URL</li>
            <li>The Stripe receipt number or approximate charge date</li>
            <li>A short description of what happened</li>
          </ul>
          <p className="text-base leading-relaxed mt-3">
            We aim to respond promptly. If a refund is approved, it&apos;s issued to the original
            payment method through Stripe, your bank typically posts the refund within 5 to 10
            business days.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Chargebacks
          </h2>
          <p className="text-base leading-relaxed mb-3">
            If you&apos;re considering a chargeback, email us first. We can almost always resolve
            the underlying concern faster than a bank dispute can.
          </p>
          <p className="text-base leading-relaxed mb-3">
            Chargebacks cost us a flat fee through Stripe regardless of who wins, and a bank
            dispute typically takes 30–90 days, we can usually resolve the same issue in hours by
            email.
          </p>
          <p className="text-base leading-relaxed">
            Once a bank dispute is filed, Stripe freezes the transaction and we cannot issue a
            voluntary refund until the bank rules. We will always cooperate with a legitimate
            dispute, but contacting us first is faster for both of us.
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
            Refund questions, billing corrections, or a dispute you want to raise before a
            chargeback:{' '}
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
