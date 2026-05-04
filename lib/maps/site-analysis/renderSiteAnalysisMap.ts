import type { SiteAnalysisMapData, BuildingFootprint } from './types'
import { C, MAP_W, MAP_H } from './constants'
import { metersToMiles, confidenceLabel } from './mapRules'
import { planBbox } from './fetchBuildingFootprints'

// ─── Layout constants ──────────────────────────────────────────────────────────
const LP_W   = 296   // left panel width
const TOP_H  = 576   // plan area height
const BADGE_H = 104  // data badge strip height
const PLAN_X = LP_W
const PLAN_W = MAP_W - LP_W

// ─── SVG helpers ──────────────────────────────────────────────────────────────
function e(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function txt(
  x: number, y: number, content: string,
  opts: {
    size?: number; fill?: string; weight?: string
    spacing?: string; anchor?: string; opacity?: number
    family?: string
  } = {},
): string {
  const {
    size = 10, fill = C.text, weight = '400',
    spacing = '0.12em', anchor = 'start',
    opacity = 1, family = "'Arial Narrow', Arial, sans-serif",
  } = opts
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" letter-spacing="${spacing}" text-anchor="${anchor}" font-family="${family}" opacity="${opacity}">${e(content)}</text>`
}

function rect(x: number, y: number, w: number, h: number, fill: string, stroke = 'none', sw = 0): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`
}

function line(x1: number, y1: number, x2: number, y2: number, stroke: string, sw = 0.5, dash = ''): string {
  const d = dash ? ` stroke-dasharray="${dash}"` : ''
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"${d}/>`
}

function path(d: string, stroke: string, sw = 0.5, fill = 'none', dash = ''): string {
  const da = dash ? ` stroke-dasharray="${dash}"` : ''
  return `<path d="${d}" stroke="${stroke}" stroke-width="${sw}" fill="${fill}"${da}/>`
}

// Small square icon for legend items
function squareIcon(x: number, y: number, stroke: string, dash = ''): string {
  const da = dash ? ` stroke-dasharray="${dash}"` : ''
  return `<rect x="${x}" y="${y - 7}" width="10" height="10" fill="none" stroke="${stroke}" stroke-width="1"${da}/>`
}

// Transit bus icon (simplified circle with cross)
function transitIcon(x: number, y: number, stroke: string): string {
  return `<circle cx="${x + 5}" cy="${y - 2}" r="6" fill="none" stroke="${stroke}" stroke-width="1"/>
<line x1="${x + 5}" y1="${y - 8}" x2="${x + 5}" y2="${y + 4}" stroke="${stroke}" stroke-width="0.5"/>
<line x1="${x - 1}" y1="${y - 2}" x2="${x + 11}" y2="${y - 2}" stroke="${stroke}" stroke-width="0.5"/>`
}

// Circle icon for confidence/data
function circleIcon(x: number, y: number, stroke: string, dash = ''): string {
  const da = dash ? ` stroke-dasharray="${dash}"` : ''
  return `<circle cx="${x + 5}" cy="${y - 2}" r="5.5" fill="none" stroke="${stroke}" stroke-width="1"${da}/>`
}

