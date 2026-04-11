import { useState } from 'react'

export default function InputPanel({ onSend }) {
  const [hr, setHr] = useState('')
  const [temp, setTemp] = useState('')

  function handleSend() {
    const hrVal = parseFloat(hr)
    const tempVal = parseFloat(temp)
    if (isNaN(hrVal) || isNaN(tempVal)) {
      alert('Please enter both values')
      return
    }
    if (hrVal < 0 || hrVal > 250) {
      alert('Heart rate must be between 0 and 250')
      return
    }
    if (tempVal < 30 || tempVal > 45) {
      alert('Temperature must be between 30 and 45')
      return
    }
    onSend(hrVal, tempVal)
    setHr('')
    setTemp('')
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
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: 500
      }}>
        Manual sensor input
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 120 }}>
          <label style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>
            Heart rate (BPM)
          </label>
          <input
            type="number"
            value={hr}
            onChange={e => setHr(e.target.value)}
            placeholder="e.g. 78"
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 15,
              outline: 'none',
              background: '#fafafa'
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 120 }}>
          <label style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>
            Temperature (°C)
          </label>
          <input
            type="number"
            value={temp}
            onChange={e => setTemp(e.target.value)}
            placeholder="e.g. 36.8"
            step="0.1"
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 15,
              outline: 'none',
              background: '#fafafa'
            }}
          />
        </div>
        <button
          onClick={handleSend}
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            border: 'none',
            background: '#378ADD',
            color: '#fff',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.target.style.background = '#185FA5'}
          onMouseLeave={e => e.target.style.background = '#378ADD'}
        >
          Send reading
        </button>
      </div>
    </div>
  )
}