import { useState, useEffect, useRef } from 'react'
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
  const [autoSimulate, setAutoSimulate] = useState(false)
  const [simulateEmergency, setSimulateEmergency] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const readingsRef = useRef([])
  const logsRef = useRef([])
  const simulateEmergencyRef = useRef(false)
  const totalCountRef = useRef(0)

  useEffect(() => {
    simulateEmergencyRef.current = simulateEmergency
  }, [simulateEmergency])

  useEffect(() => {
    const interval = setInterval(() => {
      setBlynkStatus('connected')
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!autoSimulate) return

    const interval = setInterval(() => {
      let hr, temp

      if (simulateEmergencyRef.current) {
        hr = Math.floor(Math.random() * 40) + 110
        temp = parseFloat((Math.random() * 2 + 38.5).toFixed(1))
      } else {
        hr = Math.floor(Math.random() * 20) + 68
        temp = parseFloat((Math.random() * 1.5 + 36.2).toFixed(1))
      }

      const now = new Date()
      const time = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })

      const newReadings = [...readingsRef.current, { hr, temp, time }].slice(-15)
      readingsRef.current = newReadings
      setReadings([...newReadings])
      setLastHR(hr)
      setLastTemp(temp)
      sendToBlynk(hr, temp)

      totalCountRef.current = totalCountRef.current + 1
      setTotalCount(totalCountRef.current)

      if (totalCountRef.current % 5 === 0) {
        const last5 = newReadings.slice(-5)
        const avgHR = last5.reduce((s, r) => s + r.hr, 0) / 5
        const avgTemp = last5.reduce((s, r) => s + r.temp, 0) / 5

        const hrInfo = classifyHR(avgHR)
        const tempInfo = classifyTemp(avgTemp)
        const overall = getOverallLevel(hrInfo.level, tempInfo.level)

        const msgs = []
        if (overall === 'normal') {
          msgs.push(`All vitals normal — Avg HR: ${avgHR.toFixed(1)} BPM, Avg Temp: ${avgTemp.toFixed(1)}°C`)
        } else {
          if (hrInfo.level !== 'normal') msgs.push(`Heart rate: ${avgHR.toFixed(1)} BPM — ${hrInfo.label}`)
          if (tempInfo.level !== 'normal') msgs.push(`Temperature: ${avgTemp.toFixed(1)}°C — ${tempInfo.label}`)
        }

        const logEntry = { level: overall, msg: msgs.join(' · '), time }
        const newLogs = [logEntry, ...logsRef.current]
        logsRef.current = newLogs
        setLogs([...newLogs])

        if (overall !== 'normal') {
          setPopup({ level: overall, msgs })
          playAlarm()
        }
      }

    }, 4000)

    return () => clearInterval(interval)
  }, [autoSimulate])

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
    readingsRef.current = newReadings
    setReadings(newReadings)
    setLastHR(hr)
    setLastTemp(temp)
    sendToBlynk(hr, temp)

    totalCountRef.current = totalCountRef.current + 1
    setTotalCount(totalCountRef.current)

    if (totalCountRef.current % 5 === 0) {
      const last5 = newReadings.slice(-5)
      const avgHR = last5.reduce((s, r) => s + r.hr, 0) / 5
      const avgTemp = last5.reduce((s, r) => s + r.temp, 0) / 5

      const hrInfo = classifyHR(avgHR)
      const tempInfo = classifyTemp(avgTemp)
      const overall = getOverallLevel(hrInfo.level, tempInfo.level)

      const msgs = []
      if (overall === 'normal') {
        msgs.push(`All vitals normal — Avg HR: ${avgHR.toFixed(1)} BPM, Avg Temp: ${avgTemp.toFixed(1)}°C`)
      } else {
        if (hrInfo.level !== 'normal') msgs.push(`Heart rate: ${avgHR.toFixed(1)} BPM — ${hrInfo.label}`)
        if (tempInfo.level !== 'normal') msgs.push(`Temperature: ${avgTemp.toFixed(1)}°C — ${tempInfo.label}`)
      }

      const logEntry = { level: overall, msg: msgs.join(' · '), time }
      setLogs(prev => [logEntry, ...prev])

      if (overall !== 'normal') {
        setPopup({ level: overall, msgs })
        playAlarm()
      }
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

        <div style={{
          background: '#fff',
          borderRadius: 14,
          border: '0.5px solid #e8e8e8',
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap'
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#333', marginRight: 8 }}>
            Auto Simulation
          </div>

          <button
            onClick={() => {
              setAutoSimulate(!autoSimulate)
              if (autoSimulate) setSimulateEmergency(false)
            }}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: 'none',
              background: autoSimulate ? '#E24B4A' : '#1D9E75',
              color: '#fff',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {autoSimulate ? '⏹ Stop Simulation' : '▶ Start Simulation'}
          </button>

          {autoSimulate && (
            <button
              onClick={() => setSimulateEmergency(!simulateEmergency)}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                border: 'none',
                background: simulateEmergency ? '#1D9E75' : '#E24B4A',
                color: '#fff',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              {simulateEmergency ? '✅ Switch to Normal' : '🚨 Simulate Emergency'}
            </button>
          )}

          {autoSimulate && (
            <div style={{
              fontSize: 12,
              color: simulateEmergency ? '#E24B4A' : '#1D9E75',
              fontWeight: 500
            }}>
              {simulateEmergency
                ? '🚨 Sending dangerous vitals — alert fires every 5 readings'
                : '✅ Sending normal vitals — status check every 5 readings'}
            </div>
          )}

          {autoSimulate && (
            <div style={{ fontSize: 12, color: '#aaa', marginLeft: 'auto' }}>
              Reading #{totalCount} · Next check in {5 - (totalCount % 5 === 0 ? 5 : totalCount % 5)} readings
            </div>
          )}
        </div>

        <PatientCard />
        <DeviceStatus readingsCount={readings.length} blynkStatus={blynkStatus} />

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
                sublabel={`${Math.min(totalCount, 5)}/5 readings`}
              />
              <MetricCard
                label="Total readings"
                value={totalCount || readings.length}
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
                Template: Heath Monitor · Device: Heath Monitor
              </div>
              <div style={{ fontSize: 12, color: '#3B6D11', marginTop: 4 }}>
                V0 → Heart Rate · V1 → Temperature
              </div>
            </div>
          </div>
        )}

      </div>

      <EmergencyPopup data={popup} onClose={() => setPopup(null)} />
    </div>
  )
}