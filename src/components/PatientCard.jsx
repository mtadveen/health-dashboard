export default function PatientCard() {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      border: '0.5px solid #e8e8e8',
      padding: '1.25rem 1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap'
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #378ADD, #185FA5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        color: '#fff',
        fontWeight: 700,
        flexShrink: 0
      }}>
        R
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>
          Ramaiah
        </div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
          Age 68 &nbsp;·&nbsp; Male &nbsp;·&nbsp; Patient ID: HW-2024-001
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 11,
            padding: '3px 10px',
            borderRadius: 999,
            background: '#FCEBEB',
            color: '#A32D2D',
            fontWeight: 500
          }}>
            Cardiac Risk
          </span>
          <span style={{
            fontSize: 11,
            padding: '3px 10px',
            borderRadius: 999,
            background: '#FFF8E1',
            color: '#854F0B',
            fontWeight: 500
          }}>
            Hypertension
          </span>
          <span style={{
            fontSize: 11,
            padding: '3px 10px',
            borderRadius: 999,
            background: '#EAF3DE',
            color: '#3B6D11',
            fontWeight: 500
          }}>
            Monitoring Active
          </span>
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 11, color: '#aaa' }}>Emergency contact</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#333', marginTop: 2 }}>
          Suresh (Son)
        </div>
        <div style={{ fontSize: 12, color: '#378ADD', marginTop: 2 }}>
          +91 98765 43210
        </div>
      </div>
    </div>
  )
}