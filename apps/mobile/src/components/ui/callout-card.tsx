import { Lightbulb, type LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import { color } from "@/design";

type CalloutTone = "primary" | "success" | "warning" | "info";

type CalloutCardProps = {
  title?: string;
  body: string;
  icon?: LucideIcon;
  tone?: CalloutTone;
  className?: string;
};

/**
 * Spec §6.14 — the tinted "here's the reasoning" panel behind "Why this
 * outfit", "Stylist Suggestion" and "Pro Tip". Tinted fill, 12px radius, a
 * 20px lightbulb in the accent colour, and deliberately no border or shadow so
 * it reads as a note *inside* the page rather than another card on it.
 *
 * Extracted from the identical blocks that were duplicated in
 * `outfit-today.tsx` and `generate/detail.tsx`; every Phase 2 and Phase 3
 * results screen now reuses it. `InsightCallout` is the same component under
 * its original name — see `insight-callout.tsx`.
 */
const surfaces: Record<CalloutTone, string> = {
  primary: "bg-primary-50",
  success: "bg-success-light",
  warning: "bg-warning-light",
  info: "bg-info-light",
};

const accents: Record<CalloutTone, string> = {
  primary: color.primary500,
  success: color.success,
  warning: color.warning,
  info: color.info,
};

const headings: Record<CalloutTone, string> = {
  primary: "text-text-primary",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
};

export function CalloutCard({
  title = "Why this works",
  body,
  icon: Icon = Lightbulb,
  tone = "primary",
  className = "",
}: CalloutCardProps) {
  return (
    <View className={`rounded-md px-lg py-md ${surfaces[tone]} ${className}`}>
      <View className="flex-row items-center gap-sm">
        <Icon size={20} color={accents[tone]} strokeWidth={2} />
        <Text className={`text-body font-semibold ${headings[tone]}`}>{title}</Text>
      </View>
      <Text className="mt-sm text-body text-text-secondary">{body}</Text>
    </View>
  );
}
