import { ActivityIndicator, Pressable, Text } from "react-native";

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}) {
  const isSecondary = variant === "secondary";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`mt-3 items-center justify-center rounded-xl px-4 py-3.5 active:opacity-80 ${
        isSecondary ? "border border-primary bg-transparent" : "bg-primary"
      } ${disabled || loading ? "opacity-60" : ""}`}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? "#EBAF1C" : "#001C3D"} />
      ) : (
        <Text className={`text-base font-bold ${isSecondary ? "text-primary" : "text-primary-ink"}`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}