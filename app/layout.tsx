import type { Metadata } from 'next'
import Link from 'next/link'
import { IBM_Plex_Serif, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const plexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-plex-serif',
})
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
})
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
})

export const metadata: Metadata = {
  title: 'Find Studio Space in Portland, OR | FindStudioSpace',
  description:
    'Browse photo studios, art studios, workshops, offices, retail, and fitness spaces for rent in Portland, OR.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSerif.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <header style={{ borderBottom: '1px solid #d6d0c4', background: '#f4f1eb' }} className="px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/" style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="text-lg font-semibold tracking-tight">
              FindStudioSpace
            </Link>
            <Link
              href="/list-your-space"
              style={{ background: '#2c4a3e', color: '#f4f1eb', fontFamily: 'var(--font-body)' }}
              className="px-4 py-2 text-sm font-medium hover:opacity-90"
            >
              List your space
            </Link>
          </div>
        </header>
        {children}
        <footer style={{ borderTop: '1px solid #d6d0c4', color: '#8c8680' }} className="mt-16 px-6 py-8">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 text-sm">
            <span style={{ fontFamily: 'var(--font-mono)' }}>findstudiospace.com — Portland, OR</span>
            <div className="flex gap-6">
              <Link href="/portland/office-space-rental" className="hover:underline">Office</Link>
              <Link href="/portland/art-studio" className="hover:underline">Art</Link>
              <Link href="/portland/workshop-space-rental" className="hover:underline">Workshop</Link>
              <Link href="/portland/photo-studio-rental" className="hover:underline">Photo</Link>
              <Link href="/blog" className="hover:underline">Resources</Link>
              <Link href="/list-your-space" className="hover:underline">List your space</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
