import { type ReactNode } from "react";
import { View } from "react-native";

import { PressableScale } from "@/components/ui/pressable-scale";
import { elevation } from "@/design";

type CardTone = "surface" | "sunken" | "inverse" | "primary" | "outline";
type CardElevation = "none" | "sm" | "md" | "lg";

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  /** `hero` uses the larger editorial radius. */
  hero?: boolean;
  tone?: CardTone;
  /** Defaults per tone; pass explicitly to push a card forward or flatten it. */
  raise?: CardElevation;
  className?: string;
};

/**
 * Depth comes from *either* a shadow or a hairline, never both — a bordered box
 * that also casts a shadow is the single most reliable way to make a UI look
 * cheap. Raised tones therefore drop the border entirely and let the shadow
 * describe the edge; `sunken` and `outline` stay flat by design.
 */
const tones: Record<CardTone, string> = {
  surface: "bg-surface",
  sunken: "bg-surface-sunken",
  inverse: "bg-surface-inverse",
  primary: "bg-primary-50",
  outline: "border border-line bg-surface",
};

/** Inset and outlined surfaces read as recessed, so they get no lift. */
const defaultRaise: Record<CardTone, CardElevation> = {
  surface: "sm",
  sunken: "none",
  inverse: "md",
  primary: "none",
  outline: "none",
};

export function Card({
  children,
  onPress,
  hero = false,
  tone = "surface",
  raise,
  className = "",
}: CardProps) {
  const level = raise ?? defaultRaise[tone];
  const classes = `${hero ? "rounded-3xl" : "rounded-2xl"} ${tones[tone]} ${className}`;
  const style = level === "none" ? undefined : elevation[level];

  if (onPress) {
    return (
      // Cards are large, so they take a gentler compression than a button —
      // enough to feel tactile without looking like the whole screen moved.
      <PressableScale onPress={onPress} pressScale={0.985} style={style} className={classes}>
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
