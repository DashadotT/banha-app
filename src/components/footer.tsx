import { Ionicons } from "@expo/vector-icons";
import { Linking, Pressable, Text, View } from "react-native";

/**
 * Placeholder contact/credit details — swap these for the real
 * ones whenever you have them (just tell me and I'll update it).
 */
const CONTACT_EMAIL = "banha.project@example.com";
const DEVELOPERS = ["Mark Jovan G. Octat", "Ahrdy Jane P. Desalan", "Jacob Israel A. Ranin"];

export function Footer() {
  return (
    <View className="mt-2 items-center border-t border-border pt-6">
      <Text className="text-xs font-bold uppercase tracking-wide text-primary">BANHA</Text>
      <Text className="mt-1 text-center text-[11px] leading-4 text-muted">
        Bridging Air, Noise, Heat, and Achievement
      </Text>

      <View className="mt-4 w-full rounded-xl p-4">
        <Text className="mb-2 text-center text-[11px] font-bold uppercase tracking-wide text-muted">
          Developers
        </Text>

        <View className="flex-row flex-wrap justify-center gap-x-4 gap-y-2">
          {DEVELOPERS.map((name) => (
            <Text key={name} className="text-center text-xs text-ink">
              {name}
            </Text>
          ))}
        </View>

        <Pressable
          onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)}
          className="mt-3 flex-row items-center justify-center gap-1.5"
        >
          <Ionicons name="mail-outline" size={14} color="#EBAF1C" />
          <Text className="text-xs font-semibold text-primary">
            {CONTACT_EMAIL}
          </Text>
        </Pressable>
      </View>

      <Text className="mt-4 text-[10px] text-muted">© {new Date().getFullYear()} BANHA Project</Text>
    </View>
  );
}
