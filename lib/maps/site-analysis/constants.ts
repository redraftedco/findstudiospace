export const SITE_ANALYSIS_MAP_VERSION = 'v1'
export const STORAGE_BUCKET = 'generated-assets'
export const STORAGE_PATH_PREFIX = 'site-analysis-maps'
export const MAP_FILE_EXT = 'svg'
export const MAP_W = 1600
export const MAP_H = 1000
export const MAX_CALLOUTS = 5

// Light architectural plate palette (white paper, black ink)
export const C = {
  bg:        '#ffffff',
  block:     '#f0eeea',
  blockAlt:  '#e8e5df',
  street:    '#d8d4cc',
  line:      '#1a1814',
  lineFaint: '#c8c4bc',
  text:      '#1a1814',
  textMuted: '#7a7268',
  accent:    '#7a3b1e',  // muted rust — subject site only
  badgeBg:   '#f5f3ef',
  divider:   '#d0cbc2',
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
