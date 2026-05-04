import { createClient } from '@supabase/supabase-js'
import { MetadataRoute } from 'next'
import { categoryConfigs } from './portland/[category]/config'
import { categoryConfigs as atlantaCategoryConfigs } from './atlanta/[category]/config'

export const dynamic = 'force-dynamic'

const BASE = 'https://www.findstudiospace.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  )

  // Fetch all three in parallel — independent queries
  const [{ data: cities }, { data: listings }] = await Promise.all([
    supabase
      .from('cities')
      .select('slug, seo_published_at')
      .eq('is_indexable', true),
    supabase
      .from('listings')
      .select('id, updated_at')
      .eq('status', 'active')
      .eq('indexable', true),
  ])

  // Static pages (always included — these are conversion/discovery pages)
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                                                    lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/list-your-space`,                               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`,                                         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/blog`,                                          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/blog/how-to-find-studio-space-portland`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/blog/studio-space-cost-portland`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/blog/art-studio-rental-guide-portland`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/blog/photo-studio-rental-portland`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/for-landlords`,                                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/podcast-studios`,                               lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/event-spaces-portland`,                          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/photography-studios-portland`,                   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/industrial-spaces-portland`,                     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/alberta-arts-district`,                          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/central-eastside`,                               lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/slabtown`,                                       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/makerspace-portland`,                            lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/video-production-studios-portland`,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/kerns`,                                          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.80 },
    { url: `${BASE}/mississippi-ave`,                                lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.80 },
    { url: `${BASE}/division-street`,                                lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.80 },
    { url: `${BASE}/sellwood`,                                       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.80 },
    { url: `${BASE}/st-johns`,                                       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.80 },
    { url: `${BASE}/blog/creative-workspace-rental-portland-guide`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/blog/portland-studio-market-2026`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/blog/how-to-negotiate-studio-lease-portland`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/blog/pearl-district-vs-central-eastside-studio`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/blog/questions-to-ask-before-renting-studio-portland`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/blog/private-studio-vs-shared-coop-portland`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/blog/makerspace-vs-private-workshop-portland`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/blog/how-to-rent-podcast-studio-portland`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/blog/how-to-rent-event-space-portland`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/blog/what-to-look-for-viewing-studio-space`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/blog/photography-studio-setup-budget-portland`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/blog/how-to-sublease-studio-space-portland`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/blog/portland-art-studio-rental`,                lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/blog/studio-workspace-portland`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/portland-studio-neighborhoods`,                  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
  ]

  // City hub pages — one per indexable city
  const cityPages: MetadataRoute.Sitemap = (cities ?? []).map(city => ({
    url: `${BASE}/${city.slug}`,
    lastModified: city.seo_published_at ? new Date(city.seo_published_at) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.95,
  }))

  // Portland category / neighborhood pages — driven by config (Portland-specific, already indexed)
  // Only included when Portland is in the indexable cities list
  const portlandIsIndexable = (cities ?? []).some(c => c.slug === 'portland')
  const portlandCategoryPages: MetadataRoute.Sitemap = portlandIsIndexable
    ? Object.keys(categoryConfigs).map(slug => ({
        url: `${BASE}/portland/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      }))
    : []

  // Atlanta category / neighborhood pages
  const atlantaIsIndexable = (cities ?? []).some(c => c.slug === 'atlanta')
  const atlantaCategoryPages: MetadataRoute.Sitemap = atlantaIsIndexable
    ? Object.keys(atlantaCategoryConfigs).map(slug => ({
        url: `${BASE}/atlanta/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      }))
    : []

  // Individual listing pages — only indexable listings
  const listingPages: MetadataRoute.Sitemap = (listings ?? []).map(listing => ({
    url: `${BASE}/listing/${listing.id}`,
    lastModified: listing.updated_at ? new Date(listing.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...cityPages, ...portlandCategoryPages, ...atlantaCategoryPages, ...listingPages]
}
