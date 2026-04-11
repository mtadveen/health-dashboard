export default function EmergencyPopup({ data, onClose }) {
  if (!data) return null

  const isCritical = data.level === 'critical'

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '2rem',
        maxWidth: 320,
        width: '90%',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>
          {isCritical ? '🚨' : '⚠️'}
        </div>
        <div style={{
          fontSize: 18,
          fontWeight: 500,
          color: isCritical ? '#A32D2D' : '#854F0B',
          marginBottom: 8
        }}>
          {isCritical ? 'Emergency detected!' : 'Warning detected'}
        </div>
        <div style={{
          fontSize: 14,
          color: '#666',
          marginBottom: 20,
          lineHeight: 1.6
        }}>
          {data.msgs.map((m, i) => (
            <div key={i}>{m}</div>
          ))}
          <div style={{ fontSize: 12, color: '#aaa', marginTop: 8 }}>
            Alert sent to emergency contacts via WiFi + GSM
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            padding: '8px 24px',
            borderRadius: 8,
            border: '0.5px solid #ccc',
            background: '#f5f5f5',
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          Acknowledge
        </button>
      </div>
    </div>
  )
}