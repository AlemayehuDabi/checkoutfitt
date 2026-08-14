import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import { PressableScale } from "@/components/ui/pressable-scale";
import { color } from "@/design";

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Kept for API compatibility; selection now reads from the fill alone. */
  compact?: boolean;
  className?: string;
};

const TRANSITION = { duration: 190 };

/**
 * Selection animates rather than snapping.
 *
 * The old version toggled Tailwind classes, so a chip changed state in a single
 * frame and also shifted layout as a check icon appeared. Interpolating fill,
 * border and label colour on the UI thread keeps the row stable and makes
 * filtering feel considered instead of abrupt.
 */
export function Chip({ label, selected, onPress, className = "" }: ChipProps) {
  const progress = useDerivedValue(() => withTiming(selected ? 1 : 0, TRANSITION), [selected]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [color.surface, color.ink]),
    borderColor: interpolateColor(progress.value, [0, 1], [color.line, color.ink]),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [color.inkSoft, color.canvas]),
  }));

  return (
    <PressableScale
      onPress={onPress}
      pressScale={0.94}
      pressOpacity={1}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={containerStyle}
      className={`rounded-full border px-4 py-2.5 ${className}`}
    >
      <Animated.Text style={labelStyle} className="text-body-sm font-semibold">
        {label}
      </Animated.Text>
    </PressableScale>
  );
}
