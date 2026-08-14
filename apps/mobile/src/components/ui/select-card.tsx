import { Check } from "lucide-react-native";
import { type ReactNode } from "react";
import { Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import { PressableScale } from "@/components/ui/pressable-scale";
import { color, elevation } from "@/design";

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

const TRANSITION = { duration: 200 };

/**
 * The onboarding/generator selection row. Selecting animates the fill and lifts
 * the card, and a check mark fades in on the trailing edge — a fixed-width slot
 * so the row never reflows.
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
    backgroundColor: interpolateColor(progress.value, [0, 1], [color.surface, color.ink]),
  }));

  const iconWellStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [color.surfaceSunken, "rgba(255,255,255,0.14)"]
    ),
  }));

  return (
    <PressableScale
      onPress={onPress}
      pressScale={0.985}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[selected ? elevation.md : elevation.sm, containerStyle]}
      className={`flex-row items-center gap-4 rounded-2xl px-4 py-4 ${className}`}
    >
      {icon ? (
        <Animated.View
          style={iconWellStyle}
          className="h-11 w-11 items-center justify-center rounded-2xl"
        >
          {icon}
        </Animated.View>
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

      {right ?? (
        <View className="h-6 w-6 items-center justify-center">
          {selected ? (
            <Animated.View
              entering={FadeIn.duration(180)}
              exiting={FadeOut.duration(120)}
              className="h-6 w-6 items-center justify-center rounded-full bg-primary"
            >
              <Check size={13} color={color.white} strokeWidth={3} />
            </Animated.View>
          ) : null}
        </View>
      )}
    </PressableScale>
  );
}
