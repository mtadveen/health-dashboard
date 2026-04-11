import { useState, useEffect } from 'react'

export default function DeviceStatus({ readingsCount }) {
  const [time, setTime] = useState(new Date())
  const [battery, setBattery] = useState(87)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (readingsCount > 0) {
      setBattery(prev => Math.max(prev - 0.5, 0))
    }
  }, [readingsCount])

  const lastSync = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  const batteryColor = battery > 50 ? '#1D9E75' : battery > 20 ? '#EF9F27' : '#E24B4A'

  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      border: '0.5px solid #e8e8e8',
      padding: '0.75rem 1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      flexWrap: 'wrap'
    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 8, height: 8,
          borderRadius: '50%',
          background: '#1D9E75',
          boxShadow: '0 0 6px #1D9E75'
        }} />
        <span style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>Device connected</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14 }}>🫀</span>
        <span style={{ fontSize: 12, color: '#555' }}>
          Sensor active
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14 }}>🔋</span>
        <span style={{ fontSize: 12, color: batteryColor, fontWeight: 500 }}>
          {battery.toFixed(0)}%
        </span>
        <div style={{
          width: 32,
          height: 10,
          border: `1.5px solid ${batteryColor}`,
          borderRadius: 3,
          padding: 1.5,
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: `${battery}%`,
            height: '100%',
            background: batteryColor,
            borderRadius: 2,
            transition: 'width 0.5s'
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14 }}>📡</span>
        <span style={{ fontSize: 12, color: '#555' }}>
          WiFi &nbsp;<span style={{ color: '#1D9E75', fontWeight: 500 }}>Strong</span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14 }}>🕐</span>
        <span style={{ fontSize: 12, color: '#555' }}>
          Last sync: <span style={{ fontWeight: 500, color: '#333' }}>{lastSync}</span>
        </span>
      </div>

      <div style={{ marginLeft: 'auto', fontSize: 11, color: '#bbb' }}>
        NodeMCU ESP8266 &nbsp;·&nbsp; GSM Active
      </div>

    </div>
  )
}