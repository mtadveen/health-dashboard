import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

export default function HistoryChart({ readings }) {
  const data = {
    labels: readings.map(r => r.time),
    datasets: [
      {
        label: 'Heart Rate (BPM)',
        data: readings.map(r => r.hr),
        borderColor: '#378ADD',
        backgroundColor: 'rgba(55,138,221,0.08)',
        pointBackgroundColor: readings.map(r => (r.hr < 60 || r.hr > 100) ? '#E24B4A' : '#378ADD'),
        tension: 0.3,
        yAxisID: 'yHR'
      },
      {
        label: 'Temperature (°C)',
        data: readings.map(r => r.temp),
        borderColor: '#D85A30',
        backgroundColor: 'rgba(216,90,48,0.07)',
        pointBackgroundColor: readings.map(r => r.temp >= 38 ? '#E24B4A' : '#D85A30'),
        tension: 0.3,
        yAxisID: 'yTemp'
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      yHR: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'BPM', font: { size: 11 } }
      },
      yTemp: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: '°C', font: { size: 11 } },
        grid: { drawOnChartArea: false }
      }
    }
  }

  return (
    <div style={{
      border: '0.5px solid #ddd',
      borderRadius: 12,
      padding: '1.25rem',
      marginBottom: '1.5rem',
      background: '#fff'
    }}>
      <div style={{ fontSize: 14, color: '#888', marginBottom: '1rem' }}>
        Reading history
      </div>
      {readings.length === 0
        ? (
          <div style={{ textAlign: 'center', color: '#aaa', padding: '2rem 0', fontSize: 13 }}>
            No readings yet — send your first reading above
          </div>
        )
        : (
          <div style={{ height: 220 }}>
            <Line data={data} options={options} />
          </div>
        )
      }
    </div>
  )
}