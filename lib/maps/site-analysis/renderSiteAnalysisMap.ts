import type { SiteAnalysisMapData, SiteAnalysisCallout } from './types'
import { C, MAP_W, MAP_H } from './constants'
import { metersToMiles, confidenceLabel } from './mapRules'

// ─── Layout constants ──────────────────────────────────────────────────────────
const LP_W = 296          // left panel width
const TOP_H = 576         // top section height (panel + plan)
const BADGE_H = 104       // data badge strip height
const SECT_Y = TOP_H + BADGE_H  // section A-A start y
const PLAN_X = LP_W       // plan view starts here
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
    rect(0, 0, LP_W, TOP_H, C.bg),
    // vertical right border
    line(LP_W, 0, LP_W, TOP_H, C.divider, 0.5),
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

// ─── Plan view ────────────────────────────────────────────────────────────────
function renderPlanView(d: SiteAnalysisMapData): string {
  const parts: string[] = [rect(PLAN_X, 0, PLAN_W, TOP_H, C.bg)]

  // Subtle grid
  for (let gx = PLAN_X; gx <= MAP_W; gx += 40) {
    parts.push(line(gx, 0, gx, TOP_H, C.lineFaint, 0.3))
  }
  for (let gy = 0; gy <= TOP_H; gy += 40) {
    parts.push(line(PLAN_X, gy, MAP_W, gy, C.lineFaint, 0.3))
  }

  // Portland city blocks — subject site is on the central intersection
  // Two streets horizontal, two vertical creating a 2x2 block grid
  // Plan viewport center
  const cx = PLAN_X + PLAN_W * 0.42
  const cy = TOP_H * 0.46

  // Block size in px: Portland block ≈ 200x200ft → we use 200x180
  const BW = 220  // block width
  const BH = 180  // block height
  const SW = 36   // street width

  // Block fill rects (4 surrounding context blocks)
  const blocks = [
    // top-left block
    [cx - BW - SW, cy - BH - SW, BW, BH],
    // top-right block
    [cx + SW, cy - BH - SW, BW, BH],
    // bottom-left block
    [cx - BW - SW, cy + SW, BW, BH],
    // bottom-right block (non-subject)
    [cx + SW, cy + SW, BW, BH],
  ]

  for (const [bx, by, bw, bh] of blocks) {
    parts.push(rect(bx, by, bw, bh, C.blockAlt))
    // subtle interior lines suggesting building masses
    parts.push(line(bx + bw * 0.35, by, bx + bw * 0.35, by + bh, C.lineFaint, 0.4))
    parts.push(line(bx, by + bh * 0.45, bx + bw, by + bh * 0.45, C.lineFaint, 0.4))
  }

  // Subject block (center)
  const sbx = cx - BW - SW
  const sby = cy - BH - SW
  const sbw = BW
  const sbh = BH

  // Actually the subject block is the one the building sits in
  // Let's define it as the area around cx, cy
  const subjBlockX = cx - BW * 0.5
  const subjBlockY = cy - BH * 0.5
  parts.push(rect(subjBlockX, subjBlockY, BW, BH, C.block))

  // Subject building footprint (inset 20px from block)
  const bfx = subjBlockX + 20
  const bfy = subjBlockY + 18
  const bfw = BW - 40
  const bfh = BH - 36
  parts.push(rect(bfx, bfy, bfw, bfh, '#0f0f0f'))
  parts.push(`<rect x="${bfx}" y="${bfy}" width="${bfw}" height="${bfh}" fill="none" stroke="${C.line}" stroke-width="1"/>`)

  // Interior room lines (subtle)
  parts.push(line(bfx + bfw * 0.33, bfy, bfx + bfw * 0.33, bfy + bfh, C.lineFaint, 0.6))
  parts.push(line(bfx + bfw * 0.66, bfy, bfx + bfw * 0.66, bfy + bfh, C.lineFaint, 0.6))
  parts.push(line(bfx, bfy + bfh * 0.5, bfx + bfw, bfy + bfh * 0.5, C.lineFaint, 0.6))

  // Subject site crosshair (accent color)
  const scx = bfx + bfw * 0.5
  const scy = bfy + bfh * 0.5
  const crSize = 14
  parts.push(line(scx - crSize, scy, scx + crSize, scy, C.accent, 1.2))
  parts.push(line(scx, scy - crSize, scx, scy + crSize, C.accent, 1.2))
  parts.push(`<circle cx="${scx}" cy="${scy}" r="3.5" fill="${C.accent}"/>`)

  // "SUBJECT SITE" label
  parts.push(txt(scx + 8, scy - 6, 'SUBJECT SITE', { size: 7, fill: C.accent, spacing: '0.15em', weight: '400' }))

  // Streets (fill street area, then label)
  // Horizontal street (across center)
  parts.push(rect(PLAN_X + 20, cy - SW * 0.5, PLAN_W - 40, SW, C.street))
  // Vertical street
  parts.push(rect(cx - SW * 0.5, 10, SW, TOP_H - 20, C.street))

  // Street labels
  const streetH = d.neighborhood.includes('NE') || d.neighborhood.includes('Alberta') ? 'NE' :
                  d.neighborhood.includes('SE') || d.neighborhood.includes('Division') ? 'SE' :
                  d.neighborhood.includes('NW') ? 'NW' : 'SW'
  parts.push(txt(PLAN_X + 30, cy - SW * 0.5 - 8, `${streetH} [STREET]`, { size: 7, fill: C.textMuted, spacing: '0.15em' }))
  parts.push(`<text x="${cx + SW * 0.5 + 6}" y="${cy - 20}" font-size="7" fill="${C.textMuted}" letter-spacing="0.15em" text-anchor="start" font-family="'Arial Narrow', Arial, sans-serif" transform="rotate(90, ${cx + SW * 0.5 + 6}, ${cy - 20})">${e(`${streetH} [AVE]`)}</text>`)

  // Section cut markers
  const sectX = subjBlockX - 30
  parts.push(txt(sectX - 14, scy + 4, 'A', { size: 8, fill: C.textMuted, spacing: '0' }))
  parts.push(line(sectX, scy - 2, bfx, scy - 2, C.textMuted, 0.7, '3 2'))
  parts.push(txt(sectX - 14, TOP_H - 30, 'A', { size: 8, fill: C.textMuted, spacing: '0' }))

  // Annotations — MAX stop (right side, dashed line)
  if (d.distToMaxMeters != null) {
    const maxX = PLAN_X + PLAN_W * 0.82
    const maxY = cy - 60
    parts.push(line(scx, scy, maxX - 10, maxY + 10, C.textMuted, 0.5, '4 3'))
    parts.push(`<circle cx="${maxX}" cy="${maxY}" r="8" fill="none" stroke="${C.line}" stroke-width="1"/>`)
    // bus icon in circle
    parts.push(`<line x1="${maxX}" y1="${maxY - 5}" x2="${maxX}" y2="${maxY + 5}" stroke="${C.line}" stroke-width="0.7"/>`)
    parts.push(`<line x1="${maxX - 5}" y1="${maxY}" x2="${maxX + 5}" y2="${maxY}" stroke="${C.line}" stroke-width="0.7"/>`)
    const distLabel = metersToMiles(d.distToMaxMeters)
    parts.push(txt(maxX + 14, maxY - 4, 'MAX STOP', { size: 7.5, spacing: '0.15em' }))
    parts.push(txt(maxX + 14, maxY + 8, distLabel, { size: 7, fill: C.textMuted, spacing: '0.1em' }))
  }

  // Annotation — Zoning (right margin)
  if (d.zoningCode) {
    const zx = PLAN_X + PLAN_W * 0.84
    const zy = cy + 80
    parts.push(line(zx - 10, zy - 20, zx - 40, zy - 60, C.lineFaint, 0.5))
    parts.push(txt(zx, zy - 24, 'ZONING', { size: 7, fill: C.textMuted, spacing: '0.2em' }))
    parts.push(txt(zx, zy - 10, d.zoningCode, { size: 13, weight: '300', spacing: '0.1em' }))
    if (d.zoningDesc) {
      const descWords = d.zoningDesc.toUpperCase().split(' ')
      parts.push(txt(zx, zy + 4, descWords.slice(0, 2).join(' '), { size: 7, fill: C.textMuted, spacing: '0.1em' }))
      if (descWords.length > 2) {
        parts.push(txt(zx, zy + 15, descWords.slice(2).join(' '), { size: 7, fill: C.textMuted, spacing: '0.1em' }))
      }
    }
  }

  // Approximate location notice
  if (d.isApproximate) {
    parts.push(txt(PLAN_X + PLAN_W * 0.5, TOP_H - 22, 'APPROXIMATE NEIGHBORHOOD LOCATION', {
      size: 7, fill: C.textMuted, opacity: 0.7, anchor: 'middle', spacing: '0.2em',
    }))
  }

  // Scale bar (bottom right of plan area)
  const scaleX = PLAN_X + PLAN_W - 180
  const scaleY = TOP_H - 36
  // 100ft scale = roughly 30px at typical map scale
  const scaleLen = 90
  parts.push(line(scaleX, scaleY, scaleX + scaleLen, scaleY, C.textMuted, 0.7))
  parts.push(line(scaleX, scaleY - 4, scaleX, scaleY + 4, C.textMuted, 0.7))
  parts.push(line(scaleX + scaleLen * 0.5, scaleY - 3, scaleX + scaleLen * 0.5, scaleY + 3, C.textMuted, 0.5))
  parts.push(line(scaleX + scaleLen, scaleY - 4, scaleX + scaleLen, scaleY + 4, C.textMuted, 0.7))
  parts.push(txt(scaleX, scaleY + 12, "0'", { size: 6.5, fill: C.textMuted, anchor: 'middle', spacing: '0' }))
  parts.push(txt(scaleX + scaleLen * 0.5, scaleY + 12, "50'", { size: 6.5, fill: C.textMuted, anchor: 'middle', spacing: '0' }))
  parts.push(txt(scaleX + scaleLen, scaleY + 12, "100'", { size: 6.5, fill: C.textMuted, anchor: 'middle', spacing: '0' }))

  // North arrow
  const nx = PLAN_X + PLAN_W - 36
  const ny = TOP_H - 90
  parts.push(path(`M${nx},${ny} L${nx - 6},${ny + 18} L${nx},${ny + 12} L${nx + 6},${ny + 18} Z`,
    C.textMuted, 0.5, C.textMuted))
  parts.push(txt(nx, ny - 6, 'N', { size: 8, fill: C.textMuted, anchor: 'middle', spacing: '0', weight: '300' }))

  return parts.join('\n')
}

