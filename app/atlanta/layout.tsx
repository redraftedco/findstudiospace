export default function AtlantaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      '--lime':          '#c0392b',
      '--lime-bg':       '#c0392b',
      '--lime-bg-hover': '#922b21',
      '--lime-soft':     '#FDECEA',
    } as React.CSSProperties}>
      {children}
    </div>
  )
}
