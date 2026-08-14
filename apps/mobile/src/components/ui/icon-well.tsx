import { type ReactNode } from "react";
import { View } from "react-native";

export type IconWellSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type IconWellTone =
  | "primary"
  | "sunken"
  | "surface"
  | "ink"
  | "translucent"
  | "scrim"
  | "success"
  | "warning"
  | "danger"
  | "info";

type IconWellProps = {
  children: ReactNode;
  size?: IconWellSize;
  tone?: IconWellTone;
  /** Circles are for avatars, toggles and scrims; everything else is a squircle. */
  round?: boolean;
  className?: string;
};

/**
 * The tinted tile an icon sits in.
 *
 * These were hand-rolled ~50 times across the app with about twenty different
 * size/radius/background permutations, which is why icons read as inconsistently
 * placed. Corner radius scales with the box here, so a small well doesn't look
 * like a shrunken large one — that relationship is most of what makes icon
 * treatment feel deliberate.
 */
const boxes: Record<IconWellSize, string> = {
  xs: "h-7 w-7 rounded-lg",
  sm: "h-9 w-9 rounded-xl",
  md: "h-11 w-11 rounded-2xl",
  lg: "h-14 w-14 rounded-2xl",
  xl: "h-16 w-16 rounded-3xl",
  "2xl": "h-20 w-20 rounded-4xl",
};

const tones: Record<IconWellTone, string> = {
  primary: "bg-primary-50",
  sunken: "bg-surface-sunken",
  surface: "bg-surface",
  ink: "bg-ink",
  translucent: "bg-white/15",
  scrim: "bg-black/45",
  success: "bg-success-soft",
  warning: "bg-warning-soft",
  danger: "bg-danger-soft",
  info: "bg-info-soft",
};

/** Icon glyph sizes paired to each well, so the optical weight stays even. */
export const ICON_SIZE: Record<IconWellSize, number> = {
  xs: 13,
  sm: 16,
  md: 19,
  lg: 22,
  xl: 26,
  "2xl": 30,
};

export function IconWell({
  children,
  size = "md",
  tone = "primary",
  round = false,
  className = "",
}: IconWellProps) {
  return (
    <View
      className={`items-center justify-center ${boxes[size]} ${
        round ? "rounded-full" : ""
      } ${tones[tone]} ${className}`}
    >
      {children}
    </View>
  );
}