// ─── Data badge strip ─────────────────────────────────────────────────────────
function renderDataBadges(d: SiteAnalysisMapData): string {
  const y = TOP_H
  const parts: string[] = [
    rect(0, y, MAP_W, BADGE_H, C.badgeBg),
    line(0, y, MAP_W, y, C.divider, 0.5),
    line(0, y + BADGE_H - 1, MAP_W, y + BADGE_H - 1, C.divider, 0.5),
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

// ─── Section A–A ─────────────────────────────────────────────────────────────
function renderSectionView(d: SiteAnalysisMapData): string {
  const sy = SECT_Y
  const sh = MAP_H - sy   // 1000 - 680 = 320
  const parts: string[] = [
    rect(0, sy, MAP_W, sh, C.bg),
    line(0, sy, MAP_W, sy, C.divider, 0.5),
  ]

  // Section header
  parts.push(txt(36, sy + 34, 'SECTION A–A', { size: 11, weight: '300', spacing: '0.22em' }))
  parts.push(line(36, sy + 44, 200, sy + 44, C.divider, 0.5))

  // Ground line
  const groundY = sy + sh - 54
  parts.push(line(120, groundY, MAP_W - 120, groundY, C.line, 0.8))

  // Building section
  const bldLeft = 260
  const bldRight = MAP_W - 320
  const bldW = bldRight - bldLeft
  const roofY = groundY - 160
  const ceilingY = groundY - (d.ceilingHeightFt ? Math.min(d.ceilingHeightFt * 8, 160) : 130)

  // Building outline
  parts.push(path(
    `M${bldLeft},${groundY} L${bldLeft},${roofY} L${bldRight},${roofY} L${bldRight},${groundY}`,
    C.line, 1, 'none',
  ))

  // Interior ceiling line (dashed)
  parts.push(line(bldLeft, ceilingY, bldRight, ceilingY, C.textMuted, 0.5, '4 3'))

  // Ceiling height annotation
  const ceilMidX = bldLeft + bldW * 0.45
  parts.push(line(ceilMidX, ceilingY, ceilMidX, groundY, C.textMuted, 0.4, '2 3'))
  const ceilLabel = d.ceilingHeightFt ? `${d.ceilingHeightFt}'-0"` : 'CLR HT'
  parts.push(txt(ceilMidX + 6, ceilingY + (groundY - ceilingY) * 0.5, ceilLabel, {
    size: 8, fill: C.textMuted, spacing: '0.1em',
  }))
  parts.push(txt(ceilMidX + 6, ceilingY + (groundY - ceilingY) * 0.5 + 12, 'CLEAR', {
    size: 7, fill: C.textMuted, spacing: '0.1em',
  }))

  // Interior columns (subtle)
  const colPositions = [0.25, 0.5, 0.75]
  for (const p of colPositions) {
    const colX = bldLeft + bldW * p
    parts.push(rect(colX - 3, ceilingY, 6, groundY - ceilingY, C.blockAlt))
    parts.push(line(colX, ceilingY, colX, groundY, C.lineFaint, 0.8))
  }

  // Tree silhouette (left of building)
  const treeX = bldLeft - 70
  const trunkY = groundY
  parts.push(line(treeX, trunkY, treeX, trunkY - 55, C.textMuted, 0.8))
  parts.push(`<ellipse cx="${treeX}" cy="${trunkY - 75}" rx="22" ry="30" fill="none" stroke="${C.textMuted}" stroke-width="0.7" opacity="0.6"/>`)

  // Car silhouette (left)
  const carX = bldLeft - 160
  const carY = groundY
  parts.push(rect(carX, carY - 18, 50, 18, 'none'))
  parts.push(path(`M${carX},${carY} L${carX},${carY - 12} L${carX + 12},${carY - 18} L${carX + 38},${carY - 18} L${carX + 50},${carY - 12} L${carX + 50},${carY} Z`,
    C.textMuted, 0.6, 'none'))

  // Street label
  parts.push(txt(36, groundY + 16, d.neighborhood.toUpperCase() + ' ST', {
    size: 7, fill: C.textMuted, spacing: '0.15em',
  }))

  // Sun path arc
  const arcCx = bldLeft + bldW * 0.5
  const arcPeakY = sy + 76
  const arcLeft = 180
  const arcRight = MAP_W - 200

  parts.push(path(
    `M${arcLeft},${roofY + 20} Q${arcCx},${arcPeakY} ${arcRight},${roofY + 20}`,
    C.accent, 0.6, 'none', '5 4',
  ))

  // Sun icons
  function sunIcon(sx: number, sunY: number, label: string, labelBelow: boolean): string {
    const r = 7
    const labelY = labelBelow ? sunY + r + 12 : sunY - r - 6
    const rays = [0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
      const rad = angle * Math.PI / 180
      const x1 = sx + (r + 2) * Math.cos(rad)
      const y1 = sunY + (r + 2) * Math.sin(rad)
      const x2 = sx + (r + 5) * Math.cos(rad)
      const y2 = sunY + (r + 5) * Math.sin(rad)
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${C.accent}" stroke-width="0.7" opacity="0.6"/>`
    }).join('')
    return `${rays}<circle cx="${sx}" cy="${sunY}" r="${r}" fill="none" stroke="${C.accent}" stroke-width="0.8" opacity="0.8"/>
<text x="${sx}" y="${labelY}" font-size="7" fill="${C.textMuted}" text-anchor="middle" letter-spacing="0.12em" font-family="'Arial Narrow', Arial, sans-serif">${e(label)}</text>`
  }

  parts.push(sunIcon(arcLeft + 10, roofY + 20, 'AM', false))
  parts.push(sunIcon(arcCx, arcPeakY, 'NOON', false))
  parts.push(sunIcon(arcRight - 10, roofY + 20, 'PM', false))

  // Daylight note (right side)
  const dnx = MAP_W - 200
  const dny = sy + 70
  const daylightNote = d.hasDaylightData ? 'NATURAL LIGHT' : 'DAYLIGHT'
  const daylightSub = d.hasDaylightData ? 'NOTED BY OWNER' : 'OWNER VERIFY'
  parts.push(`<circle cx="${dnx + 10}" cy="${dny + 8}" r="8" fill="none" stroke="${C.accent}" stroke-width="0.8" opacity="0.7"/>`)
  for (let angle = 0; angle < 360; angle += 45) {
    const rad = angle * Math.PI / 180
    const x1 = dnx + 10 + 10 * Math.cos(rad)
    const y1 = dny + 8 + 10 * Math.sin(rad)
    const x2 = dnx + 10 + 14 * Math.cos(rad)
    const y2 = dny + 8 + 14 * Math.sin(rad)
    parts.push(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${C.accent}" stroke-width="0.6" opacity="0.5"/>`)
  }
  parts.push(txt(dnx + 26, dny + 4, daylightNote, { size: 8, spacing: '0.2em', fill: C.textMuted }))
  parts.push(txt(dnx + 26, dny + 17, daylightSub, { size: 7, spacing: '0.15em', fill: C.textMuted, opacity: 0.7 }))
  if (!d.hasDaylightData) {
    parts.push(txt(dnx + 26, dny + 30, 'LADYBUG FILE', { size: 6.5, spacing: '0.1em', fill: C.textMuted, opacity: 0.5 }))
    parts.push(txt(dnx + 26, dny + 41, 'NOT UPLOADED', { size: 6.5, spacing: '0.1em', fill: C.textMuted, opacity: 0.5 }))
  }

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
${renderSectionView(data)}
</svg>`

  return Buffer.from(svg, 'utf-8')
}
