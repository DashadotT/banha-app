import "@/global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#001C3D" },
          headerShadowVisible: false,
          headerTintColor: "#EBAF1C",
          headerTitleStyle: { color: "#FFFFFF", fontWeight: "700" },
          contentStyle: { backgroundColor: "#001C3D" },
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
