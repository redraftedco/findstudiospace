import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'List Your Space | FindStudioSpace',
  description:
    'Reach Portland creatives, makers, and business owners actively looking for studio and workspace. Add your listing to FindStudioSpace.',
}

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get your space in front of people searching today.',
    features: [
      'Listed in search results',
      'Inquiry form on your listing',
      'Basic details: title, price, neighborhood',
    ],
    cta: 'Submit free listing',
    href: 'mailto:hello@findstudiospace.com?subject=Free+listing+submission',
    highlight: false,
  },
  {
    name: 'Featured',
    price: '$25',
    period: 'per month',
    description: 'Stand out at the top of your category.',
    features: [
      'Everything in Free',
      'Priority placement in category pages',
      'Photo gallery (up to 8 photos)',
      'Full description + amenity tags',
      'Featured badge on your listing',
    ],
    cta: 'Get featured',
    href: 'mailto:hello@findstudiospace.com?subject=Featured+listing',
    highlight: true,
  },
]

export default function ListYourSpacePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="border-b bg-white px-4 py-16 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
          For space owners
        </p>
        <h1 className="text-4xl font-bold tracking-tight">
          List your studio or workspace
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-500">
          FindStudioSpace connects Portland creatives, makers, and entrepreneurs
          with the spaces they need. Reach people actively searching — not
          scrolling past ads.
        </p>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold">Simple pricing</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl border p-6 shadow-sm ${
                tier.highlight ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'bg-white'
              }`}
            >
              {tier.highlight && (
                <span className="mb-3 inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <p className="text-lg font-bold">{tier.name}</p>
              <p className="mt-1">
                <span className="text-3xl font-bold">{tier.price}</span>
                <span className="ml-1 text-sm text-gray-500">/ {tier.period}</span>
              </p>
              <p className="mt-2 text-sm text-gray-600">{tier.description}</p>
              <ul className="mt-5 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 text-green-600">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={tier.href}
                className={`mt-6 block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${
                  tier.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Questions?{' '}
          <a
            href="mailto:hello@findstudiospace.com"
            className="text-blue-600 hover:underline"
          >
            Email us
          </a>{' '}
          — we respond same day.
        </p>
      </section>

      {/* Why list here */}
      <section className="border-t bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-bold">Why list on FindStudioSpace?</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                heading: 'Portland-focused',
                body: 'We rank for Portland-specific searches — people who are actually here and ready to rent.',
              },
              {
                heading: 'Qualified inquiries',
                body: 'Every inquiry includes name, email, intended use, budget, and move-in date. No tire-kickers.',
              },
              {
                heading: 'No booking fees',
                body: 'You handle the rental directly. We connect you — no commission, no middleman taking a cut.',
              },
            ].map(({ heading, body }) => (
              <div key={heading}>
                <p className="font-semibold">{heading}</p>
                <p className="mt-1 text-sm text-gray-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="py-8 text-center">
        <Link href="/" className="text-sm text-gray-500 hover:underline">
          ← Back to listings
        </Link>
      </div>
    </main>
  )
}
