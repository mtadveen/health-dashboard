# 🏥 Health Monitoring and Emergency Alert System

> An IoT-based smart health monitoring device that continuously tracks heart rate and body temperature in real time, and automatically alerts family members and doctors during a medical emergency — through WiFi and GSM, simultaneously.

**Live Dashboard:** [health-dashboard-batch13.vercel.app](https://health-dashboard-batch13.vercel.app)

---

## 📌 Problem Statement

Many people — especially elderly individuals and patients living alone — face sudden health emergencies such as abnormal heart rate or high body temperature, with no immediate help available. Manual health tracking is inconsistent, caregivers can't be present 24/7, and by the time someone notices something is wrong, it's often too late.

This project builds an automated system that **never sleeps, never gets distracted, and never misses a reading** — and calls for help the moment something goes wrong, without requiring any action from the patient.

---

## ✨ Features

- 📈 **Real-time vitals monitoring** — Heart rate (BPM) and body temperature (°C) every second
- 🧠 **Intelligent noise filtering** — Moving Average Filter (last 5 readings) + Persistence Check (3–5 sec sustained abnormality) to eliminate false alarms
- 🚨 **Multi-channel emergency alerts** — Local buzzer + WiFi push notification (Blynk) + GSM SMS, all simultaneously
- ☁️ **IoT Cloud integration** — Live data sync with Blynk Cloud (Virtual Pins V0 & V1)
- 🖥️ **Live web dashboard** — Built in React.js, deployed on Vercel
- 🧪 **Auto-simulation mode** — Generates realistic sensor data automatically (no hardware required for demo)
- 📋 **Patient profile & device status** — Battery, WiFi strength, last sync, emergency contacts
- 📊 **Reading history graph** — Real-time Chart.js visualization of last 15 readings
- 🔔 **Emergency alert log** — Timestamped record of all alerts and status checks

---

## 🧱 System Architecture

```
┌──────────────┐     I2C      ┌──────────────┐     WiFi      ┌──────────────┐
│  MAX30102    │─────────────▶│              │──────────────▶│ Blynk Cloud  │
│  (Heart Rate)│              │   NodeMCU    │               │   Server     │
├──────────────┤     I2C      │   ESP8266    │               └──────┬───────┘
│  MLX90614    │─────────────▶│              │                      │
│ (Temperature)│              │  • Moving Avg │                      ▼
└──────────────┘              │  • Persistence│              ┌──────────────┐
                               │    Check      │              │ Web Dashboard│
┌──────────────┐    GPIO      │              │              │  (React.js)  │
│   Buzzer     │◀─────────────│              │              │   on Vercel  │
└──────────────┘              │              │              └──────────────┘
                               │              │     UART      ┌──────────────┐
┌──────────────┐    I2C       │              │──────────────▶│  SIM800L     │
│  16x2 LCD    │◀─────────────│              │               │ GSM Module   │
└──────────────┘              └──────────────┘               └──────┬───────┘
                                                                      │ SMS
                                                                      ▼
                                                              ┌──────────────┐
                                                              │  Emergency   │
                                                              │  Contacts    │
                                                              └──────────────┘
```

---

## 🔧 Hardware Components

| Component | Model | Purpose | Protocol |
|---|---|---|---|
| Microcontroller | NodeMCU ESP8266 | Central processing + built-in WiFi | — |
| Heart Rate Sensor | MAX30102 | Pulse detection via infrared | I2C |
| Temperature Sensor | MLX90614 | Contactless body temperature | I2C |
| GSM Module | SIM800L | SMS alerts, independent of internet | UART |
| Display | I2C LCD 16x2 | Live vitals display | I2C |
| Buzzer | Active Buzzer | Local emergency alarm | GPIO |

**Total hardware cost: ~₹1,530** — significantly more affordable than commercial alternatives (₹8,000–₹50,000).

---

## 💻 Software Stack

| Layer | Technology |
|---|---|
| Firmware | C++ (Arduino IDE) |
| Dashboard Frontend | React.js + Vite |
| Charts | Chart.js + react-chartjs-2 |
| IoT Cloud | Blynk Cloud (HTTP API) |
| Version Control | Git + GitHub (private repo) |
| Deployment | Vercel |

---

## 🩺 Medical Thresholds

Based on WHO and standard clinical guidelines — not arbitrary values:

| Parameter | Safe Range | Alert Condition | Medical Term |
|---|---|---|---|
| Heart Rate | 60–100 BPM | Below 60 BPM | Bradycardia |
| Heart Rate | 60–100 BPM | Above 100 BPM | Tachycardia |
| Temperature | 36.1–37.2°C | Above 38.0°C | Fever |
| Temperature | 36.1–37.2°C | Above 40.0°C | Critical Emergency |
| Temperature | 36.1–37.2°C | Below 36.1°C | Hypothermia |

---

## 🧠 How the Filtering Works

```js
// Moving Average Filter — smooths last 5 readings
avgHR = (R1 + R2 + R3 + R4 + R5) / 5

// Persistence Check — must stay abnormal for 5 consecutive readings (~5 sec)
if (avgHR < 60 || avgHR > 100) sustainedCount++
else sustainedCount = 0

if (sustainedCount >= 5) triggerEmergencyAlert()
```

This two-layer validation eliminates false alarms caused by sensor noise or brief patient movement, while still catching genuine emergencies within seconds.

---

## 📁 Project Structure

```
health-dashboard/
├── src/
│   ├── components/
│   │   ├── PatientCard.jsx       # Patient profile section
│   │   ├── DeviceStatus.jsx      # Blynk/battery/WiFi status bar
│   │   ├── MetricCard.jsx        # HR / Temp / Avg / Count cards
│   │   ├── InputPanel.jsx        # Manual sensor input
│   │   ├── HistoryChart.jsx      # Chart.js reading history graph
│   │   ├── AlertLog.jsx          # Emergency alert log
│   │   ├── EmergencyPopup.jsx    # Popup + alarm on emergency
│   │   └── Sidebar.jsx           # Navigation
│   ├── utils/
│   │   └── thresholds.js         # Classification + filter logic
│   ├── blynk.js                  # Blynk HTTP API integration
│   ├── App.jsx                   # Main app + auto-simulation logic
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/mtadveen/health-dashboard.git
cd health-dashboard

# Install dependencies
npm install

# Run locally
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Blynk IoT Setup

1. Create a free account at [blynk.io](https://blynk.io)
2. Create a new Template with two Virtual Pin datastreams:
   - `V0` → Heart Rate (Integer, 0–250)
   - `V1` → Temperature (Double, 30–45)
3. Create a Device from the template and copy the **Auth Token**
4. Paste the token in `src/blynk.js`
5. Add Gauge widgets on the Blynk Web Dashboard for V0 and V1

---

## 🧪 Demo Mode (No Hardware Required)

Since this is a prototype awaiting physical hardware procurement, the dashboard includes an **Auto Simulation Mode**:

- **Normal mode** — generates HR 68–88 BPM, Temp 36.2–37.7°C every 4 seconds
- **Emergency mode** — generates HR 110–150 BPM, Temp 38.5–40.5°C every 4 seconds
- A status check fires every 5 readings, classifying overall patient condition
- All simulated readings are pushed live to Blynk Cloud, just like real sensor data would be

When the physical NodeMCU + sensors are connected, they push to the **same Blynk channel** — zero changes needed on the dashboard side.

---

## 🔮 Future Enhancements

- 📱 Dedicated mobile application (Android/iOS)
- 📍 GPS-based emergency location tracking
- 🤖 Machine learning model for personalized baseline anomaly detection
- 🩸 Additional vitals — Blood Pressure, SpO2
- 🏥 Multi-patient dashboard for care homes and clinics
- 📡 Offline mesh networking for zero-connectivity areas

---

## 👥 Team — Batch 13

| Name | Roll Number |
|---|---|
| Munazza Tadveen (Team Lead) | 24JJ1A0539 |
| G. Varun Kumar | 24JJ1A0520 |
| Joys Roseleena | 24JJ1A0544 |
| Sai Kiran | 25JJ5A0502 |

**Guide:** Dr. K. Shahu Chatrapathi, Professor & Head of CSE

**Department of Computer Science & Engineering**
Jawaharlal Nehru Technological University Hyderabad
University College of Engineering Jagtial (Autonomous)

---

## 📄 License

This project is developed for academic purposes as part of the Real-Time Research Project / Societal Related Project, CSE Department, JNTUH UCEJ — 2025-2026.
