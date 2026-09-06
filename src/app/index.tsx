import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

import { Badge, BadgeTone } from "@/components/badge";
import { Card, CardTitle, StatusRow } from "@/components/card";
import { Footer } from "@/components/footer";
import { OfflineNotice } from "@/components/offline-notice";
import { PrimaryButton } from "@/components/primary-button";
import { useEsp32Status } from "@/hooks/use-esp32-status";
import { ESP32_AP_SSID } from "@/lib/esp32";

export default function HomeScreen() {
  const router = useRouter();
  const { status, connectionState, errorMessage, lastUpdated, refresh } = useEsp32Status();
  const [manualRefreshing, setManualRefreshing] = useState(false);

  const onPullToRefresh = useCallback(async () => {
    setManualRefreshing(true);
    await refresh();
    setManualRefreshing(false);
  }, [refresh]);

  const isOffline = connectionState === "offline";
  const isChecking = connectionState === "checking";

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={manualRefreshing} onRefresh={onPullToRefresh} tintColor="#EBAF1C" />
      }
    >
      {isChecking && !status && (
        <Card className="items-center py-10">
          <Text className="text-sm text-muted">Looking for BANHA master node…</Text>
        </Card>
      )}

      {isOffline && (
        <OfflineNotice onRetry={refresh} retrying={manualRefreshing} errorMessage={errorMessage} />
      )}

      {status && !isOffline && (
        <>
          <Card>
            <View className="mb-3.5 flex-row items-center justify-between">
              <CardTitle>System Status</CardTitle>
              <Badge tone="ok" label="Connected" />
            </View>

            <StatusRow label="Router WiFi" value={<Badge tone={wifiTone(status)} label={wifiLabel(status)} />} />
            <StatusRow label="Configured Network" value={status.configured_ssid || "None"} />
            <StatusRow label="Connected SSID" value={status.wifi_connected ? status.ssid || "—" : "—"} />
            <StatusRow label="Router IP" value={status.wifi_connected ? status.ip || "—" : "—"} />
            <StatusRow label="Setup Hotspot" value={`${status.ap_ssid} · ${status.ap_ip}`} />
            <StatusRow
              label="LoRa Radio"
              value={<Badge tone={status.lora_ready ? "ok" : "bad"} label={status.lora_ready ? "Ready" : "Not Ready"} />}
            />
            <StatusRow
              label="Recording"
              value={
                <Badge
                  tone={status.recording_active ? "warn" : "ok"}
                  label={status.recording_active ? "Recording" : "Idle"}
                />
              }
              last
            />
          </Card>

          <Card>
            <CardTitle>WiFi Configuration</CardTitle>
            <Text className="mb-1 text-sm leading-5 text-ink">
              Master node is currently {status.wifi_connected ? "connected to your router" : "not connected to a router"}
              {status.configured_ssid ? ` (${status.configured_ssid})` : ""}.
            </Text>
            <Text className="text-xs leading-5 text-muted">
              Changing this only affects the device's internet-facing WiFi. This app always talks to
              Master node directly over the {ESP32_AP_SSID} hotspot, so it keeps working either way.
            </Text>
            <PrimaryButton label="Configure Router WiFi" onPress={() => router.push("/wifi-setup")} />
          </Card>

          {lastUpdated && (
            <View className="flex-row items-center justify-center gap-1.5 py-2">
              <Ionicons name="time-outline" size={12} color="#9FB3CC" />
              <Text className="text-[11px] text-muted">Updated {timeAgo(lastUpdated)}</Text>
            </View>
          )}
        </>
      )}

      <Footer />
    </ScrollView>
  );
}

function wifiTone(status: { wifi_connected: boolean; wifi_connecting: boolean }): BadgeTone {
  if (status.wifi_connected) return "ok";
  if (status.wifi_connecting) return "warn";
  return "bad";
}

function wifiLabel(status: { wifi_connected: boolean; wifi_connecting: boolean }): string {
  if (status.wifi_connected) return "Connected";
  if (status.wifi_connecting) return "Connecting…";
  return "Disconnected";
}

function timeAgo(timestamp: number): string {
  const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (seconds < 2) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  return `${minutes}m ago`;
}
