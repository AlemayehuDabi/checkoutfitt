import { Check } from "lucide-react-native";
import { Pressable, Text } from "react-native";

import { color } from "@/design";

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Hides the check mark — useful in dense filter rows. */
  compact?: boolean;
  className?: string;
};

export function Chip({ label, selected, onPress, compact = false, className = "" }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`flex-row items-center gap-1.5 rounded-full border px-4 py-2.5 active:opacity-80 ${
        selected ? "border-ink bg-ink" : "border-line bg-surface"
      } ${className}`}
    >
      {selected && !compact ? <Check size={13} color={color.canvas} strokeWidth={2.5} /> : null}
      <Text
        className={`text-body-sm font-medium ${selected ? "text-canvas" : "text-ink-soft"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
