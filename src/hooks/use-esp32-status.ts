import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { Esp32Status, getStatus } from "@/lib/esp32";

export type ConnectionState = "checking" | "online" | "offline";

interface UseEsp32StatusResult {
  status: Esp32Status | null;
  connectionState: ConnectionState;
  errorMessage: string | null;
  lastUpdated: number | null;
  refresh: () => Promise<void>;
}

/**
 * Polls the ESP32's /status endpoint at a fixed interval and
 * automatically resumes/pauses when the app is foregrounded or
 * backgrounded. Never touches the network unless the app is
 * active, and never assumes internet is present — every request
 * is a plain LAN call to the device's own IP.
 */
export function useEsp32Status(pollIntervalMs = 3000): UseEsp32StatusResult {
  const [status, setStatus] = useState<Esp32Status | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>("checking");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const mountedRef = useRef(true);
  const inFlightRef = useRef(false);

  const refresh = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      const data = await getStatus();
      if (!mountedRef.current) return;
      setStatus(data);
      setConnectionState("online");
      setErrorMessage(null);
      setLastUpdated(Date.now());
    } catch (err) {
      if (!mountedRef.current) return;
      setConnectionState("offline");
      setErrorMessage(err instanceof Error ? err.message : "Unable to reach the device.");
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refresh();

    const interval = setInterval(refresh, pollIntervalMs);

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        refresh();
      }
    });

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
      subscription.remove();
    };
  }, [refresh, pollIntervalMs]);

  return { status, connectionState, errorMessage, lastUpdated, refresh };
}
