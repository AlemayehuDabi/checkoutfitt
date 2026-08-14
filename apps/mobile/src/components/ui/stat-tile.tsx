import { type ReactNode } from "react";
import { Text, View } from "react-native";

type StatTileProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "primary" | "inverse";
  className?: string;
};

const surfaces = {
  default: "bg-surface border border-line",
  primary: "bg-primary-50 border border-primary-100",
  inverse: "bg-surface-inverse border border-transparent",
} as const;

const values = {
  default: "text-ink",
  primary: "text-primary-700",
  inverse: "text-canvas",
} as const;

const labels = {
  default: "text-muted",
  primary: "text-primary-600",
  inverse: "text-faint",
} as const;

/**
 * Compact numeric readout. Consolidates the one-off `Metric` / `SummaryRow` /
 * `QuickAction` stat blocks that had been hand-rolled per screen.
 */
export function StatTile({
  label,
  value,
  hint,
  icon,
  tone = "default",
  className = "",
}: StatTileProps) {
  return (
    <View className={`rounded-2xl p-4 ${surfaces[tone]} ${className}`}>
      <View className="flex-row items-center gap-1.5">
        {icon}
        <Text className={`text-micro font-semibold uppercase ${labels[tone]}`} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text className={`mt-2 text-h2 font-bold ${values[tone]}`}>{value}</Text>
      {hint ? (
        <Text className={`mt-0.5 text-caption ${tone === "inverse" ? "text-faint" : "text-muted"}`}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
