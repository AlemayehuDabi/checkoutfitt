/**
 * Runtime access to the design tokens.
 *
 * Use this wherever a value can't be expressed as a NativeWind class — most
 * commonly `lucide-react-native` icon `color` props, which need a literal hex,
 * and React Native shadow styles.
 *
 * Values come from `src/design/tokens.js`, the same source that generates the
 * CSS custom properties in `global.css` and feeds `tailwind.config.js`.
 */
import {
  glow,
  palette,
  radius as radiusTokens,
  shadow,
  shadowColor,
  spacing as spacingTokens,
  typography,
} from "./tokens";

/** Literal hex values, for props that can't take a class name. */
export const color = {
  primary: palette.primary.DEFAULT,
  primary50: palette.primary[50],
  primary100: palette.primary[100],
  primary200: palette.primary[200],
  primary300: palette.primary[300],
  primary400: palette.primary[400],
  primary500: palette.primary[500],
  primary600: palette.primary[600],
  primary700: palette.primary[700],
  primary800: palette.primary[800],
  primary900: palette.primary[900],

  ink: palette.ink.DEFAULT,
  inkSoft: palette.ink.soft,
  muted: palette.muted,
  faint: palette.faint,

  canvas: palette.canvas,
  surface: palette.surface.DEFAULT,
  surfaceSunken: palette.surface.sunken,
  surfaceMuted: palette.surface.muted,
  surfaceInverse: palette.surface.inverse,

  line: palette.line.DEFAULT,
  lineStrong: palette.line.strong,

  success: palette.success.DEFAULT,
  successSoft: palette.success.soft,
  warning: palette.warning.DEFAULT,
  warningSoft: palette.warning.soft,
  danger: palette.danger.DEFAULT,
  dangerSoft: palette.danger.soft,
  info: palette.info.DEFAULT,
  infoSoft: palette.info.soft,

  white: palette.white,
} as const;

/**
 * Elevation as React Native style objects. Shadows are cast in warm ink rather
 * than neutral black so they sit correctly on the paper canvas.
 */
function toShadow(
  step: { y: number; blur: number; opacity: number; android: number },
  tint: string = shadowColor
) {
  return {
    shadowColor: tint,
    shadowOffset: { width: 0, height: step.y },
    shadowOpacity: step.opacity,
    shadowRadius: step.blur,
    elevation: step.android,
  } as const;
}

export const elevation = {
  none: toShadow(shadow.none),
  sm: toShadow(shadow.sm),
  md: toShadow(shadow.md),
  lg: toShadow(shadow.lg),
  xl: toShadow(shadow.xl),
  /** Paprika-tinted lift for primary actions. */
  primary: toShadow(glow.primary, palette.primary.DEFAULT),
} as const;

export { radiusTokens as radius, spacingTokens as spacing, typography };
export type AppColor = keyof typeof color;
