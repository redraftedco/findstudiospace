// ArchSpecs — displays structured architectural attributes as a spec table.
// Shown on listing detail pages only when at least one field is populated.
// These are the deal-breaker fields from the build-out research: the binary
// pass/fail criteria renters don't discover until after signing.

type Props = {
  ceilingHeightFt?: number | null
  powerAmps?: number | null
  voltagePhase?: string | null
  stcRating?: number | null
  ncRating?: number | null
  floorType?: string | null
  loadingDockType?: string | null
  ventilationCfm?: number | null
  kilnReady?: boolean | null
  cycWall?: boolean | null
}

const FLOOR_LABELS: Record<string, string> = {
  concrete: 'Concrete',
  sprung:   'Sprung subfloor',
  marley:   'Marley vinyl',
  hardwood: 'Hardwood',
  epoxy:    'Epoxy-sealed concrete',
  other:    'Other',
}

const DOCK_LABELS: Record<string, string> = {
  none:          'No loading dock',
  'street-level':'Street-level roll-up',
  'dock-high':   'Dock-high',
}

const VOLTAGE_NOTES: Record<string, string> = {
  '120V/1P': '120 V / single-phase',
  '208V/3P': '208 V / three-phase',
  '240V/1P': '240 V / single-phase',
  '240V/3P': '240 V / three-phase',
}

export default function ArchSpecs(props: Props) {
  const rows: { label: string; value: string; note?: string }[] = []

  if (props.ceilingHeightFt) {
    rows.push({
      label: 'Ceiling height',
      value: `${props.ceilingHeightFt} ft`,
      note: props.ceilingHeightFt < 12 ? 'Below 12 ft — full lighting rigs and overhead lifts may be limited' : undefined,
    })
  }
  if (props.powerAmps) {
    rows.push({ label: 'Power capacity', value: `${props.powerAmps}A` })
  }
  if (props.voltagePhase) {
    rows.push({
      label: 'Voltage / phase',
      value: VOLTAGE_NOTES[props.voltagePhase] ?? props.voltagePhase,
    })
  }
  if (props.stcRating) {
    const stcNote = props.stcRating < 50
      ? 'Below STC 50 — neighbor noise may be audible'
      : props.stcRating >= 60
        ? 'Professional recording isolation'
        : 'Good isolation for rehearsal'
    rows.push({ label: 'STC rating', value: String(props.stcRating), note: stcNote })
  }
  if (props.ncRating != null) {
    const ncNote = props.ncRating <= 20
      ? 'Broadcast-grade quiet'
      : props.ncRating <= 30
        ? 'Suitable for recording'
        : 'Standard office ambient noise'
    rows.push({ label: 'NC (noise criterion)', value: `NC-${props.ncRating}`, note: ncNote })
  }
  if (props.floorType) {
    rows.push({ label: 'Floor type', value: FLOOR_LABELS[props.floorType] ?? props.floorType })
  }
  if (props.loadingDockType && props.loadingDockType !== 'none') {
    rows.push({ label: 'Loading access', value: DOCK_LABELS[props.loadingDockType] ?? props.loadingDockType })
  }
  if (props.ventilationCfm) {
    rows.push({ label: 'Ventilation', value: `${props.ventilationCfm.toLocaleString()} CFM` })
  }
  if (props.kilnReady === true) {
    rows.push({ label: 'Kiln-ready', value: 'Yes — 240V/single-phase or 3-phase service confirmed' })
  }
  if (props.cycWall === true) {
    rows.push({ label: 'Cyclorama wall', value: 'Yes' })
  }

  if (rows.length === 0) return null

  return (
    <section>
      <h2
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--stone)',
          margin: '0 0 1rem',
        }}
      >
        Technical specs
      </h2>
      <dl style={{ margin: 0 }}>
        {rows.map((row, i) => (
          <div
            key={row.label}
            style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr',
              gap: '0 1.5rem',
              padding: '0.75rem 0',
              borderBottom: i < rows.length - 1 ? '1px solid var(--rule)' : 'none',
            }}
          >
            <dt
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--stone)',
                paddingTop: '2px',
              }}
            >
              {row.label}
            </dt>
            <dd style={{ margin: 0 }}>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  color: 'var(--ink)',
                  fontWeight: 500,
                }}
              >
                {row.value}
              </span>
              {row.note && (
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    color: 'var(--stone)',
                    marginTop: '2px',
                  }}
                >
                  {row.note}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
