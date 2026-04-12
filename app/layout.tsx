import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Portland Studios — Find & Rent Studio Space in Portland, OR',
  description:
    'Portland Studios is the easiest way to find and book photo studios, music recording studios, and art studios in Portland, OR.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}