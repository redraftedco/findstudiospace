import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Listing Submitted | FindStudioSpace' }

export default function SuccessPage() {
  return (
    <main style={{ background: '#f4f1eb' }} className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="text-2xl font-semibold">
          You&apos;re live.
        </h1>
        <p style={{ color: '#8c8680' }} className="mt-3 text-sm">
          Your featured listing will be published within 24 hours. Check your email for confirmation.
        </p>
        <Link
          href="/"
          style={{ background: '#2c4a3e', color: '#f4f1eb' }}
          className="mt-6 inline-block px-6 py-2.5 text-sm font-medium hover:opacity-90"
        >
          Back to listings
        </Link>
      </div>
    </main>
  )
}
