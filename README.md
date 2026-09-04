# BANHA Mobile App

Talks directly to a BANHA Node 2 ESP32 over its local `BANHA-SETUP` WiFi
hotspot at `http://192.168.4.1`. No internet, no cloud service, no
Supabase call is ever made from this app — every request in
`src/lib/esp32.ts` is a plain HTTP call to that fixed LAN address.

## How it fits your existing project

You already have `src/app/index.tsx` and `src/app/_layout.tsx` from the
reset template — this package **replaces** them. Drop everything under
this zip's `src/` into your project's `src/`, and merge the new
dependencies from `package.json` into yours (nativewind, tailwindcss,
`@expo/vector-icons`), keeping your existing `assets/`, `AGENTS.md`,
`CLAUDE.md`, `app.json` bundle identifiers, etc. as-is.

Files added/replaced:
```
src/app/_layout.tsx        (replaced — adds the wifi-setup route)
src/app/index.tsx          (replaced — dashboard screen)
src/app/wifi-setup.tsx     (new — WiFi config flow)
src/lib/esp32.ts           (new — HTTP client for the device)
src/hooks/use-esp32-status.ts (new — polling hook)
src/components/*.tsx       (new — badge, card, button, offline notice)
src/global.css             (new — Tailwind entry, if you don't have one)
tailwind.config.js         (new, or merge the `colors` block into yours)
babel.config.js / metro.config.js  (new, or merge NativeWind wiring into yours)
```

## Install

```bash
npm install nativewind tailwindcss @expo/vector-icons
npx expo install expo-router expo-status-bar expo-linking expo-constants \
  react-native-safe-area-context react-native-screens
```

## Run

1. Flash `node2.ino` to the ESP32 (unchanged — no firmware changes required).
2. Connect your **phone** to the `BANHA-SETUP` WiFi network
   (password `banha@nbsc2026`).
3. `npx expo start`, open the app.
4. The dashboard auto-polls `/status` every 3s and shows a clear
   "not connected" screen with instructions if the phone isn't on
   BANHA-SETUP yet (checked automatically on launch and on any retry).

## What talks to what

- **Dashboard** (`index.tsx`) mirrors the device's own web dashboard:
  router WiFi state, LoRa radio state, recording state, hotspot info —
  all pulled from `GET /status`, which is the only read endpoint the
  current firmware exposes.
- **WiFi Setup** (`wifi-setup.tsx`) posts to `POST /save` (the same
  endpoint the device's built-in captive page uses) and then polls
  `/status` until `wifi_connected` flips true/false, exactly like the
  device's own `getConnectingHTML()` flow — because BANHA-SETUP never
  goes down during this, the phone stays connected throughout.

## Known limitation (by design of the current firmware)

`node2.ino` doesn't currently expose live sensor readings (CO2 / temp /
noise / packet number) or a way to start/stop a recording over HTTP —
those are LoRa-only (driven by Node 1) and get pushed straight to
Supabase from the device. The app can only show what `/status` reports:
whether a recording is active, not the live values.

If you want the app to show live readings and let you start/stop
recordings, add two small pieces to `node2.ino`:

1. Track the most recent reading in a small struct alongside the
   existing `receivedPacketNumber` / `receivedAverageCO2` /
   `receivedAverageTemp` / `receivedAverageNoise` globals (they're
   already there — just don't discard them after upload).
2. Add two routes in `startWebServer()`:
   - `GET /api/reading` → JSON of the latest packet + `recording_active`.
   - (Optional, bigger change) `POST /api/start` / `POST /api/stop` →
     only makes sense if you also want the phone to be able to trigger
     a recording independently of Node 1's physical button, which
     changes the system's source of truth for start/stop.

Happy to write that firmware patch and the matching screen if you want
it — just ask.
