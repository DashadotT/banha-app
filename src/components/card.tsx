import { ReactNode } from "react";
import { Text, View } from "react-native";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <View
      className={`mb-4 rounded-card border border-border bg-card p-5 shadow-sm ${className}`}
    >
      {children}
    </View>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <Text className="mb-3.5 text-xs font-bold uppercase tracking-wide text-muted">
      {children}
    </Text>
  );
}

export function StatusRow({
  label,
  value,
  valueClassName = "",
  last = false,
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center justify-between gap-2.5 py-2.5 ${
        last ? "" : "border-b border-border"
      }`}
    >
      <Text className="text-[13px] font-semibold text-muted">{label}</Text>
      {typeof value === "string" ? (
        <Text className={`max-w-[60%] text-right text-sm font-semibold text-ink ${valueClassName}`}>
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  );
}
