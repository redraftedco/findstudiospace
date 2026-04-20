import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { UpgradeButton } from '@/components/UpgradeButton'
import { CheckoutResult } from '@/components/CheckoutResult'

export const metadata: Metadata = {
  title: 'List Your Studio Space in Portland | FindStudioSpace',
  description:
    'Reach Portland creatives looking for monthly studio, workshop, art, and office space rentals. Free to list. Get real inquiries from artists, makers, and producers.',
  openGraph: {
    title: 'List Your Studio Space in Portland | FindStudioSpace',
    description:
      'Reach Portland creatives looking for monthly studio, workshop, art, and office space rentals. Free to list.',
  },
}

const SPACE_TYPES = [
  { label: 'Art Studios', desc: 'Private studios, co-ops, and maker spaces for visual artists', borderClass: 'cat-border-art' },
  { label: 'Workshop Space', desc: 'Garages, warehouses, and fabrication bays for builders and makers', borderClass: 'cat-border-workshop' },
  { label: 'Photo Studios', desc: 'Professional spaces for photographers and production', borderClass: 'cat-border-photo' },
  { label: 'Office Space', desc: 'Private offices and creative suites for freelancers and small teams', borderClass: 'cat-border-office' },
  { label: 'Retail Space', desc: 'Storefronts and commercial space for makers and designers', borderClass: 'cat-border-retail' },
  { label: 'Fitness & Dance', desc: 'Dance studios, yoga spaces, and movement studios', borderClass: 'cat-border-fitness' },
]

const FREE_FEATURES = [
  'Your space listed in the directory',
  'Searchable by Portland creatives',
  'Inquiry form on your listing',
  'No credit card required',
]

const PRO_FEATURES = [
  'Everything in Free',
  'Inquiries delivered to your inbox',
  'Verified Space badge',
  'Priority in search results',
]

