import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Listing Submitted | FindStudioSpace' }

export default function SuccessPage() {
  return (
    <main style={{ background: 'var(--paper)' }} className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="text-2xl font-semibold">
          You&apos;re live.
        </h1>
        <p style={{ color: 'var(--stone)' }} className="mt-3 text-sm">
          Your featured listing will be published within 24 hours. Check your email for confirmation.
        </p>
        <Link
          href="/"
          style={{ width: '100%' }}
          className="btn-action mt-6 inline-block px-6 py-2.5 text-sm font-medium"
        >
          Back to listings
        </Link>
      </div>
    </main>
  )
}
