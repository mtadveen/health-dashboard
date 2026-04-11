const BLYNK_AUTH_TOKEN = "-GnnR1Dsa6P-Dc_GbUfMtADD_AsNvgh6"
const BASE_URL = "https://blynk.cloud/external/api"

export async function sendToBlynk(heartRate, temperature) {
  try {
    await fetch(`${BASE_URL}/update?token=${BLYNK_AUTH_TOKEN}&v0=${heartRate}`, { mode: 'no-cors' })
    await fetch(`${BASE_URL}/update?token=${BLYNK_AUTH_TOKEN}&v1=${temperature}`, { mode: 'no-cors' })
    console.log(`Sent to Blynk — HR: ${heartRate}, Temp: ${temperature}`)
  } catch (err) {
    console.error("Failed to send to Blynk:", err)
  }
}

export async function readFromBlynk() {
  return null
}