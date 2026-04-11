export default function MetricCard({ label, value, unit, status, sublabel }) {
  const colors = {
    normal: '#1D9E75',
    warning: '#EF9F27',
    critical: '#E24B4A',
    default: '#888'
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      padding: '1.25rem',
      minWidth: 140,
      flex: 1,
      border: '0.5px solid #e8e8e8',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.2s'
    }}>
      <div style={{
        fontSize: 11,
        color: '#999',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: 500
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{
          fontSize: 32,
          fontWeight: 600,
          color: colors[status] || colors.default,
          lineHeight: 1
        }}>
          {value ?? '--'}
        </span>
        {unit && (
          <span style={{ fontSize: 13, color: '#aaa' }}>{unit}</span>
        )}
      </div>
      {sublabel && (
        <div style={{
          fontSize: 11,
          marginTop: 6,
          color: colors[status] || '#aaa',
          fontWeight: 500
        }}>
          {sublabel}
        </div>
      )}
    </div>
  )
}