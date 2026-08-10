import { useEffect, useRef } from "react";
import { Animated, type DimensionValue } from "react-native";

type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  className?: string;
};

export function Skeleton({ width = "100%", height = 16, className = "" }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ width, height, opacity }}
      className={`rounded-xl bg-sand-200 ${className}`}
    />
  );
}
