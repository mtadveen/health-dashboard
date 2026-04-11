export const THRESHOLDS = {
  HR_LOW: 60,
  HR_HIGH: 100,
  TEMP_LOW: 36.1,
  TEMP_NORMAL_HIGH: 37.2,
  TEMP_FEVER: 38.0,
  TEMP_CRITICAL: 40.0,
}

export function classifyHR(bpm) {
  if (bpm < THRESHOLDS.HR_LOW) return { label: 'Bradycardia', level: 'critical' }
  if (bpm > THRESHOLDS.HR_HIGH) return { label: 'Tachycardia', level: 'critical' }
  return { label: 'Normal', level: 'normal' }
}

export function classifyTemp(temp) {
  if (temp >= THRESHOLDS.TEMP_CRITICAL) return { label: 'Critical Fever', level: 'critical' }
  if (temp >= THRESHOLDS.TEMP_FEVER) return { label: 'Fever', level: 'warning' }
  if (temp < THRESHOLDS.TEMP_LOW) return { label: 'Hypothermia', level: 'warning' }
  return { label: 'Normal', level: 'normal' }
}

export function getMovingAverage(readings, key, window = 5) {
  if (readings.length === 0) return null
  const slice = readings.slice(-window)
  return slice.reduce((sum, r) => sum + r[key], 0) / slice.length
}

export function getOverallLevel(hrLevel, tempLevel) {
  if (hrLevel === 'critical' || tempLevel === 'critical') return 'critical'
  if (hrLevel === 'warning' || tempLevel === 'warning') return 'warning'
  return 'normal'
}