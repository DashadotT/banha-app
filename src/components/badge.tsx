import { Text, View } from "react-native";

export type BadgeTone = "ok" | "bad" | "warn";

const TONE_STYLES: Record<BadgeTone, { bg: string; text: string; dot: string }> = {
  ok: { bg: "bg-ok-bg", text: "text-ok-text", dot: "bg-ok-text" },
  bad: { bg: "bg-bad-bg", text: "text-bad-text", dot: "bg-bad-text" },
  warn: { bg: "bg-pending-bg", text: "text-pending-text", dot: "bg-pending-text" },
};

export function Badge({ tone, label }: { tone: BadgeTone; label: string }) {
  const styles = TONE_STYLES[tone];

  return (
    <View className={`flex-row items-center gap-1.5 self-end rounded-full px-2.5 py-1 ${styles.bg}`}>
      <View className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      <Text className={`text-xs font-bold ${styles.text}`}>{label}</Text>
    </View>
  );
}
