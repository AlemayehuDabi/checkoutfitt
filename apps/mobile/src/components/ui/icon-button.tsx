import { type ReactNode } from "react";
import { Pressable } from "react-native";

type IconButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  variant?: "ghost" | "solid" | "sunken" | "inverse";
  accessibilityLabel?: string;
  className?: string;
};

const surfaces = {
  ghost: "active:bg-surface-sunken",
  solid: "bg-surface border border-line",
  sunken: "bg-surface-sunken",
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
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={`h-10 w-10 items-center justify-center rounded-full active:opacity-70 ${surfaces[variant]} ${className}`}
    >
      {children}
    </Pressable>
  );
}
