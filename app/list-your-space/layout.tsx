import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'List Your Space | FindStudioSpace',
  description:
    'Submit your studio, workshop, or office space to Portland\'s creative studio directory. Free to list. Reach artists, makers, and producers searching right now.',
  openGraph: {
    title: 'List Your Space | FindStudioSpace',
    description:
      'Submit your studio, workshop, or office space to Portland\'s creative studio directory. Free to list.',
  },
}

export default function ListYourSpaceLayout({ children }: { children: React.ReactNode }) {
  return children
}
