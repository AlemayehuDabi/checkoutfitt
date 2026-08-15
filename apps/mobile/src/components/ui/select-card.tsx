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
 * The onboarding/generator selection card.
 *
 * Selected state follows the spec's Outfit Generator mockup: a primary-50 fill
 * behind a brand-coloured border, with a small filled check badge on the
 * trailing edge. The badge sits in a fixed-width slot so the row never reflows
 * as selection moves between cards.
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

  const iconWellStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [color.surfaceSecondary, color.primary100]
    ),
  }));

  return (
    <PressableScale
      onPress={onPress}
      pressScale={motion.pressScale.md}
      pressOpacity={1}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[selected ? elevation.md : elevation.sm, containerStyle]}
      className={`flex-row items-center gap-lg rounded-xl px-lg py-lg ${className}`}
    >
      {icon ? (
        <Animated.View
          style={iconWellStyle}
          className="h-11 w-11 items-center justify-center rounded-md"
        >
          {icon}
        </Animated.View>
      ) : null}

      <View className="flex-1">
        <Text
          className={`text-body font-semibold ${selected ? "text-primary-700" : "text-text-primary"}`}
        >
          {label}
        </Text>
        {description ? (
          <Text
            className={`mt-0.5 text-caption ${selected ? "text-primary-600" : "text-text-muted"}`}
          >
            {description}
          </Text>
        ) : null}
      </View>

      {right ?? (
        <View className="h-6 w-6 items-center justify-center">
          {selected ? (
            <Animated.View
              entering={FadeIn.duration(motion.duration.fast)}
              exiting={FadeOut.duration(motion.duration.fast)}
              className="h-6 w-6 items-center justify-center rounded-full bg-primary-500"
            >
              <Check size={13} color={color.textOnPrimary} strokeWidth={3} />
            </Animated.View>
          ) : null}
        </View>
      )}
    </PressableScale>
  );
}
