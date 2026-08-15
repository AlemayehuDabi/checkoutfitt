import { type ReactNode } from "react";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { PressableScale } from "@/components/ui/pressable-scale";
import { motion, shadowColor, shadowStep } from "@/design";

type FabProps = {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  className?: string;
};

/**
 * Spec §6.11 floating action button: a 56px terracotta circle sitting 20px in
 * from the bottom-right, above the tab bar. It takes the deepest compression in
 * the system (0.92) and pushes from `shadow-lg` to `shadow-xl` as it does, so
 * the button reads as being pressed *into* the page.
 */
export function Fab({ children, onPress, accessibilityLabel, className = "" }: FabProps) {
  const pressed = useSharedValue(0);

  const from = shadowStep.lg;
  const to = shadowStep.xl;

  const shadowStyle = useAnimatedStyle(() => ({
    shadowColor,
    shadowOffset: { width: 0, height: interpolate(pressed.value, [0, 1], [from.y, to.y]) },
    shadowOpacity: interpolate(pressed.value, [0, 1], [from.opacity, to.opacity]),
    shadowRadius: interpolate(pressed.value, [0, 1], [from.blur, to.blur]),
    elevation: interpolate(pressed.value, [0, 1], [from.android, to.android]),
  }));

  return (
    <PressableScale
      onPress={onPress}
      pressScale={motion.pressScale.lg}
      pressOpacity={1}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: motion.duration.fast });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: motion.duration.normal });
      }}
      style={shadowStyle}
      className={`absolute bottom-xl right-xl h-14 w-14 items-center justify-center rounded-full bg-primary-500 ${className}`}
    >
      {children}
    </PressableScale>
  );
}
