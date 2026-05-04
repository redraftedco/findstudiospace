import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Find Studio Space — Creative Workspace Rentals | FindStudioSpace',
  description: 'Browse photo studios, art studios, workshops, and creative workspace for rent. Portland and Atlanta.',
  alternates: { canonical: 'https://www.findstudiospace.com' },
}

const CITIES = [
  {
    slug: 'portland',
    name: 'Portland',
    state: 'OR',
    note: 'Central Eastside, Pearl District, Alberta Arts, and beyond.',
    accent: '#14532D',
  },
  {
    slug: 'atlanta',
    name: 'Atlanta',
    state: 'GA',
    note: 'Old Fourth Ward, West Midtown, Castleberry Hill, and beyond.',
    accent: '#c0392b',
  },
]

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', padding: '80px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '640px', width: '100%' }}>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>
          FindStudioSpace
        </p>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 16px' }}>
          Studio rentals &<br />creative workspace.
        </h1>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--stone)', margin: '0 0 56px', lineHeight: 1.6 }}>
          Photo studios, art rooms, workshops, and event space — monthly rentals, no commission.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {CITIES.map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                border: '1px solid var(--rule)',
                padding: '28px 24px',
                background: 'var(--surface)',
                transition: 'border-color 0.15s',
              }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                  {city.state}
                </p>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: city.accent, margin: '0 0 8px', lineHeight: 1 }}>
                  {city.name}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--stone)', margin: '0 0 20px', lineHeight: 1.5 }}>
                  {city.note}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink)', margin: 0 }}>
                  Browse studios →
                </p>
              </div>
            </Link>
          ))}
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--stone)', marginTop: '40px' }}>
          Own a studio?{' '}
          <Link href="/list-your-space" style={{ color: 'var(--action)', textDecoration: 'underline' }}>
            List free →
          </Link>
        </p>

      </div>
    </main>
  )
}
