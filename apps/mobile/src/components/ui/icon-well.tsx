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
  xs: "h-7 w-7 rounded-sm",
  sm: "h-9 w-9 rounded-md",
  md: "h-10 w-10 rounded-md",
  lg: "h-14 w-14 rounded-lg",
  xl: "h-16 w-16 rounded-xl",
  "2xl": "h-20 w-20 rounded-2xl",
};

const tones: Record<IconWellTone, string> = {
  primary: "bg-primary-100",
  sunken: "bg-surface-secondary",
  surface: "bg-surface",
  ink: "bg-ink",
  translucent: "bg-white/15",
  scrim: "bg-black/45",
  success: "bg-success-light",
  warning: "bg-warning-light",
  danger: "bg-danger-light",
  info: "bg-info-light",
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
