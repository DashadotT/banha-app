import { Linking, Platform, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PrimaryButton } from "@/components/primary-button";
import { ESP32_AP_PASSWORD, ESP32_AP_SSID } from "@/lib/esp32";

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
    if (Platform.OS === "ios") {
      Linking.openURL("App-Prefs:root=WIFI").catch(() => Linking.openSettings());
    } else {
      Linking.openSettings();
    }
  };

  return (
    <View className="items-center rounded-card border border-border bg-card p-8">
      <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-bad-bg">
        <Ionicons name="wifi-outline" size={32} color="#dc2626" />
      </View>

      <Text className="mb-1 text-center text-lg font-bold text-ink">Not connected to Node 2</Text>
      <Text className="mb-5 text-center text-sm text-muted">
        {errorMessage ?? "Connect your phone to the BANHA-SETUP WiFi network to continue."}
      </Text>

      <View className="mb-1 w-full rounded-xl bg-bg p-4">
        <Step number={1} text={`Open WiFi settings and join "${ESP32_AP_SSID}"`} />
        <Step number={2} text={`Password: ${ESP32_AP_PASSWORD}`} />
        <Step number={3} text="Come back here — the app will reconnect automatically" />
      </View>

      <PrimaryButton label="Open WiFi Settings" onPress={openWifiSettings} />
      <PrimaryButton label="Retry Now" onPress={onRetry} loading={retrying} variant="secondary" />
    </View>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <View className="mb-2 flex-row items-start gap-2.5 last:mb-0">
      <View className="mt-0.5 h-5 w-5 items-center justify-center rounded-full bg-primary">
        <Text className="text-[11px] font-bold text-white">{number}</Text>
      </View>
      <Text className="flex-1 text-sm leading-5 text-ink">{text}</Text>
    </View>
  );
}
