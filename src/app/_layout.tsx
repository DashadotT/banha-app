import "@/global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#f1f5f9" },
          headerShadowVisible: false,
          headerTintColor: "#15803d",
          headerTitleStyle: { color: "#1e293b", fontWeight: "700" },
          contentStyle: { backgroundColor: "#f1f5f9" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "BANHA Node 2" }} />
        <Stack.Screen
          name="wifi-setup"
          options={{ title: "WiFi Setup", presentation: "modal" }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
