export default function Sidebar({ active, setActive }) {
  const items = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'history', icon: '📈', label: 'History' },
    { id: 'alerts', icon: '🚨', label: 'Alerts' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ]

  return (
    <div style={{
      width: 220,
      minHeight: '100vh',
      background: '#fff',
      borderRight: '0.5px solid #e8e8e8',
      padding: '1.5rem 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      position: 'fixed',
      top: 0,
      left: 0,
      boxShadow: '2px 0 8px rgba(0,0,0,0.04)'
    }}>
      <div style={{
        padding: '0 1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          fontSize: 16,
          fontWeight: 700,
          color: '#1a1a1a',
          letterSpacing: '-0.3px'
        }}>
          HealthWatch
        </div>
        <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
          IoT Monitor v1.0
        </div>
      </div>

      {items.map(item => (
        <div
          key={item.id}
          onClick={() => setActive(item.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 1.5rem',
            cursor: 'pointer',
            borderRadius: 0,
            background: active === item.id ? '#EBF5FF' : 'transparent',
            borderLeft: active === item.id ? '3px solid #378ADD' : '3px solid transparent',
            color: active === item.id ? '#185FA5' : '#666',
            fontWeight: active === item.id ? 600 : 400,
            fontSize: 14,
            transition: 'all 0.15s'
          }}
        >
          <span style={{ fontSize: 16 }}>{item.icon}</span>
          {item.label}
        </div>
      ))}

      <div style={{
        marginTop: 'auto',
        padding: '1rem 1.5rem',
        borderTop: '0.5px solid #e8e8e8',
        fontSize: 11,
        color: '#bbb'
      }}>
        JNTU Hyderabad<br />
        Batch 13 — CSE Dept
      </div>
    </div>
  )
}