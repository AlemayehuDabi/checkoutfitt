/**
 * CheckoutFitt design tokens — the single source of truth.
 *
 * This file is CommonJS on purpose: `tailwind.config.js` requires it directly,
 * `scripts/generate-tokens.mjs` reads it to emit the `:root` custom properties
 * in `src/global.css`, and runtime code imports it through `src/design/index.ts`.
 * Nothing else in the app should ever declare a raw hex, font size, or radius.
 *
 * After editing this file run `npm run tokens` to regenerate global.css.
 *
 * ── Design language: "Editorial Atelier" ──────────────────────────────────
 * Warm paper canvas, pure-white cards, hairline rules, and a paprika accent.
 * Neutrals are warm (ochre-tinted) rather than true grey so the whole surface
 * reads like magazine stock instead of a dashboard.
 */

/** Brand anchor: paprika / burnt orange — hsl(14, 72%, 44%). */
const palette = {
  // ── Brand ────────────────────────────────────────────────────────────────
  primary: {
    50: "#FDF3EF",
    100: "#FAE2D8",
    200: "#F4C3B0",
    300: "#EA9D80",
    400: "#DC7451",
    500: "#CE5730",
    DEFAULT: "#C0451F",
    600: "#C0451F",
    700: "#9E3517",
    800: "#7B2A14",
    900: "#5C2211",
    950: "#331005",
  },

  // ── Text ─────────────────────────────────────────────────────────────────
  /** Primary text + inverse surfaces. Warm near-black, never pure #000. */
  ink: {
    DEFAULT: "#17130F",
    soft: "#3B322B",
  },
  /** Secondary / supporting text. */
  muted: "#857A70",
  /** Tertiary text on inverse surfaces. */
  faint: "#A79C91",

  // ── Surfaces ─────────────────────────────────────────────────────────────
  /** Page background — warm paper. */
  canvas: "#FAF7F2",
  /** Cards and raised surfaces. */
  surface: {
    DEFAULT: "#FFFFFF",
    sunken: "#F2ECE3",
    muted: "#E9E1D6",
    inverse: "#17130F",
  },

  // ── Lines ────────────────────────────────────────────────────────────────
  line: {
    DEFAULT: "#E6DED4",
    strong: "#D4C8BA",
  },

  // ── Semantic ─────────────────────────────────────────────────────────────
  /** Deep forest. Reads as "good" without going neon. */
  success: {
    DEFAULT: "#2F6B4F",
    soft: "#E4EFE8",
  },
  /** Ochre. Distinct from the primary paprika at a glance. */
  warning: {
    DEFAULT: "#9A6B1F",
    soft: "#F6EBD8",
  },
  /** Crimson wine — deliberately cooler than `primary` so destructive actions
   *  never get confused with brand actions. */
  danger: {
    DEFAULT: "#A4243B",
    soft: "#F7E3E6",
  },
  info: {
    DEFAULT: "#2C5470",
    soft: "#E2EBF1",
  },

  white: "#FFFFFF",
};

/**
 * Type scale. Numeric Tailwind names are retuned to this editorial ramp so
 * `text-base` and friends stay meaningful, and semantic aliases
 * (`text-display`, `text-h1`, `text-micro`…) map onto the same values.
 */
const typography = {
  micro: { size: 11, lineHeight: 14, tracking: 0.8 },
  caption: { size: 13, lineHeight: 18, tracking: 0 },
  bodySm: { size: 14, lineHeight: 20, tracking: 0 },
  body: { size: 15, lineHeight: 22, tracking: 0 },
  bodyLg: { size: 17, lineHeight: 25, tracking: -0.1 },
  h3: { size: 20, lineHeight: 25, tracking: -0.3 },
  h2: { size: 24, lineHeight: 28, tracking: -0.5 },
  h1: { size: 30, lineHeight: 34, tracking: -0.8 },
  display: { size: 40, lineHeight: 42, tracking: -1.2 },
  displayLg: { size: 52, lineHeight: 52, tracking: -1.8 },
};

const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

/** Border radius. Cards sit at `2xl`; hero/editorial surfaces at `3xl`. */
const radius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 18,
  "2xl": 22,
  "3xl": 30,
  "4xl": 38,
  full: 9999,
};

/**
 * Spacing. Extends the default 4px rhythm with named layout tokens so screen
 * gutters and section rhythm are declared once rather than per-screen.
 */
const spacing = {
  gutter: 24,
  section: 32,
  block: 20,
};

/**
 * Elevation. React Native needs real style objects rather than CSS shadows, so
 * these are consumed through `src/design/elevation.ts`. Values are also emitted
 * as custom properties for documentation parity.
 *
 * The original ramp topped out around 0.04–0.06 opacity, which on a warm paper
 * canvas was indistinguishable from a hairline border — every surface read as
 * flat. These are tuned so each step is a visibly distinct plane, and `android`
 * carries the native elevation that Android composites separately from the
 * iOS shadow parameters.
 */
const shadow = {
  none: { y: 0, blur: 0, opacity: 0, android: 0 },
  /** Resting cards, list rows. Just enough to lift off the canvas. */
  sm: { y: 2, blur: 8, opacity: 0.07, android: 2 },
  /** Standard interactive cards. The workhorse. */
  md: { y: 6, blur: 18, opacity: 0.1, android: 5 },
  /** Hero cards, primary buttons, floating actions. */
  lg: { y: 14, blur: 32, opacity: 0.14, android: 10 },
  /** Sheets and modals. */
  xl: { y: 24, blur: 56, opacity: 0.2, android: 20 },
};

/**
 * Brand-tinted glow for primary actions. A paprika button casting a neutral ink
 * shadow looks dirty; casting its own hue makes it look lit.
 */
const glow = {
  primary: { y: 8, blur: 20, opacity: 0.32, android: 6 },
};

/** Shadows are cast in warm ink, not neutral black. */
const shadowColor = palette.ink.DEFAULT;

/** `#C0451F` → `192 69 31` (the channel form NativeWind needs for `bg-x/50`). */
function hexToChannels(hex) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/**
 * Flattens the nested palette into CSS-variable names.
 * `primary.600` → `--color-primary-600`, `ink.DEFAULT` → `--color-ink`.
 */
function flattenPalette(source = palette, prefix = "") {
  const out = {};
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "string") {
      const name = key === "DEFAULT" ? prefix : prefix ? `${prefix}-${key}` : key;
      out[name] = value;
    } else {
      Object.assign(out, flattenPalette(value, prefix ? `${prefix}-${key}` : key));
    }
  }
  return out;
}

module.exports = {
  palette,
  typography,
  fontWeight,
  radius,
  spacing,
  shadow,
  glow,
  shadowColor,
  hexToChannels,
  flattenPalette,
};
