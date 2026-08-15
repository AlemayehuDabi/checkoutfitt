import { Check } from "lucide-react-native";
import { type ReactNode } from "react";
import { Text, View } from "react-native";

import { PressableScale } from "@/components/ui/pressable-scale";
import { color, elevation, motion } from "@/design";

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

/**
 * The selection tile behind the Outfit Generator and the style quiz.
 *
 * The mockups stack it: glyph centred over a centred label, sized to sit two to
 * a row. Selecting fills it with `primary-50` behind a brand border and drops a
 * filled check badge into the top-right corner — absolutely positioned, so
 * selection never reflows the grid.
 *
 * Fill and border are utility classes, not an interpolated animated style:
 * `PressableScale` resolves `className` and `style` onto the same prop, so an
 * animated `backgroundColor` loses to the class layer and the tile never reads
 * as selected.
 */
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
    <PressableScale
      onPress={onPress}
      pressScale={motion.pressScale.md}
      pressOpacity={0.9}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={selected ? elevation.md : elevation.sm}
      className={`items-center justify-center gap-sm rounded-md border px-md py-lg ${
        selected ? "border-[1.5px] border-primary-500 bg-primary-50" : "border-border bg-surface"
      } ${className}`}
    >
      {icon ? <View className="items-center justify-center">{icon}</View> : null}

      <Text
        className={`text-center text-body font-semibold ${
          selected ? "text-primary-700" : "text-text-primary"
        }`}
        numberOfLines={1}
      >
        {label}
      </Text>
      {description ? (
        <Text
          className={`text-center text-caption ${
            selected ? "text-primary-600" : "text-text-muted"
          }`}
        >
          {description}
        </Text>
      ) : null}

      {right ? <View className="mt-1">{right}</View> : null}

      {selected ? (
        <View className="absolute right-1.5 top-1.5 h-5 w-5 items-center justify-center rounded-full bg-primary-500">
          <Check size={12} color={color.textOnPrimary} strokeWidth={3} />
        </View>
      ) : null}
    </PressableScale>
  );
}
