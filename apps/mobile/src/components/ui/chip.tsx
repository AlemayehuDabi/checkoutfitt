import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import { PressableScale } from "@/components/ui/pressable-scale";
import { color, motion } from "@/design";

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Kept for API compatibility; selection now reads from the fill alone. */
  compact?: boolean;
  className?: string;
};

const TRANSITION = { duration: motion.duration.normal };

/**
 * Spec §6.3 selectable chip: 36px tall pill, 16px of horizontal padding.
 * Unselected is a bare hairline outline; selected fills with primary-50 behind
 * a 1.5px brand border and brand-coloured label.
 *
 * Selection animates rather than snapping. The old version toggled Tailwind
 * classes, so a chip changed state in a single frame and shifted layout as a
 * check icon appeared. Interpolating fill, border and label colour on the UI
 * thread keeps the row stable and makes filtering feel considered.
 *
 * The unselected fill is primary-50 at zero alpha rather than `transparent`
 * (which is rgba(0,0,0,0)) so the interpolation never passes through a muddy
 * translucent grey on its way to the tint.
 */
const FILL_EMPTY = "rgba(255, 245, 240, 0)";

export function Chip({ label, selected, onPress, className = "" }: ChipProps) {
  const progress = useDerivedValue(() => withTiming(selected ? 1 : 0, TRANSITION), [selected]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [FILL_EMPTY, color.primary50]),
    borderColor: interpolateColor(progress.value, [0, 1], [color.border, color.primary500]),
    borderWidth: interpolate(progress.value, [0, 1], [1, 1.5]),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [color.textPrimary, color.primary500]),
  }));

  return (
    <PressableScale
      onPress={onPress}
      pressScale={0.94}
      pressOpacity={1}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={containerStyle}
      className={`h-9 items-center justify-center rounded-full px-lg ${className}`}
    >
      <Animated.Text style={labelStyle} className="text-tag font-medium">
        {label}
      </Animated.Text>
    </PressableScale>
  );
}