export default function ForLandlordsPage() {
  return (
    <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen">

      <Suspense fallback={null}>
        <CheckoutResult />
      </Suspense>

      {/* Section 1: Hero */}
      <section
        id="proof"
        style={{
          borderBottom: '1px solid var(--rule)',
          backgroundImage: 'radial-gradient(circle, #c8c4bb 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        className="px-6"
      >
        <div className="mx-auto max-w-4xl py-24">
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="text-4xl font-semibold leading-tight sm:text-5xl">
            Reach Portland Creatives Looking for Monthly Studio Space
          </h1>
          <p style={{ color: 'var(--stone)' }} className="mt-5 max-w-2xl text-base leading-relaxed">
            List your space free. Get real inquiries from artists, makers, musicians, and producers searching right now.
          </p>
          <div className="mt-8">
            <Link
              href="/list-your-space"
              style={{ width: 'auto' }}
              className="btn-action inline-block px-6 py-3 text-sm font-medium"
            >
              List Your Space Free →
            </Link>
          </div>
          <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mt-5 text-xs">
            No contracts. No setup fees. Cancel anytime.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-20 px-6 py-16">

        {/* Section 2: Proof of Demand */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-8 text-2xl font-semibold">
            Portland creatives are searching right now
          </h2>
          <div className="listing-grid mb-8" style={{ background: 'var(--rule)', gap: '1px' }}>
            <div style={{ background: 'var(--surface)' }} className="p-8">
              <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '2.5rem' }} className="font-semibold leading-none">
                Free
              </p>
              <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mt-2 text-sm">
                to list your space — no credit card required
              </p>
            </div>
            <div style={{ background: 'var(--surface)' }} className="p-8">
              <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '2.5rem' }} className="font-semibold leading-none">
                6
              </p>
              <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mt-2 text-sm">
                space categories: art, workshop, photo, office, retail, fitness
              </p>
            </div>
            <div style={{ background: 'var(--surface)' }} className="p-8">
              <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '2.5rem' }} className="font-semibold leading-none">
                Monthly
              </p>
              <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mt-2 text-sm">
                rental terms — not hourly, not daily
              </p>
            </div>
          </div>
          <p style={{ color: 'var(--stone)' }} className="max-w-2xl text-sm leading-relaxed">
            FindStudioSpace is Portland&apos;s only directory focused on monthly creative workspace rentals. Every person who visits is looking for a space like yours — not a one-off event booking.
          </p>
        </section>

        {/* Section 3: How It Works */}
        <section id="how-it-works" style={{ borderTop: '1px solid var(--rule)' }} className="pt-16">
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-10 text-2xl font-semibold">
            How it works
          </h2>
          <div className="listing-grid">
            {[
              {
                num: '01',
                title: 'Submit your space',
                desc: 'Fill out our simple form. Add photos, description, pricing, and amenities. Takes about 5 minutes.',
              },
              {
                num: '02',
                title: 'Get discovered',
                desc: 'Your listing appears in our directory immediately. Creatives searching for your space type and neighborhood find you.',
              },
              {
                num: '03',
                title: 'Receive inquiries',
                desc: 'Interested tenants submit their contact info directly through your listing. You respond and connect directly.',
              },
            ].map(({ num, title, desc }) => (
              <div key={num} style={{ background: 'var(--surface)', border: '1px solid var(--rule)' }} className="p-8">
                <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)', fontSize: '2rem' }} className="font-medium leading-none mb-4">
                  {num}
                </p>
                <p style={{ color: 'var(--ink)' }} className="mb-2 font-semibold">
                  {title}
                </p>
                <p style={{ color: 'var(--stone)' }} className="text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: What Types of Spaces */}
        <section style={{ borderTop: '1px solid var(--rule)' }} className="pt-16">
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-8 text-2xl font-semibold">
            What types of spaces list here
          </h2>
          <div className="listing-grid">
            {SPACE_TYPES.map(({ label, desc, borderClass }) => (
              <div key={label} className={`listing-card-base ${borderClass} p-6`}>
                <p style={{ color: 'var(--ink)' }} className="font-semibold">
                  {label}
                </p>
                <p style={{ color: 'var(--stone)' }} className="mt-1 text-sm">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Pricing */}
        <section style={{ borderTop: '1px solid var(--rule)' }} className="pt-16">
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-2 text-2xl font-semibold">
            Simple, transparent pricing
          </h2>
          <p style={{ color: 'var(--stone)' }} className="mb-10 text-sm">
            Start free. Upgrade when you&apos;re ready.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start max-w-2xl mx-auto">

            {/* Free */}
            <div style={{ border: '1px solid var(--rule)', background: 'var(--surface)' }} className="p-8">
              <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }} className="mb-1 text-xs uppercase">Free forever</p>
              <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '2rem' }} className="font-semibold mb-6">
                $0<span style={{ fontSize: '1rem', color: 'var(--stone)' }}>/month</span>
              </p>
              <ul className="mb-8 space-y-2">
                {FREE_FEATURES.map((f) => (
                  <li key={f} style={{ color: 'var(--stone)' }} className="flex gap-2 text-sm">
                    <span style={{ color: '#a84530' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/list-your-space"
                style={{ border: '1px solid var(--ink)', color: 'var(--ink)', background: 'transparent' }}
                className="inline-block w-full py-2.5 text-center text-sm font-medium hover:bg-[var(--rule)] transition-colors"
              >
                List for Free
              </Link>
            </div>

            {/* Pro */}
            <div style={{ border: '2px solid #a84530', background: 'var(--surface)' }} className="p-8">
              <p style={{ fontFamily: 'var(--font-mono)', color: '#b8820a' }} className="mb-1 text-xs uppercase font-medium">
                Most popular
              </p>
              <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '2rem' }} className="font-semibold mb-6">
                $29<span style={{ fontSize: '1rem', color: 'var(--stone)' }}>/month</span>
              </p>
              <ul className="mb-8 space-y-2">
                {PRO_FEATURES.map((f) => (
                  <li key={f} style={{ color: 'var(--stone)' }} className="flex gap-2 text-sm">
                    <span style={{ color: '#a84530' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <UpgradeButton tier="pro" label="Start Pro →" />
            </div>

          </div>
        </section>

      </div>

      {/* Section 6: Bottom CTA */}
      <section style={{ background: '#a84530', color: 'var(--paper)' }} className="px-6 py-20 text-center">
        <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mb-3 text-2xl font-semibold">
          Ready to reach Portland creatives?
        </h2>
        <p style={{ color: '#f5e6e0' }} className="mx-auto mb-8 max-w-md text-sm">
          Portland&apos;s creative workspace directory. First listing is always free.
        </p>
        <Link
          href="/list-your-space"
          style={{ background: 'var(--paper)', color: '#a84530' }}
          className="inline-block px-8 py-3 text-sm font-semibold hover:bg-[var(--surface)] transition-colors"
        >
          List Your Space Free →
        </Link>
      </section>

    </main>
  )
}
