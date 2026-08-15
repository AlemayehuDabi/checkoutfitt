import { type ReactNode } from "react";
import { PressableScale } from "@/components/ui/pressable-scale";
import { elevation, motion } from "@/design";

type FabProps = {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  className?: string;
};

/**
 * Spec §6.11 floating action button: a 56px terracotta circle sitting 20px in
 * from the bottom-right, above the tab bar, taking the deepest compression in
 * the system (0.92) on press.
 */
export function Fab({ children, onPress, accessibilityLabel, className = "" }: FabProps) {
  return (
    <PressableScale
      onPress={onPress}
      pressScale={motion.pressScale.lg}
      pressOpacity={0.95}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={elevation.lg}
      className={`absolute bottom-xl right-xl h-14 w-14 items-center justify-center rounded-full bg-primary-500 ${className}`}
    >
      {children}
    </PressableScale>
  );
}
