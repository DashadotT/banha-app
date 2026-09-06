import "@/global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
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
        <Stack.Screen
          name="index"
          options={{
            headerTitle: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("../../assets/images/logo.png")}
                  style={{ width: 50, height: 50, marginRight: 8 }}
                  resizeMode="contain"
                />
                <View>
                  <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 15 }}>
                    BANHA
                  </Text>
                  <Text style={{ color: "#FFFFFF", fontSize: 12 }}>
                    Local LoRa Receiver &amp; WiFi Configuration
                  </Text>
                </View>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="wifi-setup"
          options={{ title: "WiFi Setup", presentation: "modal" }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
