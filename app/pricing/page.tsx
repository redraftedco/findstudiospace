import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Advertise — Sponsored Placement for Portland Studios | FindStudioSpace',
  description:
    'Get your Portland studio in front of renters browsing by category or neighborhood. Sponsored placements from $49/month. No commission. Renters contact you directly.',
  openGraph: {
    title: 'Advertise — Sponsored Placement for Portland Studios | FindStudioSpace',
    description:
      'Get your Portland studio in front of renters browsing by category or neighborhood. Sponsored placements from $49/month. No commission. Renters contact you directly.',
  },
  alternates: { canonical: '/pricing' },
}

const faqs = [
  {
    q: 'What is a sponsored placement?',
    a: 'Your listing appears in a "Sponsored" section at the top of a category or neighborhood page — above organic results, labeled "Sponsored." Renters browsing that page see your studio first.',
  },
  {
    q: 'How is this different from a free listing?',
    a: 'Free listings appear in organic results ranked by recency. Sponsored placements appear above them on the specific page you choose. Your listing content and direct contact links stay the same either way.',
  },
  {
    q: 'Does this guarantee bookings or inquiries?',
    a: 'No. Sponsored placement puts your studio in front of renters browsing that page. What happens next depends on your listing quality, pricing, and fit for the renter.',
  },
  {
    q: 'How does billing work?',
    a: 'Placements are billed monthly through Stripe. Cancel from the billing portal at any time. Your placement stays active through the end of the paid period.',
  },
  {
    q: 'How do I start?',
    a: 'Claim your listing first, then reach out. We review each placement to confirm it is relevant to the page before it goes live.',
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

const placements = [
  {
    name: 'Featured Category',
    price: '$49',
    period: '/month',
    description: 'Appear in the Sponsored section of one Portland category page.',
    features: [
      'Sponsored placement on one category page',
      'Above organic listings, labeled "Sponsored"',
      'Up to 3 sponsored slots per page',
      'Cancel anytime',
    ],
  },
  {
    name: 'Featured Neighborhood',
    price: '$49',
    period: '/month',
    description: 'Appear in the Sponsored section of one Portland neighborhood page.',
    features: [
      'Sponsored placement on one neighborhood page',
      'Above organic listings, labeled "Sponsored"',
      'Up to 3 sponsored slots per page',
      'Cancel anytime',
    ],
  },
  {
    name: 'Featured Studio',
    price: '$149',
    period: '/month',
    description: 'Sponsored placement across one category and one relevant browsing path.',
    features: [
      'Sponsored on one category page',
      'Sponsored on one neighborhood or related page',
      'Broader reach for studios in high-demand categories',
      'Cancel anytime',
    ],
    highlight: true,
  },
]

export default function PricingPage() {
  return (
    <main className="px-6 py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-5xl">

        <div className="text-center mb-12 md:mb-16">
          <h1
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
            className="text-4xl md:text-5xl font-semibold tracking-tight mb-4"
          >
            Appear where renters compare Portland studio space.
          </h1>
          <p
            style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }}
            className="text-base md:text-lg max-w-2xl mx-auto"
          >
            List for free. Pay only when you want sponsored visibility on a category or neighborhood page. No commission. Renters contact your studio directly.
          </p>
        </div>

        {/* Free tier */}
        <div
          style={{ borderColor: 'var(--rule)', background: 'var(--surface)' }}
          className="border p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
                className="text-xl font-semibold mb-1"
              >
                Free Listing
              </h2>
              <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }} className="text-sm">
                Standard directory listing — visible to renters browsing Portland studios.
                Up to 5 photos. Renters contact you directly via email or phone.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/claim"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '44px',
                  padding: '10px 20px',
                  border: '1px solid var(--ink)',
                  background: 'transparent',
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: '14px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Claim your free listing
              </Link>
            </div>
          </div>
        </div>

        {/* Placement tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-20">
          {placements.map((p) => (
            <div
              key={p.name}
              style={{
                borderColor: p.highlight ? 'var(--action)' : 'var(--rule)',
                borderWidth: p.highlight ? '2px' : '1px',
                background: 'var(--paper)',
                position: 'relative',
              }}
              className="border p-8"
            >
              {p.highlight && (
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
                  Best value
                </span>
              )}
              <h2
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
                className="text-xl font-semibold mb-2"
              >
                {p.name}
              </h2>
              <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }} className="text-sm mb-4">
                {p.description}
              </p>
              <div className="mb-6">
                <span
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
                  className="text-4xl font-semibold"
                >
                  {p.price}
                </span>
                <span style={{ color: 'var(--stone)' }} className="text-sm ml-1">
                  {p.period}
                </span>
              </div>
              <ul
                style={{ color: 'var(--ink)', fontFamily: 'var(--font-body)' }}
                className="space-y-2 mb-8 text-sm"
              >
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link
                href="/advertise"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '44px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: '14px',
                  textDecoration: 'none',
                  ...(p.highlight
                    ? { background: 'var(--action)', color: 'var(--paper)' }
                    : { border: '1px solid var(--ink)', background: 'transparent', color: 'var(--ink)' }),
                }}
                className="w-full"
              >
                Get started
              </Link>
            </div>
          ))}
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
