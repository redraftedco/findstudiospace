import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { Suspense } from 'react'
import { Bebas_Neue, Inter, JetBrains_Mono } from 'next/font/google'
import PostHogProvider from '@/components/PostHogProvider'
import UTMCapture from '@/components/UTMCapture'
import './globals.css'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas-neue',
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.findstudiospace.com'),
  title: 'Find Studio Space in Portland, OR | FindStudioSpace',
  description:
    'Browse photo studios, art studios, workshops, offices, retail, and fitness spaces for rent in Portland, OR.',
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    siteName: 'FindStudioSpace',
    images: [{ url: '/og-default.svg', width: 1200, height: 630, alt: 'FindStudioSpace — Portland creative studio directory' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.svg'],
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FindStudioSpace',
  url: 'https://www.findstudiospace.com',
  description: 'Portland\'s creative studio directory — find and book photo studios, art studios, podcast studios, event spaces, makerspaces, and creative workspace.',
  sameAs: [],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DRR4LRS3X4"
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DRR4LRS3X4');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <PostHogProvider>
        <Suspense fallback={null}><UTMCapture /></Suspense>
        <header style={{ borderBottom: '1px solid var(--rule)', background: 'var(--paper)' }} className="px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="text-lg font-semibold tracking-tight">
              FindStudioSpace
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/for-landlords"
                style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }}
                className="text-sm hover:underline"
              >
                <span className="hidden sm:inline">For </span>Landlords
              </Link>
              <Link
                href="/pricing"
                style={{ color: 'var(--stone)', fontFamily: 'var(--font-body)' }}
                className="text-sm hover:underline"
              >
                Pricing
              </Link>
            <Link
              href="/list-your-space"
              style={{ color: 'var(--action)', fontFamily: 'var(--font-body)' }}
              className="text-sm font-medium hover:underline"
            >
              <span className="hidden sm:inline">List your space</span><span className="sm:hidden">List</span>
            </Link>
            </div>
          </div>
        </header>
        {children}
        <footer style={{ borderTop: '1px solid var(--rule)', color: 'var(--stone)' }} className="mt-16 px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">

              {/* Column 1 — Brand */}
              <div>
                <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="font-semibold mb-2">
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
                <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }} className="text-xs uppercase tracking-wider font-medium mb-3">
                  Browse by Category
                </p>
                <div className="flex flex-col gap-2">
                  <Link href="/portland/art-studio-rental" className="hover:underline">Art Studios</Link>
                  <Link href="/portland/workshop-space-rental" className="hover:underline">Workshop Space</Link>
                  <Link href="/portland/photo-studios" className="hover:underline">Photo Studios</Link>
                  <Link href="/portland/office-space-rental" className="hover:underline">Office Space</Link>
                  <Link href="/portland/fitness-studio-rental" className="hover:underline">Fitness &amp; Dance</Link>
                </div>
              </div>

              {/* Column 3 — Browse by Neighborhood */}
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }} className="text-xs uppercase tracking-wider font-medium mb-3">
                  By Neighborhood
                </p>
                <div className="flex flex-col gap-2">
                  <Link href="/portland/central-eastside" className="hover:underline">Central Eastside</Link>
                  <Link href="/portland/pearl-district" className="hover:underline">Pearl District</Link>
                  <Link href="/portland/alberta-arts" className="hover:underline">Alberta Arts District</Link>
                  <Link href="/portland/division" className="hover:underline">SE Division</Link>
                  <Link href="/portland/mississippi" className="hover:underline">N Mississippi</Link>
                </div>
              </div>

              {/* Column 4 — Company */}
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }} className="text-xs uppercase tracking-wider font-medium mb-3">
                  Company
                </p>
                <div className="flex flex-col gap-2">
                  <Link href="/about" className="hover:underline">About</Link>
                  <Link href="/list-your-space" className="hover:underline">List Your Space</Link>
                  <Link href="/claim" className="hover:underline">Claim a Listing</Link>
                  <Link href="/blog" className="hover:underline">Resources</Link>
                  <Link href="/privacy" className="hover:underline">Privacy</Link>
                  <Link href="/terms" className="hover:underline">Terms</Link>
                  <Link href="/refund-policy" className="hover:underline">Refund Policy</Link>
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
