import { cssInterop } from "nativewind";
import { forwardRef } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type View,
  type ViewStyle,
} from "react-native";
import Animated, {
  type AnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { motion } from "@/design";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
cssInterop(AnimatedPressable, { className: "style" });

type PressableScaleProps = Omit<PressableProps, "style"> & {
  /** Widened so callers can hand in Reanimated styles (e.g. animated fills). */
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  className?: string;
  /** How far it compresses on press. Larger surfaces want a subtler value. */
  pressScale?: number;
  /** Dim alongside the scale. `1` disables it. */
  pressOpacity?: number;
  /** Opts out of the animation (e.g. rows inside an already-animated parent). */
  disableAnimation?: boolean;
};

/**
 * The app's standard tactile press surface.
 *
 * NativeWind's `active:` variants are driven by React state, so the visual
 * response to a touch waits on a JS render — which is exactly when the JS thread
 * is busiest (list rendering, navigation). Driving scale/opacity through
 * Reanimated keeps the feedback on the UI thread, so a press reads as instant
 * even while JS is under load.
 */
export const PressableScale = forwardRef<View, PressableScaleProps>(function PressableScale(
  {
    className = "",
    pressScale = 0.97,
    pressOpacity = 0.9,
    disableAnimation = false,
    disabled,
    onPressIn,
    onPressOut,
    children,
    style,
    ...rest
  },
  ref
) {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 - progress.value * (1 - pressScale) },
    ],
    opacity: 1 - progress.value * (1 - pressOpacity),
  }));

  const isInert = disabled || disableAnimation;

  return (
    <AnimatedPressable
      ref={ref}
      disabled={disabled}
      className={className}
      // Caller styles (e.g. Card's elevation) are merged rather than replaced —
      // spreading `rest` over a `style` prop would silently drop the animation.
      style={isInert ? style : [style, animatedStyle]}
      onPressIn={(event) => {
        // Snappy on the way down so the surface reacts with the finger…
        if (!isInert)
          progress.value = withTiming(1, { duration: motion.duration.fast });
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        // …and springy on release, which is what makes it feel physical.
        if (!isInert) progress.value = withSpring(0, { damping: 18, stiffness: 260, mass: 0.5 });
        onPressOut?.(event);
      }}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
});
