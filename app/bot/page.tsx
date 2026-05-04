import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FindStudioSpaceBot, Web Crawler Disclosure | FindStudioSpace',
  description:
    'Information about the FindStudioSpaceBot web crawler: what it collects, why it runs, and how to opt your site out.',
  alternates: { canonical: '/bot' },
}

const CONTACT_EMAIL = 'hello@findstudiospace.com'
const BOT_UA = 'FindStudioSpaceBot/1.0 (+https://findstudiospace.com/bot; contact: hello@findstudiospace.com)'

export default function BotPage() {
  return (
    <main className="px-6 py-12 md:py-16">
      <article
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          color: 'var(--ink)',
          fontFamily: 'var(--font-body)',
        }}
      >
        <h1
          style={{ fontFamily: 'var(--font-heading)' }}
          className="text-4xl md:text-5xl font-semibold tracking-tight mb-2"
        >
          FindStudioSpaceBot
        </h1>
        <p style={{ color: 'var(--stone)' }} className="text-sm mb-10">
          Web crawler disclosure
        </p>

        <section className="mb-8">
          <p className="text-base leading-relaxed mb-4">
            FindStudioSpaceBot is a web crawler operated by FindStudioSpace. It runs nightly to
            discover and update listings for creative studio spaces, photography studios,
            makerspaces, event venues, podcast studios, and similar spaces, in Portland and
            nearby cities.
          </p>
          <p className="text-base leading-relaxed">
            This page explains what the bot collects, why, and how to opt out.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-xl font-semibold mb-3"
          >
            User-agent string
          </h2>
          <code
            style={{
              display: 'block',
              background: 'var(--surface)',
              padding: '12px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              wordBreak: 'break-all',
              color: 'var(--ink)',
            }}
          >
            {BOT_UA}
          </code>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-xl font-semibold mb-3"
          >
            What it collects
          </h2>
          <ul className="text-base leading-relaxed space-y-2 list-disc pl-5">
            <li>Business name and category (photography studio, makerspace, event venue, etc.)</li>
            <li>Publicly listed contact email addresses found on contact and about pages</li>
            <li>Website URL and city/neighborhood</li>
            <li>Whether the space advertises rental, pricing, or booking information</li>
          </ul>
          <p className="text-base leading-relaxed mt-4">
            The bot does not collect passwords, form data, or any content behind a login. It reads
            only publicly accessible HTML pages. It makes at most one request per second to any
            single domain.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-xl font-semibold mb-3"
          >
            Why it runs
          </h2>
          <p className="text-base leading-relaxed mb-4">
            FindStudioSpace lists studio and creative workspace rentals so renters can find them.
            The crawler helps us keep listings accurate and discover spaces that aren&apos;t yet in
            the directory. If your space appears in our directory and the listing is inaccurate, you
            can claim and update it for free at{' '}
            <Link href="/claim" style={{ color: 'var(--action)' }}>
              findstudiospace.com/claim
            </Link>
            .
          </p>
          <p className="text-base leading-relaxed">
            We may send one cold outreach email to a publicly listed contact address to let you
            know your space is in the directory and to offer you the option to claim or remove the
            listing. Every email we send includes an unsubscribe option. We do not send follow-up
            sequences.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-xl font-semibold mb-3"
          >
            How to opt out
          </h2>
          <p className="text-base leading-relaxed mb-4">
            <strong>Block the bot via robots.txt</strong>, add the following to your{' '}
            <code style={{ fontSize: '13px' }}>robots.txt</code> and the crawler will not visit
            your site again:
          </p>
          <code
            style={{
              display: 'block',
              background: 'var(--surface)',
              padding: '12px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            {`User-agent: FindStudioSpaceBot\nDisallow: /`}
          </code>
          <p className="text-base leading-relaxed mb-4">
            <strong>Request listing removal</strong>, email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--action)' }}>
              {CONTACT_EMAIL}
            </a>{' '}
            with the subject &ldquo;Remove my listing&rdquo; and we&apos;ll remove your business
            from the directory within 48 hours.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Unsubscribe from email</strong>, reply &ldquo;unsubscribe&rdquo; to any email
            we&apos;ve sent and we&apos;ll stop all outreach within 48 hours.
          </p>
        </section>

        <section className="mb-8">
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-xl font-semibold mb-3"
          >
            Contact
          </h2>
          <p className="text-base leading-relaxed">
            Questions about the bot or your listing:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--action)' }}>
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>
      </article>
    </main>
  )
}
