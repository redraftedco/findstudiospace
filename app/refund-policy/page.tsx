import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy | FindStudioSpace',
  description:
    'How refunds work on Studio Pro subscriptions — 30-day free trial, no partial-month refunds, and how to request an exception for billing errors.',
  alternates: { canonical: '/refund-policy' },
}

{/* TODO: confirm this email is monitored before cold email goes out */}
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
            Studio Pro subscriptions include a 30-day free trial — cancel before day 30 and you
            are never charged. After the trial, Pro is billed monthly and we do not refund partial
            months. Full details below.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            The 30-day free trial
          </h2>
          <p className="text-base leading-relaxed mb-3">
            When you start Studio Pro, Stripe collects your card but does not bill it for 30 days.
            You can cancel any time during the trial from your dashboard or the Stripe billing
            portal. If you cancel before day 30, your card is never billed and your listing
            reverts to the free tier.
          </p>
          <p className="text-base leading-relaxed">
            The trial is the primary way to try Pro risk-free. If you know Pro isn&apos;t right for
            your studio, cancel during the trial rather than after the first charge — that&apos;s
            the simplest, fastest path.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl font-semibold mb-3"
          >
            Monthly subscriptions after the trial
          </h2>
          <p className="text-base leading-relaxed mb-3">
            Once the trial ends, Studio Pro renews each month at the price shown on the{' '}
            <Link href="/pricing" style={{ color: 'var(--action)' }} className="hover:underline">
              pricing page
            </Link>
            . If you cancel mid-cycle, your Pro features remain active through the end of the
            period you already paid for. At the end of that period, your listing reverts to the
            free tier. We do not refund partial months.
          </p>
          <p className="text-base leading-relaxed">
            This matches the{' '}
            <Link href="/terms" style={{ color: 'var(--action)' }} className="hover:underline">
              Terms of Service
            </Link>{' '}
            — if anything here conflicts with the Terms, the Terms control.
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
              <strong>Billing error or double-charge.</strong> If you were charged by mistake —
              duplicate transaction, wrong amount, charge after a confirmed cancellation — email us
              and we&apos;ll correct it. This is a billing correction, not a discretionary refund.
            </li>
          </ul>
          <p className="text-base leading-relaxed mt-3">
            Other situations are handled case by case — email us and describe what happened. We
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
            payment method through Stripe — your bank typically posts the refund within 5 to 10
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
            dispute typically takes 30–90 days — we can usually resolve the same issue in hours by
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
