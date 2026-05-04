import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { CheckoutResult } from '@/components/CheckoutResult'

export const metadata: Metadata = {
  title: 'List Your Studio Space Free — Portland & Atlanta | FindStudioSpace',
  description:
    'Reach creatives looking for monthly studio, workshop, art, and office space rentals. Free to list. Get real inquiries from artists, makers, and producers in Portland and Atlanta.',
  openGraph: {
    title: 'List Your Studio Space Free — Portland & Atlanta | FindStudioSpace',
    description:
      'Reach creatives looking for monthly studio, workshop, art, and office space rentals. Free to list in Portland and Atlanta.',
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

const SPONSORED_FEATURES = [
  'Everything in Free',
  'Sponsored placement on one page',
  'Category or neighborhood targeting',
  'Clearly labeled Sponsored slot',
  'Monthly billing through Stripe',
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
          backgroundImage: 'radial-gradient(circle, rgba(250,247,239,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        className="px-6"
      >
        <div className="mx-auto max-w-4xl py-24">
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="text-4xl font-semibold leading-tight sm:text-5xl">
            Reach Creatives Looking for Monthly Studio Space
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

      {/* Section 1.5: Free Photography Offer (P2-A — caps at n=10) */}
      <section
        style={{
          borderBottom: '1px solid var(--rule)',
          background: 'var(--surface)',
        }}
        className="px-6"
      >
        <div className="mx-auto max-w-4xl py-14">
          <p style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--lime)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }} className="mb-3">
            Limited · First 10 landlords only
          </p>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="text-3xl font-semibold leading-tight sm:text-4xl">
            Free professional photos for your space
          </h2>
          <p style={{ color: 'var(--stone)' }} className="mt-4 max-w-2xl text-base leading-relaxed">
            Listings with professional photography get 3–5x more inquiries than phone snapshots. We&apos;re offering a free 1-hour photo shoot to the first 10 landlords who list — no strings, photos are yours to keep, and there is no requirement to buy sponsored placement.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/list-your-space"
              className="btn-action inline-block px-6 py-3 text-sm font-medium"
            >
              Claim your free photos →
            </Link>
            <Link
              href="#how-it-works"
              style={{
                border: '1px solid var(--rule)',
                color: 'var(--ink)',
                fontFamily: 'var(--font-mono)',
              }}
              className="inline-block px-6 py-3 text-xs uppercase tracking-wider hover:bg-[var(--paper)] transition-colors"
            >
              How it works
            </Link>
          </div>
          <p style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }} className="mt-5 text-xs">
            Submit your listing first — we&apos;ll reach out within 48 hours to schedule.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-20 px-6 py-16">

        {/* Section 2: Proof of Demand */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-8 text-2xl font-semibold">
            Creatives are searching right now
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
            FindStudioSpace is a directory focused on monthly creative workspace rentals in Portland and Atlanta. Every person who visits is looking for a space like yours — not a one-off event booking.
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
            Start free. Add sponsored placement when you want more visibility.
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
                    <span style={{ color: 'var(--lime)' }}>✓</span> {f}
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

            {/* Sponsored Placement */}
            <div style={{ border: '2px solid var(--action)', background: 'var(--surface)', position: 'relative' }} className="p-8">
              <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--action)' }} className="mb-1 text-xs uppercase font-medium">
                Sponsored placement
              </p>
              <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '2rem' }} className="font-semibold mb-6">
                $49<span style={{ fontSize: '1rem', color: 'var(--stone)' }}>/month</span>
              </p>
              <ul className="mb-8 space-y-2">
                {SPONSORED_FEATURES.map((f) => (
                  <li key={f} style={{ color: 'var(--stone)' }} className="flex gap-2 text-sm">
                    <span style={{ color: 'var(--action)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/advertise"
                style={{ background: 'var(--action)', color: 'var(--paper)', border: 'none' }}
                className="inline-block w-full py-2.5 text-center text-sm font-medium"
              >
                See placement options →
              </Link>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--stone)', textAlign: 'center', marginTop: '8px' }}>
                Starts at $49/month. Cancel anytime.
              </p>
            </div>

          </div>
        </section>

      </div>

      {/* Section 6: Bottom CTA */}
      <section style={{ background: 'var(--lime)', color: 'var(--paper)' }} className="px-6 py-20 text-center">
        <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mb-3 text-2xl font-semibold">
          Studio space for rent. Creative workspace found.
        </h2>
        <p style={{ color: 'rgba(13,13,13,0.75)' }} className="mx-auto mb-8 max-w-md text-sm">
          Creative workspace directory. First listing is always free.
        </p>
        <Link
          href="/list-your-space"
          style={{ background: 'var(--paper)', color: 'var(--lime)' }}
          className="inline-block px-8 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          List Your Space Free →
        </Link>
      </section>

    </main>
  )
}
