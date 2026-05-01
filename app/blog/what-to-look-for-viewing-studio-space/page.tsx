import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'What to Look for When Viewing a Studio Space in Portland | FindStudioSpace',
  description:
    'A practical checklist for viewing studio space in Portland — light, power, noise, access, and structural red flags to check before committing.',
  alternates: { canonical: 'https://www.findstudiospace.com/blog/what-to-look-for-viewing-studio-space' },
  openGraph: {
    title: 'What to Look for When Viewing a Studio Space in Portland',
    description:
      'A practical checklist for studio viewings in Portland — light, power, noise, access, and structural red flags to check before committing.',
    url: 'https://www.findstudiospace.com/blog/what-to-look-for-viewing-studio-space',
    type: 'article',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What to Look for When Viewing a Studio Space in Portland',
  datePublished: '2026-05-01',
  dateModified: '2026-05-01',
  author: { '@type': 'Organization', name: 'FindStudioSpace', url: 'https://www.findstudiospace.com' },
  publisher: {
    '@type': 'Organization',
    name: 'FindStudioSpace',
    url: 'https://www.findstudiospace.com',
    logo: { '@type': 'ImageObject', url: 'https://www.findstudiospace.com/og-default.svg' },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.findstudiospace.com/blog/what-to-look-for-viewing-studio-space' },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Evaluate a Studio Space During a Viewing',
  step: [
    { '@type': 'HowToStep', name: 'Assess the light', text: 'Visit at the time of day you will typically use the space. Note the direction of windows (north light is ideal for artists), whether natural light reaches your work area, and what supplemental lighting is available.' },
    { '@type': 'HowToStep', name: 'Test the power', text: 'Count the outlets and check their location. Bring a phone charger to test, or ask to plug in a device. For workshops, ask about 220v availability and amperage.' },
    { '@type': 'HowToStep', name: 'Check for noise', text: 'Sit quietly for two minutes. Listen for HVAC hum, street noise, neighbor sound bleed, and building vibration. Note whether it is tolerable for your practice.' },
    { '@type': 'HowToStep', name: 'Inspect for moisture', text: 'Look at the floor corners and wall bases for watermarks, efflorescence, or soft spots. Check under any sinks. Smell the air for mustiness.' },
    { '@type': 'HowToStep', name: 'Test access on your schedule', text: 'Ask to visit at the hours you will actually use the space, not just during the landlord\'s preferred showing time.' },
    { '@type': 'HowToStep', name: 'Ask about the neighbors', text: 'Find out who is in adjacent spaces and what they do. Noise, dust, and vibration transfer from neighboring tenants.' },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.findstudiospace.com' },
    { '@type': 'ListItem', position: 2, name: 'Resources', item: 'https://www.findstudiospace.com/blog' },
    { '@type': 'ListItem', position: 3, name: 'What to Look for Viewing a Studio' },
  ],
}

export default function Post() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <nav style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }} className="mb-10 text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            {' / '}
            <Link href="/blog" className="hover:underline">Resources</Link>
            {' / '}
            <span>Viewing a Studio Space</span>
          </nav>

          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }} className="mb-4 text-xs">May 1, 2026</p>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-8 text-3xl font-semibold leading-tight">
            What to Look for When Viewing a Studio Space in Portland
          </h1>

          <div style={{ color: 'var(--ink)' }} className="space-y-6 text-sm leading-relaxed">

            <p>
              Studio viewings in Portland are usually short — 15 to 20 minutes with the landlord present, often at a time of day that doesn&apos;t reflect how you&apos;ll actually use the space. The photos in the listing showed you the best angle on the best day. The viewing is your one chance to find out what the photos didn&apos;t show.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Light: the most underestimated variable</h2>

            <p>
              Natural light changes dramatically by time of day, season, and window orientation. A studio that looks bright at noon in a listing photo may be dim and unusable by 3pm in November. Here&apos;s what to assess:
            </p>
            <ul className="space-y-2 pl-4">
              <li><strong>Window direction:</strong> North light is consistent and shadowless — ideal for painters, photographers, and anyone who needs color-accurate light without harsh direct sun. South and west windows get direct sun that changes rapidly and creates strong shadows.</li>
              <li><strong>Time of day:</strong> Ask to view the space at the time of day you&apos;ll typically use it, not at the landlord&apos;s preferred showing window. A morning-person painter has very different light needs than someone who works evenings.</li>
              <li><strong>Supplemental lighting:</strong> What fixtures are installed? Where are they aimed? Overhead fluorescents are harsh and color-inaccurate. Look for daylight-balanced fixtures or plan to bring your own.</li>
              <li><strong>Obstruction:</strong> Buildings adjacent to the windows can shift light significantly over the course of a year as the sun angle changes. Note what&apos;s outside the windows and how close it is.</li>
            </ul>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Power: count the circuits, not just the outlets</h2>

            <p>
              Outlet count is only part of the story. More important is how many circuits are available and what they&apos;re rated for.
            </p>
            <ul className="space-y-2 pl-4">
              <li>A single 15-amp circuit at 120v delivers about 1,800 watts of continuous power — enough for a laptop, a light, and not much else. Running a kiln, compressor, or table saw will require dedicated 220v circuits.</li>
              <li>Ask to see the breaker panel. Count the circuits. Note whether any are labeled for the studio specifically or shared with other tenants.</li>
              <li>For workshops: confirm whether 220v single-phase power is available, and whether the landlord will allow installation of additional outlets or panel upgrades.</li>
              <li>Test at least two outlets with a phone charger — dead outlets are common in older Portland industrial buildings and may indicate wiring issues.</li>
            </ul>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Noise: sit and listen</h2>

            <p>
              Ask the landlord if you can sit quietly in the space for two minutes before or after the tour. This is a reasonable request that gives you a baseline ambient noise assessment.
            </p>
            <ul className="space-y-2 pl-4">
              <li>HVAC noise: older forced-air systems in industrial buildings can be surprisingly loud. Note whether it&apos;s constant or intermittent.</li>
              <li>Neighbor noise: listen for tool sounds, music, voice, or impact noise from adjacent studios.</li>
              <li>Street noise: particularly relevant for ground-floor spaces near Grand or MLK in the Central Eastside, which see significant truck traffic.</li>
              <li>Building vibration: some older industrial buildings transmit vibration from heavy equipment in adjacent spaces. You&apos;ll feel it in the floor.</li>
            </ul>
            <p>
              What&apos;s tolerable depends entirely on your practice. A ceramicist working with clay doesn&apos;t need quiet. A podcast producer or mixing engineer does. Calibrate your standards accordingly.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Moisture: the hidden problem</h2>

            <p>
              Portland&apos;s wet climate makes moisture the most common hidden problem in older studio buildings. Look for:
            </p>
            <ul className="space-y-2 pl-4">
              <li>Water stains on floors, walls, and ceilings — especially at baseboards and in corners</li>
              <li>Efflorescence (white mineral deposits) on concrete or masonry walls, which indicates water wicking through</li>
              <li>Soft spots in wood flooring or baseboards</li>
              <li>Smell — mustiness or earthy smell in a closed space usually means moisture history</li>
              <li>The condition of any windows: fogged double-pane glass indicates failed seals and possible moisture infiltration</li>
            </ul>
            <p>
              Moisture problems in older Portland buildings almost never get better on their own. If you see signs of past water infiltration, ask directly what was done about it and when.
            </p>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Access: test it on your schedule</h2>

            <p>
              Landlords typically show studios during business hours. But if you work late evenings or early mornings — which many working artists do — the access hours are a real operational constraint.
            </p>
            <ul className="space-y-2 pl-4">
              <li>Ask about the actual hours the building is accessible, not just that it has &quot;24-hour access.&quot; Confirm that your specific studio door is accessible at all hours, not just the building lobby.</li>
              <li>Check how entry works: key, fob, or code. Codes are sometimes limited to certain hours on older systems.</li>
              <li>Ask about freight elevator availability if you&apos;ll be moving large materials or equipment.</li>
            </ul>

            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mt-10 text-xl font-semibold">Before you leave: questions to ask on-site</h2>

            <ul className="space-y-2 pl-4">
              <li>How long has the space been vacant, and why did the previous tenant leave?</li>
              <li>Have there been any lease disputes, complaints, or building-wide issues in the last year?</li>
              <li>Is there anything about the space the listing didn&apos;t mention that I should know?</li>
            </ul>
            <p>
              These feel like uncomfortable questions but they&apos;re standard due diligence. A landlord who bristles at any of them is a landlord who may be difficult to work with later.
            </p>

            <div style={{ borderTop: '1px solid var(--rule)' }} className="mt-12 pt-8">
              <p style={{ color: 'var(--stone)' }} className="text-sm">
                Browse <Link href="/portland" style={{ color: 'var(--ink)' }} className="underline">studio space for rent in Portland</Link>. Related:{' '}
                <Link href="/blog/questions-to-ask-before-renting-studio-portland" style={{ color: 'var(--ink)' }} className="underline">12 questions to ask before signing</Link> ·{' '}
                <Link href="/blog/how-to-negotiate-studio-lease-portland" style={{ color: 'var(--ink)' }} className="underline">How to negotiate a studio lease</Link>
              </p>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