// ─── Left panel ───────────────────────────────────────────────────────────────
function renderLeftPanel(d: SiteAnalysisMapData): string {
  const x = 36
  const parts: string[] = [
    rect(0, 0, LP_W, TOP_H, C.badgeBg),
    line(LP_W, 0, LP_W, TOP_H, C.divider, 1),
  ]

  // Header
  parts.push(txt(x, 54, 'SITE ANALYSIS', { size: 20, weight: '300', spacing: '0.22em' }))
  parts.push(txt(x, 71, 'LOCATION INTELLIGENCE', { size: 8, fill: C.textMuted, spacing: '0.2em' }))
  // Accent rule
  parts.push(`<line x1="${x}" y1="80" x2="${x + 44}" y2="80" stroke="${C.accent}" stroke-width="1.5"/>`)

  // Studio name + neighborhood (truncate to fit panel)
  const nameDisplay = d.title.length > 30 ? d.title.slice(0, 28) + '…' : d.title
  parts.push(txt(x, 104, nameDisplay.toUpperCase(), { size: 11, weight: '300', spacing: '0.1em' }))
  parts.push(txt(x, 120, `${d.neighborhood.toUpperCase()}, PORTLAND`, { size: 8, fill: C.textMuted, spacing: '0.15em' }))
  parts.push(txt(x, 133, d.category.toUpperCase(), { size: 7.5, fill: C.textMuted, spacing: '0.15em' }))

  // Site Intelligence section
  parts.push(line(x, 168, LP_W - 36, 168, C.divider, 0.5))
  parts.push(txt(x, 184, 'SITE INTELLIGENCE', { size: 7.5, fill: C.textMuted, spacing: '0.2em' }))

  // Legend items
  const legendItems = buildLegendItems(d)
  let ly = 208
  for (const item of legendItems) {
    parts.push(item.icon(x, ly))
    parts.push(txt(x + 18, ly + 1, item.label, { size: 7.5, spacing: '0.15em' }))
    if (item.sub) {
      parts.push(txt(x + 18, ly + 11, item.sub, { size: 7, fill: C.textMuted, spacing: '0.1em' }))
      ly += 30
    } else {
      ly += 22
    }
  }

  // Public data notice
  parts.push(line(x, TOP_H - 72, LP_W - 36, TOP_H - 72, C.divider, 0.5))
  parts.push(txt(x, TOP_H - 56, 'PUBLIC DATA', { size: 7.5, fill: C.textMuted, spacing: '0.2em' }))
  parts.push(txt(x, TOP_H - 44, 'VERIFY BEFORE SIGNING', { size: 7, fill: C.textMuted, opacity: 0.6, spacing: '0.12em' }))

  return parts.join('\n')
}

type LegendEntry = { icon: (x: number, y: number) => string; label: string; sub?: string }

function buildLegendItems(d: SiteAnalysisMapData): LegendEntry[] {
  const items: LegendEntry[] = [
    {
      icon: (x, y) => squareIcon(x, y, C.accent),
      label: 'SUBJECT SITE',
    },
  ]

  if (d.zoningCode) {
    items.push({
      icon: (x, y) => squareIcon(x, y, C.line, '3 2'),
      label: `ZONING / ${d.zoningCode}`,
      sub: d.zoningDesc?.toUpperCase().slice(0, 28),
    })
  }

  if (d.distToMaxMeters != null || d.distToBusMeters != null) {
    items.push({
      icon: (x, y) => transitIcon(x, y, C.line),
      label: 'TRANSIT / NEARBY',
    })
  }

  items.push({
    icon: (x, y) => circleIcon(x, y, C.line, '2 2'),
    label: 'CONFIDENCE',
    sub: confidenceLabel(d.confidence).toUpperCase().slice(0, 28),
  })

  return items.slice(0, 4)
}

// ─── Plan projection ──────────────────────────────────────────────────────────
function makeProjFn(lat: number, lon: number) {
  const { minLat, maxLat, minLon, maxLon } = planBbox(lat, lon)
  return (pLon: number, pLat: number): [number, number] => {
    const x = PLAN_X + (pLon - minLon) / (maxLon - minLon) * PLAN_W
    const y = (maxLat - pLat) / (maxLat - minLat) * TOP_H
    return [x, y]
  }
}

