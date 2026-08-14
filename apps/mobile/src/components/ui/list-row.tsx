import { ChevronRight } from "lucide-react-native";
import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { color } from "@/design";

type ListRowProps = {
  label: string;
  description?: string;
  /** Leading slot — typically an icon in a tinted tile. */
  icon?: ReactNode;
  /** Trailing slot. Falls back to a chevron when `onPress` is set. */
  right?: ReactNode;
  onPress?: () => void;
  destructive?: boolean;
  className?: string;
};

/**
 * Hairline-separated navigation row. The editorial layout leans on rules
 * between rows rather than boxing every item in its own card.
 */
export function ListRow({
  label,
  description,
  icon,
  right,
  onPress,
  destructive = false,
  className = "",
}: ListRowProps) {
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      className={`flex-row items-center gap-3 py-3.5 ${onPress ? "active:opacity-60" : ""} ${className}`}
    >
      {icon ? (
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-surface-sunken">
          {icon}
        </View>
      ) : null}
      <View className="flex-1">
        <Text className={`text-body font-medium ${destructive ? "text-danger" : "text-ink"}`}>
          {label}
        </Text>
        {description ? (
          <Text className="mt-0.5 text-caption text-muted" numberOfLines={2}>
            {description}
          </Text>
        ) : null}
      </View>
      {right ?? (onPress ? <ChevronRight size={18} color={color.faint} /> : null)}
    </Wrapper>
  );
}
