import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Advertise Your Studio — FindStudioSpace Portland',
  description:
    'Sponsored placement on Portland category and neighborhood pages. $49–$149/month. No commission, no booking lock-in. Renters contact your studio directly.',
  alternates: { canonical: '/advertise' },
  openGraph: {
    title: 'Advertise Your Studio — FindStudioSpace Portland',
    description:
      'Sponsored placement on Portland category and neighborhood pages. $49–$149/month. No commission, no booking lock-in. Renters contact your studio directly.',
  },
}

export default function AdvertisePage() {
  return (
    <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen px-6 py-12 md:py-16">
      <div className="mx-auto max-w-3xl">

        <h1
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
          className="text-4xl md:text-5xl font-semibold tracking-tight mb-4"
        >
          Appear where renters compare Portland studio space.
        </h1>

        <p
          style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }}
          className="text-base md:text-lg mb-12 max-w-2xl"
        >
          Your listing is already in the directory for free. Sponsored placement puts it at the top of a specific category or neighborhood page — where renters are actively comparing spaces.
        </p>

        {/* Key facts */}
        <div
          style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}
          className="py-8 mb-12 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {[
            { label: 'No commission', body: 'We charge for visibility, not for rentals. Renters contact your studio directly.' },
            { label: 'No booking lock-in', body: 'Your studio handles inquiries, pricing, and lease terms. We stay out of it.' },
            { label: 'Cancel anytime', body: 'Monthly billing through Stripe. Cancel from your billing portal whenever you want.' },
          ].map((item) => (
            <div key={item.label}>
              <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontWeight: 600 }} className="text-base mb-1">
                {item.label}
              </p>
              <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }} className="text-sm leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        {/* Placement options */}
        <h2
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
          className="text-2xl font-semibold mb-6"
        >
          Placement options
        </h2>

        <div className="space-y-4 mb-12">
          {[
            {
              name: 'Featured Category — $49/month',
              body: 'Your listing appears in the "Sponsored" section of one Portland category page — Event Space, Photo Studio, Makerspace, or other relevant categories. Up to 3 sponsored slots per page.',
            },
            {
              name: 'Featured Neighborhood — $49/month',
              body: 'Your listing appears in the "Sponsored" section of one Portland neighborhood page — Pearl District, SE Portland, Central Eastside, or wherever your studio is. Up to 3 sponsored slots per page.',
            },
            {
              name: 'Featured Studio — $149/month',
              body: 'Sponsored placement across one category page and one relevant browsing path. For studios in high-demand categories that want broader reach.',
            },
          ].map((item) => (
            <div
              key={item.name}
              style={{ border: '1px solid var(--rule)', padding: '20px 24px' }}
            >
              <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontWeight: 600 }} className="text-base mb-1">
                {item.name}
              </p>
              <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }} className="text-sm leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <h2
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
          className="text-2xl font-semibold mb-4"
        >
          How it works
        </h2>
        <ol
          style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }}
          className="text-sm leading-relaxed space-y-2 mb-12 list-decimal list-inside"
        >
          <li>Claim your listing to verify ownership.</li>
          <li>Choose a placement — which page and which product.</li>
          <li>We review your placement to confirm relevance before it goes live.</li>
          <li>Your listing appears in the Sponsored section, labeled "Sponsored."</li>
          <li>Renters see your studio and contact you directly.</li>
        </ol>

        {/* Disclosure */}
        <p
          style={{
            color: 'var(--stone)',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            borderTop: '1px solid var(--rule)',
            paddingTop: '16px',
            marginBottom: '32px',
          }}
        >
          Sponsored listings are paid advertisements. Payment does not guarantee inquiries, bookings, renters, or revenue. FindStudioSpace does not process or facilitate rental transactions. Renters contact studios directly to confirm pricing, availability, terms, and suitability.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/claim"
            className="btn-action"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '48px',
              padding: '12px 24px',
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            Claim your listing to get started
          </Link>
          <Link
            href="/pricing"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '48px',
              padding: '12px 24px',
              border: '1px solid var(--rule)',
              color: 'var(--stone)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            See pricing →
          </Link>
        </div>

      </div>
    </main>
  )
}
