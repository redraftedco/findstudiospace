import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found | FindStudioSpace',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main
      style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '60vh' }}
      className="flex items-center px-6 py-24"
    >
      <div className="mx-auto max-w-2xl">
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--stone)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '1.25rem',
          }}
        >
          404 — Lost in Portland
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            fontWeight: 400,
            lineHeight: 0.92,
            letterSpacing: '0.01em',
            color: 'var(--ink)',
            margin: '0 0 1.5rem',
          }}
        >
          That page doesn&apos;t exist.
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--stone)',
            fontSize: '1.0625rem',
            lineHeight: 1.6,
            maxWidth: '42ch',
            marginBottom: '2.5rem',
          }}
        >
          The studio you&apos;re looking for may have been removed, claimed, or
          the link might have a typo. Try browsing the Portland directory instead.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/portland"
            className="btn-action"
            style={{
              padding: '12px 22px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Browse Portland studios →
          </Link>
          <Link
            href="/list-your-space"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 22px',
              border: '1px solid var(--rule)',
              color: 'var(--ink)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              textDecoration: 'none',
            }}
          >
            List your space
          </Link>
        </div>
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--rule)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          {[
            { label: 'Event Space', href: '/portland/event-space' },
            { label: 'Photo Studios', href: '/portland/photo-studios' },
            { label: 'Makerspace', href: '/portland/makerspace' },
            { label: 'Content Studios', href: '/portland/content-studios' },
            { label: 'Central Eastside', href: '/portland/central-eastside' },
            { label: 'Pearl District', href: '/portland/pearl-district' },
          ].map(({ label, href }) => (
            <Link key={href} href={href} className="hero-chip">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
