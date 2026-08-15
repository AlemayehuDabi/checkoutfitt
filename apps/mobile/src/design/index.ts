/**
 * Runtime access to the design tokens.
 *
 * Use this wherever a value can't be expressed as a NativeWind class — most
 * commonly `lucide-react-native` icon `color` props, which need a literal hex,
 * and React Native shadow styles.
 *
 * Values come from `src/design/tokens.js` — the same literals that feed
 * `tailwind.config.js` — so a colour used here and the matching utility class
 * can never disagree. Nothing in this module resolves through a CSS custom
 * property; `var()` references do not survive NativeWind's native compile.
 */
import {
  glow,
  motion as motionTokens,
  overlay as overlayTokens,
  palette,
  radius as radiusTokens,
  shadow,
  shadowColor,
  spacing as spacingTokens,
  typography,
} from "./tokens";

/**
 * Literal hex values, for props that can't take a class name.
 *
 * Both spellings of every semantic slot are exported: the canonical names the
 * app has always used (`ink`, `canvas`, `line`) and the design spec's role
 * names (`textPrimary`, `bg`, `border`). They are the same values — see the
 * `colorAliases` map in `tokens.js`.
 */
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

  // ── Spec role names ──────────────────────────────────────────────────────
  bg: palette.canvas,
  surfaceSecondary: palette.surface.sunken,
  surfaceTertiary: palette.surface.muted,
  border: palette.line.DEFAULT,
  borderStrong: palette.line.strong,
  textPrimary: palette.ink.DEFAULT,
  textSecondary: palette.ink.soft,
  textMuted: palette.muted,
  textOnPrimary: palette.white,
  textAccent: palette.primary[500],
  successLight: palette.success.soft,
  warningLight: palette.warning.soft,
  dangerLight: palette.danger.soft,
  infoLight: palette.info.soft,

  overlay: overlayTokens.DEFAULT,
  overlayLight: overlayTokens.light,
} as const;

/**
 * Elevation as React Native style objects. Shadows are cast in warm ink rather
 * than neutral black so they sit correctly on the sand canvas.
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
  /** Terracotta-tinted lift for primary actions. */
  primary: toShadow(glow.primary, palette.primary.DEFAULT),
} as const;

/** Raw shadow steps, for animating between two levels on the UI thread. */
export { shadow as shadowStep, shadowColor };

/** Press durations and compression ratios (spec §7). */
export const motion = motionTokens;

export {
  radiusTokens as radius,
  spacingTokens as spacing,
  typography,
  overlayTokens as overlay,
};
export type AppColor = keyof typeof color;
