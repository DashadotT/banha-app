import { Footer } from "@/components/footer";
import { PrimaryButton } from "@/components/primary-button";
import { ESP32_AP_PASSWORD, ESP32_AP_SSID } from "@/lib/esp32";
import { Ionicons } from "@expo/vector-icons";
import * as IntentLauncher from "expo-intent-launcher";
import { Linking, Platform, Text, View } from "react-native";

export function OfflineNotice({
  onRetry,
  retrying,
  errorMessage,
}: {
  onRetry: () => void;
  retrying: boolean;
  errorMessage: string | null;
}) {
  const openWifiSettings = () => {
    if (Platform.OS === "android") {
      // The plain "open settings" API always opens the app's own settings
      // page on Android — this is the actual system intent for the WiFi
      // settings screen instead.
      IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.WIFI_SETTINGS).catch(() =>
        Linking.openSettings()
      );
      return;
    }

    // iOS doesn't let apps deep-link into the WiFi settings pane at all —
    // Apple only allows opening the app's own settings screen. There's no
    // supported workaround; the best we can do is open Settings and let
    // the person tap into WiFi themselves.
    Linking.openSettings();
  };

  return (
    <>
      <View className="items-center rounded-card border border-border bg-card p-8">
        <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-bad-bg">
          <Ionicons name="wifi-outline" size={32} color="#F87171" />
        </View>

        <Text className="mb-1 text-center text-lg font-bold text-ink">Not connected to Node 2</Text>
        <Text className="mb-5 text-center text-sm text-muted">
          {errorMessage ?? "Connect your phone to the BANHA-SETUP WiFi network to continue."}
        </Text>

        <View className="mb-1 w-full rounded-xl bg-cardAlt p-4">
          <Step number={1} text={`Open WiFi settings and join "${ESP32_AP_SSID}"`} />
          <Step number={2} text={`Password: ${ESP32_AP_PASSWORD}`} />
          <Step number={3} text="Come back here — the app will reconnect automatically" />
        </View>

        {Platform.OS === "ios" && (
          <Text className="mb-1 mt-3 text-center text-[11px] leading-4 text-muted">
            iOS doesn&apos;t allow apps to jump straight to the WiFi screen — this opens Settings,
            then tap WiFi from there.
          </Text>
        )}

        <PrimaryButton label="Open WiFi Settings" onPress={openWifiSettings} />
        <PrimaryButton label="Retry Now" onPress={onRetry} loading={retrying} variant="secondary" />
      </View>

      <Footer />
    </>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <View className="mb-2 flex-row items-start gap-2.5 last:mb-0">
      <View className="mt-0.5 h-5 w-5 items-center justify-center rounded-full bg-primary">
        <Text className="text-[11px] font-bold text-primary-ink">{number}</Text>
      </View>
      <Text className="flex-1 text-sm leading-5 text-ink">{text}</Text>
    </View>
  );
}