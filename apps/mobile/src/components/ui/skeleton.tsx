import { useEffect } from "react";
import { type DimensionValue } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  /** Staggers the pulse so stacked placeholders breathe as a group. */
  delay?: number;
  className?: string;
};

/**
 * Loading placeholder.
 *
 * Runs on Reanimated rather than the legacy Animated API so the pulse keeps
 * time on the UI thread — a skeleton that stutters while the JS thread is busy
 * doing the very work it's covering for defeats the point.
 */
export function Skeleton({ width = "100%", height = 16, delay = 0, className = "" }: SkeletonProps) {
  const progress = useSharedValue(0.45);

  useEffect(() => {
    const start = setTimeout(() => {
      progress.value = withRepeat(
        withTiming(1, { duration: 780, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      );
    }, delay);
    return () => clearTimeout(start);
  }, [progress, delay]);

  const style = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <Animated.View
      style={[{ width, height }, style]}
      className={`rounded-xl bg-surface-muted ${className}`}
    />
  );
}
