import { Metadata } from 'next'
import Link from 'next/link'
import HomepageSearch from '@/components/HomepageSearch'

export const metadata: Metadata = {
  title: 'Find Studio Space — Creative Workspace Rentals | FindStudioSpace',
  description: 'Search photo studios, art rooms, workshops, and creative workspace for rent in Portland and Atlanta.',
  alternates: { canonical: 'https://www.findstudiospace.com' },
}

export default function HomePage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--paper)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
    }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--stone)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          margin: '0 0 28px',
        }}>
          FindStudioSpace
        </p>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2rem, 6vw, 3.25rem)',
          fontWeight: 700,
          color: 'var(--ink)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: '0 0 48px',
        }}>
          Find studio space &<br />creative workspace.
        </h1>

        <HomepageSearch />

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: 'var(--stone)',
          marginTop: '32px',
        }}>
          Own a studio?{' '}
          <Link href="/list-your-space" style={{ color: 'var(--action)', textDecoration: 'underline' }}>
            List free →
          </Link>
        </p>

      </div>
    </main>
  )
}
