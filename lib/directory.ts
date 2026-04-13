// lib/directory.ts
// Central config for the current directory deployment.
// All directory-specific values come from here — never
// hardcode directory names, colors, or IDs in components.

export const directoryConfig = {
  id: process.env.NEXT_PUBLIC_DIRECTORY_ID || 'findstudiospace',
  name: process.env.NEXT_PUBLIC_DIRECTORY_NAME || 'FindStudioSpace',
  domain: process.env.NEXT_PUBLIC_DIRECTORY_DOMAIN || 'findstudiospace.com',
  tagline: process.env.NEXT_PUBLIC_DIRECTORY_TAGLINE ||
    'The directory for creatives, makers, and producers looking for monthly workspace.',
  city: process.env.NEXT_PUBLIC_DIRECTORY_CITY || 'Portland',
  state: process.env.NEXT_PUBLIC_DIRECTORY_STATE || 'OR',
  url: `https://${process.env.NEXT_PUBLIC_DIRECTORY_DOMAIN || 'findstudiospace.com'}`,
}

// Use this in any component that needs to filter listings
// by the current directory:
// const { data } = await supabase
//   .from('listings')
//   .select('*')
//   .eq('directory_id', directoryConfig.id)
//   .eq('status', 'active')
