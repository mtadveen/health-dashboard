import { useState, useEffect } from 'react'
import { sendToBlynk, readFromBlynk } from './blynk'
import MetricCard from './components/MetricCard'
import InputPanel from './components/InputPanel'
import HistoryChart from './components/HistoryChart'
import AlertLog from './components/AlertLog'
import EmergencyPopup from './components/EmergencyPopup'
import Sidebar from './components/Sidebar'
import PatientCard from './components/PatientCard'
import DeviceStatus from './components/DeviceStatus'
import { classifyHR, classifyTemp, getMovingAverage, getOverallLevel } from './utils/thresholds'

export default function App() {
  const [readings, setReadings] = useState([])
  const [logs, setLogs] = useState([])
  const [popup, setPopup] = useState(null)
  const [lastHR, setLastHR] = useState(null)
  const [lastTemp, setLastTemp] = useState(null)
  const [activePage, setActivePage] = useState('dashboard')
  const [blynkStatus, setBlynkStatus] = useState('connecting')

  useEffect(() => {
    const interval = setInterval(() => {
      setBlynkStatus('connected')
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  function playAlarm() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.type = 'square'
          osc.frequency.value = 880
          gain.gain.setValueAtTime(0.3, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
          osc.start()
          osc.stop(ctx.currentTime + 0.4)
        }, i * 500)
      }
    } catch (e) {}
  }

  function handleSend(hr, temp) {
    const now = new Date()
    const time = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    const newReadings = [...readings, { hr, temp, time }].slice(-15)
    setReadings(newReadings)
    setLastHR(hr)
    setLastTemp(temp)

    sendToBlynk(hr, temp)

    const hrInfo = classifyHR(hr)
    const tempInfo = classifyTemp(temp)
    const overall = getOverallLevel(hrInfo.level, tempInfo.level)

    if (newReadings.length < 5) return

    if (overall !== 'normal') {
      const msgs = []
      if (hrInfo.level !== 'normal') {
        msgs.push(`Heart rate: ${Math.round(hr)} BPM — ${hrInfo.label}`)
      }
      if (tempInfo.level !== 'normal') {
        msgs.push(`Temperature: ${temp.toFixed(1)}°C — ${tempInfo.label}`)
      }
      const logEntry = { level: overall, msg: msgs.join(' · '), time }
      setLogs(prev => [logEntry, ...prev])
      setPopup({ level: overall, msgs })
      playAlarm()
    }
  }

  const hrInfo = lastHR !== null ? classifyHR(lastHR) : null
  const tempInfo = lastTemp !== null ? classifyTemp(lastTemp) : null
  const avgHR = getMovingAverage(readings, 'hr')
  const overall = hrInfo && tempInfo ? getOverallLevel(hrInfo.level, tempInfo.level) : 'normal'

  const statusColors = {
    normal: '#1D9E75',
    warning: '#EF9F27',
    critical: '#E24B4A'
  }
  const statusLabels = {
    normal: 'NORMAL',
    warning: 'WARNING',
    critical: 'EMERGENCY'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f9', fontFamily: "'Segoe UI', sans-serif" }}>

      <Sidebar active={activePage} setActive={setActivePage} />

      <div style={{ marginLeft: 220, flex: 1, padding: '2rem 1.5rem' }}>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>
              {activePage === 'dashboard' && 'Dashboard'}
              {activePage === 'history' && 'Reading History'}
              {activePage === 'alerts' && 'Alert Log'}
              {activePage === 'settings' && 'Settings'}
            </h1>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>
              Real-time health monitoring — Blynk IoT integrated
            </div>
          </div>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            padding: '6px 16px',
            borderRadius: 999,
            background: statusColors[overall] + '22',
            color: statusColors[overall],
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span style={{
              width: 7, height: 7,
              borderRadius: '50%',
              background: statusColors[overall],
              display: 'inline-block'
            }} />
            {statusLabels[overall]}
          </span>
        </div>

        <PatientCard />
        <DeviceStatus readingsCount={readings.length} blynkStatus={blynkStatus} />

        {readings.length < 5 && (
          <div style={{
            background: '#FFF8E1',
            border: '1px solid #EF9F27',
            borderRadius: 10,
            padding: '10px 16px',
            marginBottom: '1.5rem',
            fontSize: 13,
            color: '#854F0B',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            ⏳ Collecting readings — {readings.length}/5 done. Alerts activate after 5 readings.
          </div>
        )}

        {(activePage === 'dashboard' || activePage === 'history') && (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <MetricCard
                label="Heart rate"
                value={lastHR !== null ? Math.round(lastHR) : null}
                unit="BPM"
                status={hrInfo?.level}
                sublabel={hrInfo?.label}
              />
              <MetricCard
                label="Body temperature"
                value={lastTemp !== null ? lastTemp.toFixed(1) : null}
                unit="°C"
                status={tempInfo?.level}
                sublabel={tempInfo?.label}
              />
              <MetricCard
                label="Moving average"
                value={avgHR !== null ? avgHR.toFixed(1) : null}
                unit="BPM"
                sublabel={`${Math.min(readings.length, 5)}/5 readings`}
              />
              <MetricCard
                label="Total readings"
                value={readings.length}
                sublabel="This session"
              />
            </div>
            <InputPanel onSend={handleSend} />
            <HistoryChart readings={readings} />
          </>
        )}

        {(activePage === 'dashboard' || activePage === 'alerts') && (
          <AlertLog logs={logs} />
        )}

        {activePage === 'settings' && (
          <div style={{
            background: '#fff',
            borderRadius: 14,
            border: '0.5px solid #e8e8e8',
            padding: '1.5rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: '1rem', color: '#333' }}>
              Threshold settings
            </div>
            {[
              { label: 'Heart rate — low threshold', value: '60 BPM', note: 'Bradycardia below this' },
              { label: 'Heart rate — high threshold', value: '100 BPM', note: 'Tachycardia above this' },
              { label: 'Temperature — fever', value: '38.0°C', note: 'Warning triggered' },
              { label: 'Temperature — critical', value: '40.0°C', note: 'Emergency triggered' },
              { label: 'Moving average window', value: '5 readings', note: 'Readings before alert fires' },
              { label: 'Alert channels', value: 'WiFi + GSM SMS', note: 'Both active' },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < 5 ? '0.5px solid #f0f0f0' : 'none',
                flexWrap: 'wrap',
                gap: 8
              }}>
                <div>
                  <div style={{ fontSize: 13, color: '#333' }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{s.note}</div>
                </div>
                <span style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#378ADD',
                  background: '#EBF5FF',
                  padding: '4px 12px',
                  borderRadius: 999
                }}>
                  {s.value}
                </span>
              </div>
            ))}

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#EAF3DE',
              borderRadius: 10,
              border: '0.5px solid #97C459'
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#3B6D11', marginBottom: 6 }}>
                Blynk IoT Integration
              </div>
              <div style={{ fontSize: 12, color: '#3B6D11' }}>
                Status: <strong>{blynkStatus === 'connected' ? 'Connected' : 'Connecting...'}</strong>
              </div>
              <div style={{ fontSize: 12, color: '#3B6D11', marginTop: 4 }}>
                Template: Heath Monitor &nbsp;·&nbsp; Device: Ramaiah's Device
              </div>
              <div style={{ fontSize: 12, color: '#3B6D11', marginTop: 4 }}>
                V0 → Heart Rate &nbsp;·&nbsp; V1 → Temperature
              </div>
            </div>
          </div>
        )}

      </div>

      <EmergencyPopup data={popup} onClose={() => setPopup(null)} />
    </div>
  )
}