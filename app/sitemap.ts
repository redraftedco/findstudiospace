import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://findstudiospace.com'
  
  const categories = [
    'photo-studio-rental',
    'photo-studio-near-me',
    'music-recording-studio',
    'music-studio-near-me',
    'art-studio-near-me',
    'art-studio'
  ]
  
  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/portland/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...categoryPages,
  ]
}
