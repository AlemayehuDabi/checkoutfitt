import { type ReactNode } from "react";
import { View } from "react-native";

import { PressableScale } from "@/components/ui/pressable-scale";
import { elevation } from "@/design";

type CardTone = "surface" | "sunken" | "inverse" | "primary";
type CardElevation = "none" | "sm" | "md" | "lg";

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  /** `hero` uses the larger editorial radius. */
  hero?: boolean;
  tone?: CardTone;
  raise?: CardElevation;
  className?: string;
};

const tones: Record<CardTone, string> = {
  surface: "bg-surface border border-line",
  sunken: "bg-surface-sunken border border-transparent",
  inverse: "bg-surface-inverse border border-transparent",
  primary: "bg-primary-50 border border-primary-100",
};

export function Card({
  children,
  onPress,
  hero = false,
  tone = "surface",
  raise = "none",
  className = "",
}: CardProps) {
  const classes = `${hero ? "rounded-3xl" : "rounded-2xl"} ${tones[tone]} ${className}`;
  const style = raise === "none" ? undefined : elevation[raise];

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