function footprintPath(fp: BuildingFootprint, proj: (lon: number, lat: number) => [number, number]): string {
  if (fp.outerRing.length < 3) return ''
  const pts = fp.outerRing.map(([lon, lat]) => {
    const [x, y] = proj(lon, lat)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const fill   = fp.isSubject ? '#ffffff' : C.block
  const stroke = fp.isSubject ? C.line    : 'none'
  const sw     = fp.isSubject ? 2.5       : 0
  return `<path d="M${pts.join(' L')} Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="miter"/>`
}

// ─── Plan view ────────────────────────────────────────────────────────────────
function renderPlanView(d: SiteAnalysisMapData): string {
  const proj = makeProjFn(d.lat, d.lon)
  const [scx, scy] = proj(d.lon, d.lat)  // subject center in SVG coords

  const parts: string[] = [
    // Cream paper background
    rect(PLAN_X, 0, PLAN_W, TOP_H, C.bg),
    // Clip group so footprints don't bleed outside plan area
    `<clipPath id="planClip"><rect x="${PLAN_X}" y="0" width="${PLAN_W}" height="${TOP_H}"/></clipPath>`,
    `<g clip-path="url(#planClip)">`,
  ]

  const footprints = d.footprints ?? []

  if (footprints.length > 0) {
    // Nolli figure-ground: render all non-subject buildings first (solid black)
    for (const fp of footprints) {
      if (!fp.isSubject) parts.push(footprintPath(fp, proj))
    }
    // Subject building on top (white void)
    for (const fp of footprints) {
      if (fp.isSubject) parts.push(footprintPath(fp, proj))
    }
  }

  parts.push(`</g>`)

  // Subject site crosshair (always at listing lat/lon center)
  const crSize = 18
  parts.push(line(scx - crSize, scy, scx + crSize, scy, C.accent, 1.6))
  parts.push(line(scx, scy - crSize, scx, scy + crSize, C.accent, 1.6))
  parts.push(`<circle cx="${scx.toFixed(1)}" cy="${scy.toFixed(1)}" r="4" fill="${C.accent}"/>`)
  parts.push(txt(scx + 10, scy - 10, 'SUBJECT SITE', { size: 7.5, fill: C.accent, spacing: '0.15em', weight: '400' }))

  // If no subject building found, draw a dashed lot indicator
  if (footprints.length > 0 && !footprints.some(f => f.isSubject)) {
    const r = 28
    parts.push(`<circle cx="${scx.toFixed(1)}" cy="${scy.toFixed(1)}" r="${r}" fill="none" stroke="${C.accent}" stroke-width="0.8" stroke-dasharray="4 3"/>`)
  }

  // Section cut markers (left of center)
  const sectX = Math.max(PLAN_X + 16, scx - 160)
  parts.push(txt(sectX - 14, scy + 4, 'A', { size: 8, fill: C.textMuted, spacing: '0' }))
  parts.push(line(sectX, scy, scx - crSize, scy, C.textMuted, 0.6, '3 2'))
  parts.push(txt(sectX - 14, TOP_H - 30, 'A', { size: 8, fill: C.textMuted, spacing: '0' }))

  // Annotation — MAX stop
  if (d.distToMaxMeters != null) {
    const maxX = PLAN_X + PLAN_W * 0.84
    const maxY = 60
    parts.push(line(scx, scy, maxX, maxY + 16, C.lineFaint, 0.5, '4 3'))
    parts.push(`<circle cx="${maxX}" cy="${maxY}" r="10" fill="${C.bg}" stroke="${C.line}" stroke-width="1.2"/>`)
    parts.push(`<line x1="${maxX}" y1="${maxY - 6}" x2="${maxX}" y2="${maxY + 6}" stroke="${C.line}" stroke-width="0.8"/>`)
    parts.push(`<line x1="${maxX - 6}" y1="${maxY}" x2="${maxX + 6}" y2="${maxY}" stroke="${C.line}" stroke-width="0.8"/>`)
    parts.push(txt(maxX + 16, maxY - 5, 'MAX', { size: 7.5, spacing: '0.15em' }))
    parts.push(txt(maxX + 16, maxY + 8, metersToMiles(d.distToMaxMeters), { size: 7, fill: C.textMuted, spacing: '0.1em' }))
  }

  // Annotation — Zoning
  if (d.zoningCode) {
    const zx = PLAN_X + PLAN_W * 0.84
    const zy = TOP_H - 130
    parts.push(txt(zx, zy, 'ZONING', { size: 7, fill: C.textMuted, spacing: '0.2em' }))
    parts.push(txt(zx, zy + 16, d.zoningCode, { size: 14, weight: '300', spacing: '0.1em' }))
    if (d.zoningDesc) {
      const words = d.zoningDesc.toUpperCase().split(' ')
      parts.push(txt(zx, zy + 30, words.slice(0, 2).join(' '), { size: 7, fill: C.textMuted, spacing: '0.1em' }))
      if (words.length > 2) parts.push(txt(zx, zy + 41, words.slice(2).join(' '), { size: 7, fill: C.textMuted, spacing: '0.1em' }))
    }
  }

  // Approximate location notice
  if (d.isApproximate) {
    parts.push(txt(PLAN_X + PLAN_W * 0.5, TOP_H - 22, 'APPROXIMATE NEIGHBORHOOD LOCATION', {
      size: 7, fill: C.textMuted, opacity: 0.7, anchor: 'middle', spacing: '0.2em',
    }))
  }

  // Scale bar — 100m at METERS_PER_PX=1.0 = 100px
  const scaleX = PLAN_X + PLAN_W - 180
  const scaleY = TOP_H - 36
  const scaleLen = 100  // 100px = 100m at 1.0 m/px
  parts.push(line(scaleX, scaleY, scaleX + scaleLen, scaleY, C.text, 0.8))
  parts.push(line(scaleX, scaleY - 5, scaleX, scaleY + 5, C.text, 0.8))
  parts.push(line(scaleX + scaleLen * 0.5, scaleY - 3, scaleX + scaleLen * 0.5, scaleY + 3, C.textMuted, 0.5))
  parts.push(line(scaleX + scaleLen, scaleY - 5, scaleX + scaleLen, scaleY + 5, C.text, 0.8))
  parts.push(txt(scaleX, scaleY + 13, '0m', { size: 6.5, fill: C.textMuted, anchor: 'middle', spacing: '0' }))
  parts.push(txt(scaleX + scaleLen * 0.5, scaleY + 13, '50m', { size: 6.5, fill: C.textMuted, anchor: 'middle', spacing: '0' }))
  parts.push(txt(scaleX + scaleLen, scaleY + 13, '100m', { size: 6.5, fill: C.textMuted, anchor: 'middle', spacing: '0' }))

  // North arrow
  const nx = PLAN_X + PLAN_W - 36
  const ny = TOP_H - 90
  parts.push(path(`M${nx},${ny} L${nx - 7},${ny + 20} L${nx},${ny + 14} L${nx + 7},${ny + 20} Z`, C.line, 0, C.line))
  parts.push(txt(nx, ny - 8, 'N', { size: 9, fill: C.text, anchor: 'middle', spacing: '0', weight: '400' }))

  return parts.join('\n')
}

// ─── Data badge strip ─────────────────────────────────────────────────────────
function renderDataBadges(d: SiteAnalysisMapData): string {
  const y = TOP_H
  const parts: string[] = [
    rect(0, y, MAP_W, BADGE_H, C.badgeBg),
    line(0, y, MAP_W, y, C.divider, 1),
    line(0, y + BADGE_H - 1, MAP_W, y + BADGE_H - 1, C.divider, 1),
  ]

  const badgeCount = d.callouts.length
  const badgeW = Math.floor(MAP_W / badgeCount)

  d.callouts.forEach((c, i) => {
    const bx = i * badgeW
    const midX = bx + badgeW * 0.5
    const iconX = bx + 22
    const textX = bx + 46

    // Vertical divider
    if (i > 0) parts.push(line(bx, y + 16, bx, y + BADGE_H - 16, C.divider, 0.5))

    // Icon
    const iy = y + BADGE_H * 0.5 + 2
    switch (c.icon) {
      case 'zone':
        parts.push(squareIcon(iconX - 5, iy, C.line))
        break
      case 'transit':
        parts.push(transitIcon(iconX - 5, iy, C.line))
        break
      case 'flood':
      case 'hazard':
        parts.push(`<path d="M${iconX} ${iy - 8} L${iconX - 6} ${iy + 4} L${iconX + 6} ${iy + 4} Z" fill="none" stroke="${C.line}" stroke-width="1"/>`)
        break
      case 'business':
      case 'parking':
        parts.push(`<rect x="${iconX - 5}" y="${iy - 6}" width="11" height="9" rx="1" fill="none" stroke="${C.line}" stroke-width="1"/>`)
        break
      case 'data':
      default:
        parts.push(circleIcon(iconX - 5, iy, C.line, '2 2'))
    }

    // Text
    parts.push(txt(textX, y + 36, c.label, { size: 7.5, fill: C.textMuted, spacing: '0.2em' }))
    parts.push(txt(textX, y + 52, c.value, { size: 9, spacing: '0.1em', weight: '300' }))
    if (c.sub) {
      parts.push(txt(textX, y + 65, c.sub, { size: 7, fill: C.textMuted, spacing: '0.08em' }))
    }

    void midX // suppress unused warning
  })

  return parts.join('\n')
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function renderSiteAnalysisMapSvg(data: SiteAnalysisMapData): Buffer {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${MAP_W}" height="${MAP_H}" viewBox="0 0 ${MAP_W} ${MAP_H}">
<rect width="${MAP_W}" height="${MAP_H}" fill="${C.bg}"/>
${renderLeftPanel(data)}
${renderPlanView(data)}
${renderDataBadges(data)}
</svg>`

  return Buffer.from(svg, 'utf-8')
}
