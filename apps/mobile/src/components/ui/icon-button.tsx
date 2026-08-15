import { type ReactNode } from "react";

import { PressableScale } from "@/components/ui/pressable-scale";

type IconButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  variant?: "ghost" | "solid" | "sunken" | "inverse";
  accessibilityLabel?: string;
  className?: string;
};

const surfaces = {
  ghost: "",
  solid: "bg-surface",
  sunken: "bg-surface-secondary",
  inverse: "bg-white/15",
} as const;

export function IconButton({
  children,
  onPress,
  variant = "ghost",
  accessibilityLabel,
  className = "",
}: IconButtonProps) {
  return (
    <PressableScale
      onPress={onPress}
      hitSlop={10}
      // Small targets need a deeper compression than cards to register as pressed.
      pressScale={0.88}
      pressOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={`h-10 w-10 items-center justify-center rounded-full ${surfaces[variant]} ${className}`}
    >
      {children}
    </PressableScale>
  );
}
