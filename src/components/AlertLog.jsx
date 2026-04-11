export default function AlertLog({ logs }) {
  const colors = {
    critical: '#E24B4A',
    warning: '#EF9F27'
  }
  const bgColors = {
    critical: '#FCEBEB',
    warning: '#FAEEDA'
  }

  return (
    <div style={{
      background: '#fff',
      border: '0.5px solid #e8e8e8',
      borderRadius: 14,
      padding: '1.25rem 1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}>
      <div style={{
        fontSize: 11,
        color: '#999',
        marginBottom: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: 500
      }}>
        Emergency alert log
      </div>
      {logs.length === 0
        ? (
          <div style={{
            textAlign: 'center',
            color: '#bbb',
            padding: '1.5rem 0',
            fontSize: 13
          }}>
            No alerts triggered yet
          </div>
        )
        : logs.map((log, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              background: bgColors[log.level],
              marginBottom: i < logs.length - 1 ? 8 : 0,
              fontSize: 13
            }}
          >
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: colors[log.level],
              flexShrink: 0
            }} />
            <span style={{ flex: 1, color: '#333' }}>{log.msg}</span>
            <span style={{
              fontSize: 11,
              color: '#999',
              whiteSpace: 'nowrap'
            }}>
              {log.time}
            </span>
          </div>
        ))
      }
    </div>
  )
}