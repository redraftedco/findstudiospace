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
    slug: 'photo-studio-rental-portland',
    title: 'How to Rent a Photography Studio in Portland, OR',
    date: '2026-04-26',
    description: 'What to look for when renting a photo studio in Portland — cyc walls, natural light, product setups, and green screen spaces. Current rates and neighborhood guide.',
  },
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
    <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="mb-10 text-3xl font-semibold">
          Resources
        </h1>
        <ul className="space-y-8">
          {POSTS.map((post) => (
            <li key={post.slug} style={{ borderTop: '1px solid var(--rule)' }} className="pt-8">
              <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }} className="mb-2 text-xs">
                {post.date}
              </p>
              <Link href={`/blog/${post.slug}`}>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="text-xl font-semibold hover:underline">
                  {post.title}
                </h2>
              </Link>
              <p style={{ color: 'var(--stone)' }} className="mt-2 text-sm leading-relaxed">
                {post.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
