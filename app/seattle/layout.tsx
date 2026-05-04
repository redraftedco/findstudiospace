export default function SeattleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      '--lime':          '#2563a8',
      '--lime-bg':       '#2563a8',
      '--lime-bg-hover': '#1a4a80',
      '--lime-soft':     '#EBF2FA',
    } as React.CSSProperties}>
      {children}
    </div>
  )
}
