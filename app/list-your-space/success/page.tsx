import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Listing Submitted | FindStudioSpace' }

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-4xl">🎉</p>
        <h1 className="mt-4 text-2xl font-bold">You're live!</h1>
        <p className="mt-3 text-gray-500">
          Your featured listing will be published within 24 hours. Check your email for confirmation.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Back to listings
        </Link>
      </div>
    </main>
  )
}
