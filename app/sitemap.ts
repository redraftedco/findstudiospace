import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { categoryConfigs } from './portland/[category]/config'

const BASE = 'https://findstudiospace.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: listings } = await supabase
    .from('listings')
    .select('id, created_at')
    .eq('status', 'active')

  const listingPages: MetadataRoute.Sitemap = (listings ?? []).map((l) => ({
    url: `${BASE}/listing/${l.id}`,
    lastModified: l.created_at ? new Date(l.created_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const categoryPages: MetadataRoute.Sitemap = Object.keys(categoryConfigs).map((slug) => ({
    url: `${BASE}/portland/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE}/list-your-space`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...categoryPages,
    ...listingPages,
  ]
}
