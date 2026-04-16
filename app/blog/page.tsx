import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog | FindStudioSpace',
  description: 'Guides and resources for finding studio and workspace in Portland, OR.',
  openGraph: {
    title: 'Blog | FindStudioSpace',
    description: 'Guides and resources for finding studio and workspace in Portland, OR.',
  },
}

const POSTS = [
  {
    slug: 'art-studio-rental-guide-portland',
    title: 'How to Rent an Art Studio in Portland: A Practical Guide',
    date: '2025-04-12',
    description: 'What to look for, what to ask, and what to avoid when renting an art studio in Portland. A guide for painters, ceramicists, sculptors, and mixed media artists.',
  },
  {
    slug: 'studio-space-cost-portland',
    title: 'How Much Does Studio Space Cost in Portland, OR?',
    date: '2025-04-12',
    description: 'Current price ranges for art studios, workshops, photo studios, offices, and rehearsal rooms in Portland. What to expect by space type and neighborhood.',
  },
  {
    slug: 'how-to-find-studio-space-portland',
    title: 'How to Find Studio Space in Portland, OR',
    date: '2025-01-15',
    description: 'A practical guide to finding monthly studio, workshop, and creative workspace in Portland — what to look for, where to search, and what to ask before signing.',
  },
]

export default function BlogIndex() {
  return (
    <main style={{ background: '#f4f1eb', color: '#1a1814' }} className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <h1 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="mb-10 text-3xl font-semibold">
          Resources
        </h1>
        <ul className="space-y-8">
          {POSTS.map((post) => (
            <li key={post.slug} style={{ borderTop: '1px solid #d6d0c4' }} className="pt-8">
              <p style={{ fontFamily: 'var(--font-mono)', color: '#6b6762' }} className="mb-2 text-xs">
                {post.date}
              </p>
              <Link href={`/blog/${post.slug}`}>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="text-xl font-semibold hover:underline">
                  {post.title}
                </h2>
              </Link>
              <p style={{ color: '#6b6762' }} className="mt-2 text-sm leading-relaxed">
                {post.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
