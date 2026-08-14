import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type SelectCardProps = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  icon?: ReactNode;
  /** Trailing slot — e.g. a price or count. */
  right?: ReactNode;
  className?: string;
};

export function SelectCard({
  label,
  description,
  selected,
  onPress,
  icon,
  right,
  className = "",
}: SelectCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`flex-row items-center gap-4 rounded-2xl border px-4 py-4 active:opacity-80 ${
        selected ? "border-ink bg-ink" : "border-line bg-surface"
      } ${className}`}
    >
      {icon ? (
        <View
          className={`h-11 w-11 items-center justify-center rounded-xl ${
            selected ? "bg-white/15" : "bg-surface-sunken"
          }`}
        >
          {icon}
        </View>
      ) : null}
      <View className="flex-1">
        <Text className={`text-body font-semibold ${selected ? "text-canvas" : "text-ink"}`}>
          {label}
        </Text>
        {description ? (
          <Text className={`mt-0.5 text-caption ${selected ? "text-faint" : "text-muted"}`}>
            {description}
          </Text>
        ) : null}
      </View>
      {right}
    </Pressable>
  );
}
