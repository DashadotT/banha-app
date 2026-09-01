/**
 * Client for the BANHA Node 2 ESP32's local web server.
 *
 * The phone talks directly to the device over the BANHA-SETUP
 * WiFi access point at a fixed local IP (192.168.4.1). There is
 * no internet involved and no cloud service is contacted from
 * the app — everything here is a plain HTTP request to the LAN
 * address the ESP32's AP hands out.
 *
 * Endpoints (must match node2.ino):
 *   GET  /status  -> JSON status snapshot
 *   POST /save    -> { ssid, password } form body, saves + connects WiFi
 */

export const ESP32_BASE_URL = "http://192.168.4.1";
export const ESP32_AP_SSID = "BANHA-SETUP";
export const ESP32_AP_PASSWORD = "banha@nbsc2026";

export interface Esp32Status {
  wifi_connected: boolean;
  wifi_connecting: boolean;
  configured_ssid: string;
  ssid: string;
  ip: string;
  ap_ssid: string;
  ap_ip: string;
  lora_ready: boolean;
  recording_active: boolean;
}

export class Esp32Error extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "Esp32Error";
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Esp32Error(
        "No response from the device. Make sure your phone is connected to the BANHA-SETUP WiFi network.",
        err
      );
    }
    throw new Esp32Error(
      "Couldn't reach the device. Make sure your phone is connected to the BANHA-SETUP WiFi network.",
      err
    );
  } finally {
    clearTimeout(timer);
  }
}

/** Fetch the current status snapshot from Node 2. */
export async function getStatus(timeoutMs = 4000): Promise<Esp32Status> {
  const res = await fetchWithTimeout(
    `${ESP32_BASE_URL}/status`,
    { method: "GET" },
    timeoutMs
  );

  if (!res.ok) {
    throw new Esp32Error(`Device responded with an error (HTTP ${res.status}).`);
  }

  try {
    return (await res.json()) as Esp32Status;
  } catch (err) {
    throw new Esp32Error("Device sent an unreadable response.", err);
  }
}

/**
 * Save new router WiFi credentials on the device and ask it to
 * connect. The BANHA-SETUP hotspot stays up the entire time, so
 * the phone never loses its connection to the device while this
 * happens — poll getStatus() afterwards to watch wifi_connected /
 * wifi_connecting flip.
 */
export async function saveWifi(
  ssid: string,
  password: string,
  timeoutMs = 8000
): Promise<void> {
  const body = new URLSearchParams();
  body.append("ssid", ssid);
  body.append("password", password);

  const res = await fetchWithTimeout(
    `${ESP32_BASE_URL}/save`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    },
    timeoutMs
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Esp32Error(text || `Save failed (HTTP ${res.status}).`);
  }
}
