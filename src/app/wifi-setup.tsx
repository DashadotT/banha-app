import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Card, CardTitle } from "@/components/card";
import { PrimaryButton } from "@/components/primary-button";
import { Esp32Error, getStatus, saveWifi } from "@/lib/esp32";
import { useEsp32Status } from "@/hooks/use-esp32-status";

type Phase = "form" | "connecting" | "success" | "fail";

const MAX_POLL_ATTEMPTS = 20;
const POLL_INTERVAL_MS = 1200;

export default function WifiSetupScreen() {
  const router = useRouter();
  const { status } = useEsp32Status(5000);

  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [connectedIp, setConnectedIp] = useState<string | null>(null);

  const attemptsRef = useRef(0);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (status?.configured_ssid && !ssid) {
      setSsid(status.configured_ssid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.configured_ssid]);

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, []);

  const pollForResult = () => {
    attemptsRef.current = 0;

    const tick = async () => {
      try {
        const data = await getStatus();
        if (data.wifi_connected) {
          setConnectedIp(data.ip);
          setPhase("success");
          return;
        }
        if (!data.wifi_connecting) {
          setPhase("fail");
          return;
        }
      } catch {
        // Device unreachable mid-poll (e.g. briefly toggling radios) — keep trying.
      }

      attemptsRef.current += 1;
      if (attemptsRef.current > MAX_POLL_ATTEMPTS) {
        setPhase("fail");
        return;
      }
      pollTimer.current = setTimeout(tick, POLL_INTERVAL_MS);
    };

    pollTimer.current = setTimeout(tick, POLL_INTERVAL_MS);
  };

  const onSubmit = async () => {
    if (!ssid.trim()) return;
    setSaveError(null);
    setPhase("connecting");

    try {
      await saveWifi(ssid.trim(), password);
      pollForResult();
    } catch (err) {
      setSaveError(err instanceof Esp32Error ? err.message : "Couldn't reach the device to save WiFi settings.");
      setPhase("form");
    }
  };

  if (phase === "connecting" || phase === "success" || phase === "fail") {
    return (
      <View className="flex-1 items-center justify-center bg-bg p-8">
        <Card className="w-full items-center py-10">
          {phase === "connecting" && (
            <>
              <View className="mb-5 h-14 w-14 items-center justify-center rounded-full border-4 border-border border-t-primary" />
              <Text className="mb-1 text-lg font-bold text-ink">Connecting to WiFi…</Text>
              <Text className="text-center text-sm text-muted">
                Attempting to join <Text className="font-bold">{ssid}</Text>
              </Text>
              <Text className="mt-3 text-center text-xs text-muted">
                This can take up to 15 seconds. BANHA-SETUP stays available the whole time.
              </Text>
            </>
          )}

          {phase === "success" && (
            <>
              <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-ok-bg">
                <Ionicons name="checkmark" size={32} color="#4ADE80" />
              </View>
              <Text className="mb-1 text-lg font-bold text-ink">Connected!</Text>
              <Text className="text-center text-sm text-muted">
                Node 2 joined <Text className="font-bold">{ssid}</Text>
                {connectedIp ? ` — IP ${connectedIp}` : ""}
              </Text>
              <PrimaryButton label="Back to Dashboard" onPress={() => router.back()} />
            </>
          )}

          {phase === "fail" && (
            <>
              <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-bad-bg">
                <Ionicons name="close" size={32} color="#F87171" />
              </View>
              <Text className="mb-1 text-lg font-bold text-ink">Connection Failed</Text>
              <Text className="text-center text-sm text-muted">
                Could not connect to <Text className="font-bold">{ssid}</Text>. Check the WiFi name and
                password, then try again.
              </Text>
              <PrimaryButton label="Try Again" onPress={() => setPhase("form")} />
            </>
          )}
        </Card>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg p-4.5">
      <Card>
        <CardTitle>Router WiFi Credentials</CardTitle>

        <Text className="mb-1 mt-1 text-xs font-bold text-muted">WiFi Name (SSID)</Text>
        <TextInput
          value={ssid}
          onChangeText={setSsid}
          placeholder="Your router's WiFi name"
          placeholderTextColor="#5D7290"
          autoCapitalize="none"
          autoCorrect={false}
          className="mt-1 rounded-xl border border-border bg-bg px-3.5 py-3 text-base text-ink"
        />

        <Text className="mb-1 mt-4 text-xs font-bold text-muted">WiFi Password</Text>
        <View className="mt-1 flex-row items-center rounded-xl border border-border bg-bg pr-2">
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter WiFi password"
            placeholderTextColor="#5D7290"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            className="flex-1 px-3.5 py-3 text-base text-ink"
          />
          <Pressable onPress={() => setShowPassword((v) => !v)} className="p-2">
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9FB3CC" />
          </Pressable>
        </View>

        {saveError && <Text className="mt-3 text-xs font-semibold text-danger">{saveError}</Text>}

        <PrimaryButton label="Save and Connect" onPress={onSubmit} disabled={!ssid.trim()} />
      </Card>

      <Text className="px-1 text-xs leading-5 text-muted">
        This saves the WiFi network Node 2 uses to reach the internet (e.g. for uploads). It doesn't
        change how this app talks to the device — that always happens locally over BANHA-SETUP.
      </Text>
    </View>
  );
}
