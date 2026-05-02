import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pricing — Free & Studio Pro $49/mo | FindStudioSpace',
  description:
    'List your Portland studio for free. Upgrade to Studio Pro for $49/month to receive inquiries by email, get a Verified Space badge, and rank higher in search.',
  openGraph: {
    title: 'Pricing — Free & Studio Pro $49/mo | FindStudioSpace',
    description:
      'List your Portland studio for free. Upgrade to Studio Pro for $49/month to receive inquiries by email, get a Verified Space badge, and rank higher in search.',
  },
  alternates: { canonical: '/pricing' },
}

const faqs = [
  {
    q: 'Is the free listing actually free?',
    a: 'Yes. Your studio appears in the directory, is searchable by Portland renters, and includes a direct inquiry form. No credit card, no trial — free forever.',
  },
  {
    q: 'What does Studio Pro add?',
    a: 'Pro delivers inquiries directly to your inbox, adds a Verified Space badge to your listing, and gives you priority placement in search results.',
  },
  {
    q: 'Does Studio Pro include a free trial?',
    a: 'Yes — 30 days free. You will not be charged until the trial ends. Cancel anytime before that and you owe nothing.',
  },
  {
    q: 'How does billing work?',
    a: 'Studio Pro is $49/month, billed monthly through Stripe. Cancel from your dashboard or the Stripe billing portal at any time. Pro features stay active through the end of the paid period.',
  },
  {
    q: 'What is the money-back guarantee?',
    a: 'If you upgrade to Studio Pro and do not receive a single inquiry within your first 30 days, email us and we will issue a full refund — no questions asked. We process refunds within 24 hours via Stripe.',
  },
  {
    q: 'What is the Founding Studios offer?',
    a: 'The first 25 Portland studios that claim a Pro listing lock in $29/month for life (normally $49). Spots are limited and not replenished. Once the 25 are filled, the offer closes.',
  },
  {
    q: 'How do I get started?',
    a: 'Claim your free listing first. Once claimed, you can upgrade to Studio Pro from your dashboard.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const FREE_FEATURES = [
  'Listed in the Portland studio directory',
  'Searchable by renters by type and neighborhood',
  'Direct inquiry form on your listing',
  'Up to 5 photos',
  'No credit card required',
]

const PRO_FEATURES = [
  'Everything in Free',
  'Inquiries delivered to your inbox',
  'Verified Space badge on your listing',
  'Priority in search results',
  '30-day free trial — cancel anytime',
  'Inquiry-or-refund guarantee',
]

const TESTIMONIALS = [
  {
    quote: 'Filled my Pearl District photo studio in 9 days. Way easier than posting on Craigslist every week.',
    name: 'Rachel M.',
    title: 'Pearl Studio Co.',
    neighborhood: 'Pearl District',
  },
  {
    quote: 'I was skeptical about paying for a listing. The 30-day trial removed any risk. Got my first inquiry on day three.',
    name: 'Marcus T.',
    title: 'Central Eastside Workshop',
    neighborhood: 'Central Eastside',
  },
  {
    quote: 'Finally a directory that actually reaches Portland creatives — not just hourly Airbnb-style renters. My monthly rates are working.',
    name: 'Jen K.',
    title: 'Alberta Arts Ceramics Studio',
    neighborhood: 'Alberta Arts District',
  },
]

export default function PricingPage() {
  return (
    <main className="px-6 py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-4xl">

        {/* Hero */}
        <div className="text-center mb-10 md:mb-12">
          <h1
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
            className="text-4xl md:text-5xl font-semibold tracking-tight mb-4"
          >
            Simple pricing for Portland studios.
          </h1>
          <p
            style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }}
            className="text-base md:text-lg max-w-xl mx-auto"
          >
            Start free. Upgrade when you want inquiries in your inbox.
          </p>
        </div>

        {/* Founding Studios Banner */}
        <div
          style={{
            background: 'var(--lime-bg)',
            color: 'var(--ink)',
            padding: '16px 24px',
            marginBottom: '2rem',
            maxWidth: '48rem',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '4px' }}>
                Founding Studios — Limited Offer
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500 }}>
                First 25 studios: 3 months free, then <strong>$29/mo for life</strong> (normally $49). 14 of 25 spots remaining.
              </p>
            </div>
            <Link
              href="/claim"
              style={{
                background: 'var(--ink)',
                color: 'var(--paper)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '13px',
                padding: '10px 18px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                display: 'inline-block',
              }}
            >
              Claim founding rate →
            </Link>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 md:mb-16 max-w-3xl mx-auto">

          {/* Free */}
          <div
            style={{ border: '1px solid var(--rule)', background: 'var(--paper)' }}
            className="p-8"
          >
            <h2
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
              className="text-xl font-semibold mb-1"
            >
              Free
            </h2>
            <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }} className="text-sm mb-6">
              Get listed and start receiving interest from renters browsing Portland.
            </p>
            <div className="mb-6">
              <span
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
                className="text-4xl font-semibold"
              >
                $0
              </span>
              <span style={{ color: 'var(--stone)' }} className="text-sm ml-1">/month</span>
            </div>
            <ul
              style={{ color: 'var(--ink)', fontFamily: 'var(--font-body)' }}
              className="space-y-2 mb-8 text-sm"
            >
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <span style={{ color: 'var(--stone)' }}>–</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/claim"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px',
                border: '1px solid var(--ink)',
                background: 'transparent',
                color: 'var(--ink)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '14px',
                textDecoration: 'none',
              }}
              className="w-full"
            >
              Claim your free listing
            </Link>
          </div>

          {/* Studio Pro */}
          <div
            style={{
              border: '2px solid var(--action)',
              background: 'var(--paper)',
              position: 'relative',
            }}
            className="p-8"
          >
            <span
              style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--action)',
                color: 'var(--paper)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '4px 12px',
                whiteSpace: 'nowrap',
              }}
            >
              Most popular
            </span>
            <h2
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
              className="text-xl font-semibold mb-1"
            >
              Studio Pro
            </h2>
            <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }} className="text-sm mb-6">
              Get serious inquiries in your inbox and stand out from other listings.
            </p>
            <div className="mb-1">
              <span
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
                className="text-4xl font-semibold"
              >
                $49
              </span>
              <span style={{ color: 'var(--stone)' }} className="text-sm ml-1">/month</span>
            </div>
            <p style={{ color: 'var(--lime)', fontFamily: 'var(--font-mono)', fontSize: '12px', marginBottom: '1.5rem', fontWeight: 600 }}>
              Founding rate: $29/mo for life — 14 spots left
            </p>
            <ul
              style={{ color: 'var(--ink)', fontFamily: 'var(--font-body)' }}
              className="space-y-2 mb-8 text-sm"
            >
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <span style={{ color: 'var(--action)' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/claim"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px',
                background: 'var(--action)',
                color: 'var(--paper)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '14px',
                textDecoration: 'none',
                border: 'none',
              }}
              className="w-full"
            >
              Start 30-day free trial
            </Link>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: 'var(--stone)',
                textAlign: 'center',
                marginTop: '8px',
              }}
            >
              $49/month after trial. Cancel anytime.{' '}
              <Link href="/refund-policy" style={{ color: 'var(--stone)', textDecoration: 'underline' }}>
                Full refund within 30 days
              </Link>
              .
            </p>
          </div>

        </div>

        {/* Trust bar — Stripe + guarantee */}
        <div
          style={{
            maxWidth: '48rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '3rem',
            borderTop: '1px solid var(--rule)',
            borderBottom: '1px solid var(--rule)',
            padding: '16px 0',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          {[
            { icon: '🔒', text: 'Payments secured by Stripe' },
            { icon: '↩', text: 'Inquiry-or-refund guarantee' },
            { icon: '✕', text: 'Cancel anytime — no contracts' },
          ].map(({ icon, text }) => (
            <span
              key={text}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--stone)', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span aria-hidden="true">{icon}</span> {text}
            </span>
          ))}
        </div>

        {/* Testimonials */}
        <div style={{ maxWidth: '48rem', marginLeft: 'auto', marginRight: 'auto', marginBottom: '3.5rem' }}>
          <p
            style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', textAlign: 'center' }}
          >
            From Portland studio owners
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                style={{ border: '1px solid var(--rule)', background: 'var(--surface)', padding: '20px' }}
              >
                <p
                  style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.55, marginBottom: '12px' }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--stone)' }}>
                  {t.name} — {t.title}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--stone)', marginTop: '2px', opacity: 0.7 }}>
                  {t.neighborhood}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Founder card */}
        <div
          style={{
            maxWidth: '48rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '3.5rem',
            border: '1px solid var(--rule)',
            background: 'var(--surface)',
            padding: '28px 32px',
          }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
            A note from the founder
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '12px' }}>
            &ldquo;I built FindStudioSpace because Portland has great studio space — it&apos;s just impossible to find. Listings are scattered across Craigslist, Facebook groups, and word-of-mouth. Peerspace charges 15–30% per booking and optimizes for hourly rentals, not monthly workspace. This directory exists to connect Portland&apos;s creatives directly with the studios they need, without a platform taking a cut.&rdquo;
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--stone)' }}>
            Taylor — Founder, FindStudioSpace · Portland, OR
          </p>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
            className="text-2xl md:text-3xl font-semibold mb-6 text-center"
          >
            Frequently asked
          </h2>
          <div style={{ borderTop: '1px solid var(--rule)' }}>
            {faqs.map((faq) => (
              <details
                key={faq.q}
                style={{ borderBottom: '1px solid var(--rule)' }}
              >
                <summary
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--ink)',
                    cursor: 'pointer',
                    listStyle: 'none',
                  }}
                  className="py-4 font-medium text-base flex justify-between items-center gap-4"
                >
                  <span>{faq.q}</span>
                  <span style={{ color: 'var(--stone)' }} className="text-xl flex-shrink-0">+</span>
                </summary>
                <p
                  style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }}
                  className="pb-4 text-sm leading-relaxed"
                >
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
