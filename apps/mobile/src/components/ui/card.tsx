import { type ReactNode } from "react";
import { View } from "react-native";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { PressableScale } from "@/components/ui/pressable-scale";
import { elevation, motion, shadowColor, shadowStep } from "@/design";

type CardTone = "surface" | "sunken" | "inverse" | "primary" | "outline";
type CardElevation = "none" | "sm" | "md" | "lg";

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  /** `hero` pushes the card onto the prominent elevation step. */
  hero?: boolean;
  tone?: CardTone;
  /** Defaults per tone; pass explicitly to push a card forward or flatten it. */
  raise?: CardElevation;
  className?: string;
};

/**
 * Spec §6.2. A standard content card is white, carries a 1px hairline *and* a
 * soft shadow, and rounds at 20px. The tinted and inset tones are the spec's
 * "flat card" — no border, no shadow — so they read as recessed into whatever
 * they sit inside rather than floating above it.
 */
const tones: Record<CardTone, string> = {
  surface: "border border-border bg-surface",
  sunken: "bg-surface-secondary",
  inverse: "bg-surface-inverse",
  primary: "bg-primary-50",
  outline: "border border-border bg-surface",
};

/** Inset and tinted surfaces read as recessed, so they get no lift. */
const defaultRaise: Record<CardTone, CardElevation> = {
  surface: "md",
  sunken: "none",
  inverse: "md",
  primary: "none",
  outline: "none",
};

/** Flat cards round tighter (12px) than raised ones (20px) — spec §6.2. */
const roundness: Record<CardTone, string> = {
  surface: "rounded-xl",
  sunken: "rounded-md",
  inverse: "rounded-xl",
  primary: "rounded-md",
  outline: "rounded-xl",
};

/** One step up the ramp, so a press lifts the card rather than just shrinking it. */
const liftTarget: Record<CardElevation, CardElevation> = {
  none: "none",
  sm: "md",
  md: "lg",
  lg: "lg",
};

export function Card({
  children,
  onPress,
  hero = false,
  tone = "surface",
  raise,
  className = "",
}: CardProps) {
  const resting = raise ?? (hero ? "lg" : defaultRaise[tone]);
  const classes = `${roundness[tone]} ${tones[tone]} ${className}`;

  // 0 at rest, 1 while held — interpolates the shadow between two steps of the
  // elevation ramp on the UI thread, so the lift lands with the compression
  // rather than a frame or two behind it.
  const pressed = useSharedValue(0);

  const from = shadowStep[resting];
  const to = shadowStep[liftTarget[resting]];

  const shadowStyle = useAnimatedStyle(() => {
    if (resting === "none") return {};
    return {
      shadowColor,
      shadowOffset: { width: 0, height: interpolate(pressed.value, [0, 1], [from.y, to.y]) },
      shadowOpacity: interpolate(pressed.value, [0, 1], [from.opacity, to.opacity]),
      shadowRadius: interpolate(pressed.value, [0, 1], [from.blur, to.blur]),
      elevation: interpolate(pressed.value, [0, 1], [from.android, to.android]),
    };
  });

  if (onPress) {
    return (
      // Cards are large, so they take a gentler compression than a button —
      // enough to feel tactile without looking like the whole screen moved.
      <PressableScale
        onPress={onPress}
        pressScale={motion.pressScale.md}
        pressOpacity={1}
        onPressIn={() => {
          pressed.value = withTiming(1, { duration: motion.duration.normal });
        }}
        onPressOut={() => {
          pressed.value = withTiming(0, { duration: motion.duration.normal });
        }}
        style={shadowStyle}
        className={classes}
      >
        {children}
      </PressableScale>
    );
  }

  return (
    <View style={resting === "none" ? undefined : elevation[resting]} className={classes}>
      {children}
    </View>
  );
}
