import { Lightbulb, type LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import { color } from "@/design";

type InsightTone = "primary" | "success" | "warning" | "info";

type InsightCalloutProps = {
  title?: string;
  body: string;
  icon?: LucideIcon;
  tone?: InsightTone;
  className?: string;
};

const surfaces: Record<InsightTone, string> = {
  primary: "bg-primary-50 border-primary-100",
  success: "bg-success-soft border-success/20",
  warning: "bg-warning-soft border-warning/20",
  info: "bg-info-soft border-info/20",
};

const accents: Record<InsightTone, string> = {
  primary: color.primary,
  success: color.success,
  warning: color.warning,
  info: color.info,
};

const headings: Record<InsightTone, string> = {
  primary: "text-primary-700",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
};

/**
 * The tinted "here's the reasoning" panel.
 *
 * Extracted from the identical blocks that were duplicated in
 * `outfit-today.tsx` and `generate/detail.tsx`, and now reused by every Phase 2
 * and Phase 3 results screen.
 */
export function InsightCallout({
  title = "Why this works",
  body,
  icon: Icon = Lightbulb,
  tone = "primary",
  className = "",
}: InsightCalloutProps) {
  return (
    <View className={`rounded-2xl border p-4 ${surfaces[tone]} ${className}`}>
      <View className="flex-row items-center gap-2">
        <Icon size={16} color={accents[tone]} strokeWidth={2} />
        <Text className={`text-micro font-semibold uppercase ${headings[tone]}`}>{title}</Text>
      </View>
      <Text className="mt-2 text-body-sm leading-5 text-ink-soft">{body}</Text>
    </View>
  );
}
