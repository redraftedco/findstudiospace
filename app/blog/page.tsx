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
    slug: 'creative-workspace-rental-portland-guide',
    title: 'Creative Workspace for Rent in Portland: A Complete Guide',
    date: '2026-05-01',
    description: 'The complete guide to renting creative workspace in Portland — studio types, neighborhoods, price ranges, and how to choose the right space for your practice.',
  },
  {
    slug: 'portland-studio-market-2026',
    title: 'Portland Studio Space Market Report 2026',
    date: '2026-05-01',
    description: 'Average monthly rents for art studios, photo studios, workshops, and creative offices in Portland — broken down by neighborhood and space type. Updated 2026.',
  },
  {
    slug: 'how-to-negotiate-studio-lease-portland',
    title: 'How to Negotiate a Month-to-Month Studio Lease in Portland',
    date: '2026-04-28',
    description: 'How to negotiate month-to-month terms on a Portland studio rental — what landlords expect, what to ask for, and what to get in writing before you sign.',
  },
  {
    slug: 'pearl-district-vs-central-eastside-studio',
    title: "Pearl District vs. Central Eastside: Which Is Right for Your Studio?",
    date: '2026-04-25',
    description: "Comparing Portland's two top studio neighborhoods — prices, character, and who belongs where.",
  },
  {
    slug: 'questions-to-ask-before-renting-studio-portland',
    title: '12 Questions to Ask Before Renting a Studio Space in Portland',
    date: '2026-04-22',
    description: 'Before you sign a studio lease in Portland, ask these 12 questions — access hours, utilities, permitted uses, storage, and what must be in writing.',
  },
  {
    slug: 'private-studio-vs-shared-coop-portland',
    title: 'Private Art Studio vs. Shared Co-op in Portland: Pros and Cons',
    date: '2026-04-19',
    description: 'The real trade-offs between a private studio and a shared artist co-op in Portland — cost, community, equipment access, and flexibility.',
  },
  {
    slug: 'makerspace-vs-private-workshop-portland',
    title: 'Makerspace vs. Private Workshop in Portland: Which Is Right for You?',
    date: '2026-04-16',
    description: 'Cost, equipment access, noise, and flexibility — how to choose between a makerspace membership and a private workshop rental in Portland.',
  },
  {
    slug: 'how-to-rent-podcast-studio-portland',
    title: 'How to Rent a Podcast Studio in Portland, OR',
    date: '2026-04-13',
    description: 'What to look for when renting a podcast studio in Portland — soundproofing, equipment, monthly vs. hourly rates, and what to ask before booking.',
  },
  {
    slug: 'how-to-rent-event-space-portland',
    title: 'How to Rent Event Space in Portland for Pop-Ups and Private Events',
    date: '2026-04-10',
    description: 'A guide to renting event space and private venues in Portland for pop-ups, brand activations, and private gatherings — what to look for and what to ask.',
  },
  {
    slug: 'what-to-look-for-viewing-studio-space',
    title: 'What to Look for When Viewing a Studio Space in Portland',
    date: '2026-04-07',
    description: 'A practical checklist for studio viewings — light, power, noise, access, moisture, and structural red flags to check before committing.',
  },
  {
    slug: 'photography-studio-setup-budget-portland',
    title: 'How to Set Up a Photography Studio on a Budget in Portland',
    date: '2026-04-04',
    description: 'What you actually need, what to rent vs. buy, and how to set up a photography studio in Portland without overspending.',
  },
  {
    slug: 'how-to-sublease-studio-space-portland',
    title: 'How to Sublease a Studio Space in Portland, OR',
    date: '2026-04-01',
    description: 'A practical guide to subleasing a studio space in Portland — landlord approval, pricing, finding a subtenant, and documenting the arrangement.',
  },
  {
    slug: 'studio-workspace-portland',
    title: "Studio Workspace for Rent in Portland: A Renter's Guide",
    date: '2026-04-28',
    description: "A renter's guide to monthly studio workspace in Portland — art studios, photo studios, workshops, offices, and fitness spaces. Prices by category and how to find the right fit.",
  },
  {
    slug: 'portland-art-studio-rental',
    title: 'Art Studio Rental in Portland: Prices, Neighborhoods & What to Expect',
    date: '2026-04-22',
    description: 'Current prices for art studio rentals in Portland — from shared co-ops at $200/mo to private studios at $800+. Neighborhood guide, studio types, and what to look for before signing.',
  },
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
