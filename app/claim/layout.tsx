import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claim Your Listing | FindStudioSpace',
  description:
    'See how many tenants have inquired about your studio space. Claim your listing to access analytics and upgrade to Pro.',
  openGraph: {
    title: 'Claim Your Listing | FindStudioSpace',
    description:
      'See how many tenants have inquired about your studio space. Claim your listing to access analytics.',
  },
}

export default function ClaimLayout({ children }: { children: React.ReactNode }) {
  return children
}
