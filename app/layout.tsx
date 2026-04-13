import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Portland Studios — Find & Rent Studio Space in Portland, OR',
  description:
    'Portland Studios is the easiest way to find and book photo studios, music recording studios, and art studios in Portland, OR.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white px-4 py-3">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/" className="font-semibold text-gray-900 hover:text-blue-600">
              FindStudioSpace
            </Link>
            <Link
              href="/list-your-space"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              List your space
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}