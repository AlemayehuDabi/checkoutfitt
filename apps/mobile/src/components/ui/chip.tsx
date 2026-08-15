import { Text } from "react-native";

import { PressableScale } from "@/components/ui/pressable-scale";

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Kept for API compatibility; selection now reads from the fill alone. */
  compact?: boolean;
  className?: string;
};

/**
 * Spec §6.3 selectable chip: 36px tall pill, 16px of horizontal padding.
 *
 * The closet filter row in the mockups fills the active chip *solid* terracotta
 * with a white label; unselected stays a hairline outline on white.
 *
 * The fill is a plain utility class rather than an interpolated animated style.
 * `PressableScale` resolves both `className` and `style` onto `style`, so an
 * animated `backgroundColor` gets overwritten by the class layer and the chip
 * never actually looks selected. Press feedback comes from the scale instead.
 */
export function Chip({ label, selected, onPress, className = "" }: ChipProps) {
  return (
    <PressableScale
      onPress={onPress}
      pressScale={0.94}
      pressOpacity={0.85}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`h-9 items-center justify-center rounded-full border px-lg ${
        selected ? "border-primary-500 bg-primary-500" : "border-border bg-surface"
      } ${className}`}
    >
      <Text
        className={`text-tag font-medium ${
          selected ? "text-text-on-primary" : "text-text-secondary"
        }`}
      >
        {label}
      </Text>
    </PressableScale>
  );
}
