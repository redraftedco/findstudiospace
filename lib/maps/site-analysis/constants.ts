export const SITE_ANALYSIS_MAP_VERSION = 'v1'
export const STORAGE_BUCKET = 'generated-assets'
export const STORAGE_PATH_PREFIX = 'site-analysis-maps'
export const MAP_FILE_EXT = 'svg'
export const MAP_W = 1600
export const MAP_H = 680   // TOP_H(576) + BADGE_H(104) — section removed
export const MAX_CALLOUTS = 5

// Nolli figure-ground palette — cream paper, black built mass, white subject void
export const C = {
  bg:        '#f5f2e8',  // warm cream — paper/street voids
  block:     '#1c1a16',  // near-black — solid built mass
  blockAlt:  '#2a2720',  // slightly lighter for interior sub-divisions
  street:    '#f5f2e8',  // same as bg — streets are voids
  line:      '#1a1814',  // near-black ink
  lineFaint: '#8a8278',  // muted for secondary lines
  text:      '#1a1814',
  textMuted: '#6a6258',
  accent:    '#7a3b1e',  // muted rust — subject site only
  badgeBg:   '#eeebe0',  // slightly darker cream for badge strip
  divider:   '#c8c2b4',
} as const

// Category to display label
export const CATEGORY_LABELS: Record<string, string> = {
  photo:     'Photography Studio',
  art:       'Art Studio',
  workshop:  'Workshop Space',
  music:     'Music Studio',
  podcast:   'Podcast Studio',
  fitness:   'Fitness & Dance',
  office:    'Creative Office',
  retail:    'Retail Space',
  event:     'Event Space',
  makerspace:'Makerspace',
}

// Portland zoning code → human description (most common EX/IG1/CX/CM/RH)
export const ZONE_DESCRIPTIONS: Record<string, string> = {
  'EX':   'Central Employment',
  'IG1':  'General Industrial 1',
  'IG2':  'General Industrial 2',
  'IH':   'Heavy Industrial',
  'IL':   'Light Industrial',
  'CX':   'Central Commercial',
  'CM':   'Mixed Commercial',
  'CS':   'Storefront Commercial',
  'CN1':  'Neighborhood Commercial 1',
  'CN2':  'Neighborhood Commercial 2',
  'CO1':  'Office Commercial 1',
  'CO2':  'Office Commercial 2',
  'RH':   'High Density Residential',
  'RM1':  'Medium Density Res 1',
  'RM2':  'Medium Density Res 2',
}
