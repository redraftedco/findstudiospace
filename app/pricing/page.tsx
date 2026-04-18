import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pricing — Free or $29/month | FindStudioSpace',
  description:
    'Free Portland studio listings or $29/month Studio Pro with featured placement, analytics, and direct contact links. 30-day free trial.',
  openGraph: {
    title: 'Pricing — Free or $29/month | FindStudioSpace',
    description:
      'Free Portland studio listings or $29/month Studio Pro with featured placement, analytics, and direct contact links. 30-day free trial.',
  },
  alternates: { canonical: '/pricing' },
}

type Faq = {
  q: string
  a: string
  // Optional rendered addendum (e.g. a link). Not included in JSON-LD schema
  // so the structured-data `text` field stays a plain string.
  aExtra?: React.ReactNode
}

const faqs: Faq[] = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your dashboard or the Stripe billing portal. Your Pro features stay active through the end of your current billing period, then your listing reverts to the free tier.',
  },
  {
    q: 'What happens when I downgrade?',
    a: 'Your listing stays live. Featured placement and extra photos (beyond 5) are removed, and your website and Instagram links no longer display on your listing page.',
  },
  {
    q: 'How does billing work?',
    a: 'Monthly is $29 billed each month. Starts with a 30-day free trial. You are not charged until the trial ends.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Not on partial months. If you cancel mid-cycle, your Pro features continue through the end of the period you already paid for. The 30-day free trial means you can try Pro risk-free.',
    aExtra: (
      <>
        {' '}
        <Link
          href="/refund-policy"
          style={{ color: 'var(--action)' }}
          className="hover:underline"
        >
          Read the full refund policy →
        </Link>
      </>
    ),
  },
  {
    q: 'How does the 30-day free trial work?',
    a: 'You get full Pro features for 30 days at no charge. Cancel anytime before day 30 and you are never billed. After day 30, your card is charged $29 and Pro continues monthly until you cancel.',
  },
  {
    q: 'Is my studio already listed?',
    a: 'If you run a creative studio in Portland, there is a good chance your studio is already in the directory. Search your studio name on the homepage, or check your inbox — we may have already reached out about claiming your listing.',
  },
  {
    q: 'How do I claim my listing?',
    a: 'Click "Claim your free listing" above, search for your studio, and verify ownership via a magic link sent to your email. The whole process takes about 30 seconds. Once claimed, you can edit your listing and upgrade to Pro from your dashboard.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a,
    },
  })),
}

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
            Get more renters to your studio.
          </h1>
          <p
            style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }}
            className="text-base md:text-lg max-w-2xl mx-auto"
          >
            List your space for free, or upgrade to Pro for featured placement, view analytics, and direct contact links.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 md:mb-20">
          <div
            style={{ borderColor: 'var(--rule)', background: 'var(--surface)' }}
            className="border p-8"
          >
            <div className="mb-6">
              <h2
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
                className="text-2xl font-semibold mb-1"
              >
                Free
              </h2>
              <p style={{ color: 'var(--stone)' }} className="text-sm">
                For studios starting out.
              </p>
            </div>
            <div className="mb-6">
              <span
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
                className="text-5xl font-semibold"
              >
                $0
              </span>
              <span style={{ color: 'var(--stone)' }} className="text-sm ml-2">
                forever
              </span>
            </div>
            <ul
              style={{ color: 'var(--ink)', fontFamily: 'var(--font-body)' }}
              className="space-y-2 mb-8 text-sm"
            >
              <li>Standard listing in the directory</li>
              <li>Up to 5 photos</li>
              <li>Inquiry form — renters email you directly</li>
              <li>Appears in city and category pages</li>
            </ul>
            <Link
              href="/claim"
              style={{
                background: 'var(--paper)',
                color: 'var(--ink)',
                border: '1px solid var(--ink)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '48px',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
              }}
              className="w-full"
            >
              Claim your free listing
            </Link>
          </div>

          <div
            style={{
              borderColor: 'var(--action)',
              borderWidth: '2px',
              background: 'var(--paper)',
              position: 'relative',
            }}
            className="border p-8"
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
              Most Popular
            </span>
            <div className="mb-6">
              <h2
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
                className="text-2xl font-semibold mb-1"
              >
                Studio Pro
              </h2>
              <p style={{ color: 'var(--stone)' }} className="text-sm">
                For studios that want more inquiries.
              </p>
            </div>
            <div className="mb-2">
              <span
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
                className="text-5xl font-semibold"
              >
                $29
              </span>
              <span style={{ color: 'var(--stone)' }} className="text-sm ml-2">
                /month
              </span>
            </div>
            <p style={{ color: 'var(--stone)' }} className="text-sm mb-6">
              30-day free trial, cancel anytime
            </p>
            <ul
              style={{ color: 'var(--ink)', fontFamily: 'var(--font-body)' }}
              className="space-y-2 mb-8 text-sm"
            >
              <li>Featured placement above free listings</li>
              <li>Up to 15 photos</li>
              <li>Website and Instagram links on your listing</li>
              <li>Monthly view count and inquiry analytics</li>
              <li>30-day free trial, cancel anytime</li>
            </ul>
            <Link href="/claim" className="btn-action w-full" style={{ textDecoration: 'none' }}>
              Start 30-day free trial
            </Link>
          </div>
        </div>

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
                  <span style={{ color: 'var(--stone)' }} className="text-xl flex-shrink-0">
                    +
                  </span>
                </summary>
                <p
                  style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }}
                  className="pb-4 text-sm leading-relaxed"
                >
                  {faq.a}
                  {faq.aExtra}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
