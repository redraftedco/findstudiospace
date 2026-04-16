import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google'
import PostHogProvider from '@/components/PostHogProvider'
import UTMCapture from '@/components/UTMCapture'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
})
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.findstudiospace.com'),
  title: 'Find Studio Space in Portland, OR | FindStudioSpace',
  description:
    'Browse photo studios, art studios, workshops, offices, retail, and fitness spaces for rent in Portland, OR.',
  alternates: {
    canonical: './',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable}`}>
      <body>
        <PostHogProvider>
        <Suspense fallback={null}><UTMCapture /></Suspense>
        <header style={{ borderBottom: '1px solid #d6d0c4', background: '#f4f1eb' }} className="px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/" style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="text-lg font-semibold tracking-tight">
              FindStudioSpace
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/for-landlords"
                style={{ color: '#6b6762', fontFamily: 'var(--font-body)' }}
                className="text-sm hover:underline"
              >
                For Landlords
              </Link>
            <Link
              href="/list-your-space"
              style={{ color: '#a84530', fontFamily: 'var(--font-body)' }}
              className="text-sm font-medium hover:underline"
            >
              List your space
            </Link>
            </div>
          </div>
        </header>
        {children}
        <footer style={{ borderTop: '1px solid #d6d0c4', color: '#6b6762' }} className="mt-16 px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-sm">

              {/* Column 1 — Brand */}
              <div>
                <p style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="font-semibold mb-2">
                  FindStudioSpace
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', lineHeight: 1.6 }} className="text-xs">
                  Portland&apos;s creative studio directory.
                </p>
                <p style={{ fontFamily: 'var(--font-mono)' }} className="text-xs mt-3">
                  findstudiospace.com — Portland, OR
                </p>
              </div>

              {/* Column 2 — Browse by Category */}
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', color: '#1a1814' }} className="text-xs uppercase tracking-wider font-medium mb-3">
                  Browse by Category
                </p>
                <div className="flex flex-col gap-2">
                  <Link href="/portland/art-studio" className="hover:underline">Art Studios</Link>
                  <Link href="/portland/workshop-space-rental" className="hover:underline">Workshop Space</Link>
                  <Link href="/portland/office-space-rental" className="hover:underline">Office Space</Link>
                  <Link href="/portland/photo-studio-rental" className="hover:underline">Photo Studios</Link>
                  <Link href="/portland/fitness-studio-rental" className="hover:underline">Fitness &amp; Dance</Link>
                  <Link href="/portland/music-rehearsal-space" className="hover:underline">Music Studios</Link>
                </div>
              </div>

              {/* Column 3 — Company */}
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', color: '#1a1814' }} className="text-xs uppercase tracking-wider font-medium mb-3">
                  Company
                </p>
                <div className="flex flex-col gap-2">
                  <Link href="/list-your-space" className="hover:underline">List Your Space</Link>
                  <Link href="/claim" className="hover:underline">Claim a Listing</Link>
                  <Link href="/blog" className="hover:underline">Resources</Link>
                </div>
              </div>

            </div>
          </div>
        </footer>
        </PostHogProvider>
      </body>
    </html>
  )
}
