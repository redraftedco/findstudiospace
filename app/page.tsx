import { Metadata } from 'next'
import Link from 'next/link'
import HomepageSearch from '@/components/HomepageSearch'

export const metadata: Metadata = {
  title: 'Studio Space for Rent — Portland & Atlanta | FindStudioSpace',
  description: 'Browse 120+ photo studios, art rooms, podcast studios, event spaces, and creative workspace for rent in Portland, OR and Atlanta, GA. No booking fees.',
  alternates: { canonical: 'https://www.findstudiospace.com' },
  openGraph: {
    title: 'Studio Space for Rent — Portland & Atlanta | FindStudioSpace',
    description: 'Browse 120+ creative workspaces for rent. Photo studios, art rooms, podcast studios, makerspaces, event spaces. Portland & Atlanta.',
    url: 'https://www.findstudiospace.com',
    type: 'website',
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FindStudioSpace',
  url: 'https://www.findstudiospace.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://www.findstudiospace.com/portland?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I find studio space for rent in Portland?',
      acceptedAnswer: { '@type': 'Answer', text: 'Browse FindStudioSpace to search photo studios, art rooms, podcast studios, makerspaces, and event spaces across Portland neighborhoods. Contact studios directly — no booking fees or commissions.' },
    },
    {
      '@type': 'Question',
      name: 'What types of creative workspace are available?',
      acceptedAnswer: { '@type': 'Answer', text: 'Portland and Atlanta listings include photo studios, art studios, podcast and recording studios, event spaces, makerspaces, workshops, and shared creative offices.' },
    },
    {
      '@type': 'Question',
      name: 'Does FindStudioSpace charge booking fees?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. FindStudioSpace is a free directory. Renters contact studios directly. There are no booking fees, commissions, or mandatory platform transactions.' },
    },
    {
      '@type': 'Question',
      name: 'What neighborhoods have the most studio space in Portland?',
      acceptedAnswer: { '@type': 'Answer', text: 'The Central Eastside Industrial District, Pearl District, Alberta Arts District, and Kerns have the highest concentration of creative studio space for rent in Portland.' },
    },
  ],
}

const SPACE_TYPES = [
  { label: 'Photo Studios', href: '/portland/photo-studio', desc: 'Natural light, cycloramas, lighting rigs' },
  { label: 'Art Studios', href: '/portland/art-studio', desc: 'Private and shared creative rooms' },
  { label: 'Podcast Studios', href: '/podcast-studios', desc: 'Soundproofed, mic-ready recording rooms' },
  { label: 'Event Spaces', href: '/event-spaces-portland', desc: 'Galleries, lofts, industrial venues' },
  { label: 'Makerspaces', href: '/makerspace-portland', desc: 'Workshop tools, woodworking, fabrication' },
  { label: 'Video Production', href: '/video-production-studios-portland', desc: 'Stages, green screen, grip-friendly loading' },
]

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main style={{ background: 'var(--paper)', color: 'var(--ink)' }}>

        {/* Hero */}
        <section style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px 64px',
        }}>
          <div style={{ maxWidth: '600px', width: '100%' }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--stone)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              margin: '0 0 24px',
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
              margin: '0 0 12px',
            }}>
              Studio space for rent.<br />Creative workspace found.
            </h1>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--stone)',
              margin: '0 0 40px',
              lineHeight: 1.6,
            }}>
              120+ photo studios, art rooms, podcast studios, makerspaces, and event spaces in Portland and Atlanta. Contact studios directly — no fees.
            </p>

            <HomepageSearch />

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--stone)', marginTop: '24px' }}>
              Own a studio?{' '}
              <Link href="/list-your-space" style={{ color: 'var(--action)', textDecoration: 'underline' }}>
                List free →
              </Link>
            </p>
          </div>
        </section>

        {/* Cities */}
        <section style={{ borderTop: '1px solid var(--rule)', padding: '56px 24px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 24px' }}>
              Browse by city
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {[
                { city: 'Portland, OR', slug: 'portland', count: '119', desc: 'Central Eastside, Pearl District, Alberta Arts, Kerns' },
                { city: 'Atlanta, GA', slug: 'atlanta', count: 'New', desc: 'Old Fourth Ward, West Midtown, Ponce City Market area' },
              ].map(c => (
                <Link key={c.slug} href={`/${c.slug}`} style={{ textDecoration: 'none', display: 'block', border: '1px solid var(--rule)', padding: '24px' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
                    {c.count} listings
                  </p>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 6px' }}>
                    {c.city}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--stone)', margin: 0 }}>
                    {c.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Space types */}
        <section style={{ borderTop: '1px solid var(--rule)', padding: '56px 24px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 24px' }}>
              Browse by type
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', border: '1px solid var(--rule)' }}>
              {SPACE_TYPES.map(t => (
                <Link key={t.href} href={t.href} style={{ textDecoration: 'none', display: 'block', padding: '20px', background: 'var(--paper)', borderRight: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 4px' }}>
                    {t.label}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--stone)', margin: 0 }}>
                    {t.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section style={{ borderTop: '1px solid var(--rule)', padding: '56px 24px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 24px' }}>
              How it works
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
              {[
                { n: '01', title: 'Search the directory', body: 'Filter by space type, neighborhood, or keyword. Every listing has contact info.' },
                { n: '02', title: 'Contact the studio', body: 'Reach out directly to ask about availability, pricing, and lease terms.' },
                { n: '03', title: 'Rent on your terms', body: 'No platform fees. No mandatory booking flow. Your agreement, your studio.' },
              ].map(s => (
                <div key={s.n}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--stone)', margin: '0 0 8px' }}>{s.n}</p>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 6px' }}>{s.title}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--stone)', lineHeight: 1.6, margin: 0 }}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ borderTop: '1px solid var(--rule)', padding: '56px 24px 80px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 32px' }}>
              Common questions
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {faqSchema.mainEntity.map(q => (
                <div key={q.name} style={{ borderTop: '1px solid var(--rule)', paddingTop: '20px' }}>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 8px' }}>{q.name}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--stone)', lineHeight: 1.7, margin: 0 }}>{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
