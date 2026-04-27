import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Done-For-You Listing Setup | FindStudioSpace',
  description:
    'We build and publish your studio listing for you. Includes copywriting, amenity setup, SEO tags, and launch support for $149.',
  openGraph: {
    title: 'Done-For-You Listing Setup | FindStudioSpace',
    description:
      'No time to set up your listing? Our Done-For-You service publishes your listing in 48 hours for a one-time $149.',
  },
}

const INCLUDED = [
  'Listing copywriting and optimization',
  'Amenity and niche-attribute setup',
  'Photo ordering + caption cleanup',
  'Neighborhood/category targeting',
  'Publishing + QA check in 48 hours',
]

export default function DoneForYouPage() {
  return (
    <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen px-6 py-14">
      <div className="mx-auto max-w-4xl">
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }} className="text-xs uppercase tracking-[0.12em]">
          Landlord onboarding service
        </p>
        <h1 style={{ fontFamily: 'var(--font-heading)' }} className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
          Done-For-You listing setup in 48 hours
        </h1>
        <p style={{ color: 'var(--stone)' }} className="mt-5 max-w-2xl text-base leading-relaxed">
          If you&apos;re short on time, we&apos;ll handle the full setup. You send your photos and key details,
          and we publish an optimized listing for you.
        </p>

        <section style={{ border: '1px solid var(--rule)', background: 'var(--surface)' }} className="mt-10 p-8">
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }} className="text-xs uppercase">One-time fee</p>
          <p style={{ fontFamily: 'var(--font-heading)' }} className="mt-2 text-4xl font-semibold">$149</p>
          <ul className="mt-6 space-y-2">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'var(--stone)' }}>
                <span style={{ color: 'var(--lime)' }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/list-your-space" className="btn-action inline-block px-6 py-3 text-sm font-medium">
              Start with your listing →
            </Link>
            <Link
              href="mailto:hello@findstudiospace.com?subject=Done-for-you%20setup"
              style={{ border: '1px solid var(--rule)', color: 'var(--ink)' }}
              className="inline-block px-6 py-3 text-xs uppercase tracking-wider"
            >
              Email to book
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
