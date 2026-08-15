import { Check } from "lucide-react-native";
import { type ReactNode } from "react";
import { Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

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

const TRANSITION = { duration: motion.duration.normal };

/**
 * The selection tile behind the Outfit Generator and the style quiz.
 *
 * The mockups stack it: glyph centred over a centred label, sized to sit two
 * to a row. Selecting fills it with `primary-50` behind a 1.5px brand border
 * and drops a small filled check badge into the top-right corner — the badge is
 * absolutely positioned so selection never reflows the grid.
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
  const progress = useDerivedValue(() => withTiming(selected ? 1 : 0, TRANSITION), [selected]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [color.surface, color.primary50]),
    borderColor: interpolateColor(progress.value, [0, 1], [color.border, color.primary500]),
    borderWidth: interpolate(progress.value, [0, 1], [1, 1.5]),
  }));

  return (
    <PressableScale
      onPress={onPress}
      pressScale={motion.pressScale.md}
      pressOpacity={1}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[selected ? elevation.md : elevation.sm, containerStyle]}
      className={`items-center justify-center gap-sm rounded-md px-md py-lg ${className}`}
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
        <Animated.View
          entering={FadeIn.duration(motion.duration.fast)}
          exiting={FadeOut.duration(motion.duration.fast)}
          className="absolute right-1.5 top-1.5 h-5 w-5 items-center justify-center rounded-full bg-primary-500"
        >
          <Check size={12} color={color.textOnPrimary} strokeWidth={3} />
        </Animated.View>
      ) : null}
    </PressableScale>
  );
}
