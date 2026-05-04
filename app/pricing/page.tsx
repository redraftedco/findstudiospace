import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pricing — Free, Sponsored & Multi-Page Plans | FindStudioSpace',
  description:
    'List your studio free. Add sponsored placement from $49/month on one page, or go multi-page at $99/month for broader reach across categories and neighborhoods.',
  openGraph: {
    title: 'Pricing — Free, Sponsored & Multi-Page Plans | FindStudioSpace',
    description:
      'List your studio free. Add sponsored placement from $49/month on one page, or go multi-page at $99/month for broader reach across categories and neighborhoods.',
  },
  alternates: { canonical: '/pricing' },
}

const faqs = [
  {
    q: 'Is the free listing actually free?',
    a: 'Yes. Your studio appears in the directory, is searchable by renters, and includes a direct inquiry form. No credit card, no trial — free forever.',
  },
  {
    q: 'What does sponsored placement add?',
    a: 'Sponsored placement puts your listing above organic results on a relevant category or neighborhood page. It is labeled clearly as Sponsored.',
  },
  {
    q: 'Is sponsored placement guaranteed to bring renters?',
    a: 'No. Sponsored placement buys visibility, not a guaranteed renter, inquiry, booking, or lease. Renters contact your studio directly.',
  },
  {
    q: 'How does billing work?',
    a: 'Sponsored placement is billed monthly through Stripe starting at $49/month for one page, or $99/month for up to three pages. You can cancel from the Stripe billing portal at any time.',
  },
  {
    q: 'How do I get started?',
    a: 'Claim your free listing first, then choose the category or neighborhood page where sponsored placement makes sense.',
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
  'Listed in the studio directory',
  'Searchable by renters by type and neighborhood',
  'Direct inquiry form on your listing',
  'Up to 5 photos',
  'No credit card required',
]

const SPONSORED_FEATURES = [
  'Everything in Free',
  'Sponsored placement on one page',
  'Category or neighborhood targeting',
  'Clearly labeled Sponsored slot',
  'Monthly billing through Stripe',
]

const MULTIPAGE_FEATURES = [
  'Everything in Sponsored',
  'Placement on up to 3 pages',
  'Mix categories and neighborhoods',
  'Priority slot ordering',
  'Monthly billing through Stripe',
]

export default function PricingPage() {
  return (
    <main className="px-6 py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-4xl">

        <div className="text-center mb-12 md:mb-16">
          <h1
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
            className="text-4xl md:text-5xl font-semibold tracking-tight mb-4"
          >
            Simple pricing for studio owners.
          </h1>
          <p
            style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }}
            className="text-base md:text-lg max-w-xl mx-auto"
          >
            Start free. Pay only when you want more visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-20">

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
              Get listed and start receiving interest from renters browsing your city.
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

          {/* Sponsored Placement */}
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
              Fastest revenue path
            </span>
            <h2
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
              className="text-xl font-semibold mb-1"
            >
              Sponsored Placement
            </h2>
            <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }} className="text-sm mb-6">
              Appear above organic results on one relevant category or neighborhood page.
            </p>
            <div className="mb-6">
              <span
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
                className="text-4xl font-semibold"
              >
                $49
              </span>
              <span style={{ color: 'var(--stone)' }} className="text-sm ml-1">/month</span>
            </div>
            <ul
              style={{ color: 'var(--ink)', fontFamily: 'var(--font-body)' }}
              className="space-y-2 mb-8 text-sm"
            >
              {SPONSORED_FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <span style={{ color: 'var(--action)' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/advertise"
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
              See placement options
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
              $49/month. Cancel anytime.
            </p>
          </div>

          {/* Multi-Page */}
          <div
            style={{
              border: '1px solid var(--rule)',
              background: 'var(--paper)',
            }}
            className="p-8"
          >
            <h2
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
              className="text-xl font-semibold mb-1"
            >
              Multi-Page
            </h2>
            <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }} className="text-sm mb-6">
              Reach renters browsing across multiple category and neighborhood pages.
            </p>
            <div className="mb-6">
              <span
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
                className="text-4xl font-semibold"
              >
                $99
              </span>
              <span style={{ color: 'var(--stone)' }} className="text-sm ml-1">/month</span>
            </div>
            <ul
              style={{ color: 'var(--ink)', fontFamily: 'var(--font-body)' }}
              className="space-y-2 mb-8 text-sm"
            >
              {MULTIPAGE_FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <span style={{ color: 'var(--action)' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/advertise"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px',
                border: '1px solid var(--action)',
                background: 'transparent',
                color: 'var(--action)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '14px',
                textDecoration: 'none',
              }}
              className="w-full"
            >
              See placement options
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
              $99/month. Cancel anytime.
            </p>
          </div>

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
