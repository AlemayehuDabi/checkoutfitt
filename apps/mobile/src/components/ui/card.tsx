import { type ReactNode } from "react";
import { View } from "react-native";

import { PressableScale } from "@/components/ui/pressable-scale";
import { elevation, motion } from "@/design";

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
  // A plain style object, not an animated one: `PressableScale` resolves
  // `className` and `style` onto the same prop, and a shadow that only exists
  // inside a `useAnimatedStyle` gets dropped — which left every tappable card
  // completely flat. The press response is the scale.
  const style = resting === "none" ? undefined : elevation[resting];

  if (onPress) {
    return (
      // Cards are large, so they take a gentler compression than a button —
      // enough to feel tactile without looking like the whole screen moved.
      <PressableScale
        onPress={onPress}
        pressScale={motion.pressScale.md}
        pressOpacity={0.95}
        style={style}
        className={classes}
      >
        {children}
      </PressableScale>
    );
  }

  return (
    <View style={style} className={classes}>
      {children}
    </View>
  );
}
