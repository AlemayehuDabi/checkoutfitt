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
 * ── Design language ───────────────────────────────────────────────────────
 * Values here are transcribed from `docs/design-system.md`, which was extracted
 * from the 27 finalized mockups. Warm sand canvas, pure-white cards, hairline
 * rules, and a burnt-orange / terracotta accent.
 *
 * Two naming schemes coexist deliberately:
 *   • the *canonical* names below (`canvas`, `ink`, `line`, `surface.sunken`)
 *     are what Tailwind utilities are built from, and
 *   • the *spec* names (`bg`, `text-primary`, `border`, `surface-secondary`)
 *     from the design document, emitted as aliases in `global.css` by
 *     `colorAliases` so every token in the spec is present verbatim.
 * Both resolve to the same value — see `colorAliases`.
 */

/** Brand anchor: burnt orange / terracotta. `500` is the brand colour. */
const palette = {
  // ── Brand ────────────────────────────────────────────────────────────────
  primary: {
    50: "#FFF5F0",
    100: "#FBEEE6",
    200: "#F6DBC7",
    300: "#E8A878",
    400: "#D4783C",
    500: "#C1622D",
    /** `bg-primary` / `text-primary` resolve here — the brand colour is 500. */
    DEFAULT: "#C1622D",
    600: "#A64F21",
    700: "#8A4119",
    800: "#6E3414",
    900: "#52270F",
    950: "#2E1608",
  },

  // ── Text ─────────────────────────────────────────────────────────────────
  /** `--color-text-primary`. Deep warm charcoal, never pure black. */
  ink: {
    DEFAULT: "#1A1917",
    /** `--color-text-secondary`. */
    soft: "#3A3835",
  },
  /** `--color-text-muted` — placeholders, timestamps, inactive tab labels. */
  muted: "#8A8580",
  /** Quietest step. Chevrons, metadata on inverse surfaces. */
  faint: "#A8A39D",

  // ── Surfaces ─────────────────────────────────────────────────────────────
  /** `--color-bg`. Every screen sits on this warm off-white. */
  canvas: "#FAF8F5",
  surface: {
    DEFAULT: "#FFFFFF",
    /** `--color-surface-secondary` — weather strip, tags, grouped sections. */
    sunken: "#F5F1EA",
    /** `--color-surface-tertiary` — skeletons, disabled surfaces. */
    muted: "#EDE7DD",
    inverse: "#1A1917",
  },

  // ── Lines ────────────────────────────────────────────────────────────────
  line: {
    /** `--color-border`. */
    DEFAULT: "#E7E2D9",
    /** `--color-border-strong` — sheet drag handle, focused input before focus. */
    strong: "#D5CFC5",
  },

  // ── Semantic ─────────────────────────────────────────────────────────────
  success: {
    DEFAULT: "#4A9E6B",
    soft: "#EDF7F0",
  },
  warning: {
    DEFAULT: "#D4A03C",
    soft: "#FAF2E2",
  },
  danger: {
    DEFAULT: "#C1432D",
    soft: "#FDEDEA",
  },
  info: {
    DEFAULT: "#5B8FC7",
    soft: "#EDF3FA",
  },

  white: "#FFFFFF",
};

/**
 * Spec token name → canonical token name.
 *
 * `generate-tokens.mjs` emits one custom property per entry, resolved to the
 * same channel triplet as its target, so `--color-bg` and `--color-canvas` are
 * interchangeable in `global.css`. Aliases are emitted as literal channels
 * rather than `var()` indirection so NativeWind's runtime never has to chase a
 * variable through a second lookup.
 */
const colorAliases = {
  bg: "canvas",
  "surface-secondary": "surface-sunken",
  "surface-tertiary": "surface-muted",
  border: "line",
  "border-strong": "line-strong",
  "text-primary": "ink",
  "text-secondary": "ink-soft",
  "text-muted": "muted",
  "text-on-primary": "white",
  "text-accent": "primary-500",
  "success-light": "success-soft",
  "warning-light": "warning-soft",
  "danger-light": "danger-soft",
  "info-light": "info-soft",
};

/**
 * Translucent scrims. Held apart from `palette` because they carry their own
 * alpha and so can't be stored as a channel triplet.
 */
const overlay = {
  DEFAULT: "rgba(26, 25, 23, 0.4)",
  light: "rgba(26, 25, 23, 0.08)",
};

/**
 * Type scale, straight off the spec's typography table.
 *
 * `eyebrow` / `tag` / `score` / `stat` are the spec's role names; `micro` is
 * kept as the pre-existing alias of `eyebrow` so older utility usage keeps
 * resolving to the same step.
 */
const typography = {
  /** 11 / 600 / +1 — UPPERCASE section eyebrows. */
  eyebrow: { size: 11, lineHeight: 14, tracking: 1 },
  /** Legacy alias of `eyebrow`. */
  micro: { size: 11, lineHeight: 14, tracking: 1 },
  /** 12 / 500 — chip and tag labels. */
  tag: { size: 12, lineHeight: 16, tracking: 0.2 },
  /** 13 / 500 — secondary metadata, helper text. */
  caption: { size: 13, lineHeight: 18, tracking: 0 },
  bodySm: { size: 14, lineHeight: 20, tracking: 0 },
  /** 15 — the body workhorse. */
  body: { size: 15, lineHeight: 22, tracking: 0 },
  bodyLg: { size: 17, lineHeight: 24, tracking: -0.1 },
  /** 18 / 600 — card titles. */
  h3: { size: 18, lineHeight: 24, tracking: -0.2 },
  /** 22 / 700 — section headers, greetings. */
  h2: { size: 22, lineHeight: 28, tracking: -0.3 },
  /** 28 / 700 — screen titles. */
  h1: { size: 28, lineHeight: 34, tracking: -0.5 },
  /** 32 / 700 — hero headlines and value displays. */
  display: { size: 32, lineHeight: 38, tracking: -0.5 },
  /** Above the spec ramp, for the single biggest editorial moments. */
  displayLg: { size: 40, lineHeight: 44, tracking: -0.8 },
  /** 24 / 700 — score numbers ("8.5", "87%"). */
  score: { size: 24, lineHeight: 28, tracking: -0.3 },
  /** 28 / 700 — stat numbers ("42 Items"). */
  stat: { size: 28, lineHeight: 32, tracking: -0.3 },
};

const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

/** Border radius. Buttons sit at `lg`; cards at `xl`; sheets at `2xl`. */
const radius = {
  none: 0,
  /** Tags, small badges, checkboxes. */
  sm: 8,
  /** Inputs, inner cards, thumbnails. */
  md: 12,
  /** Buttons, standard images inside a card. */
  lg: 16,
  /** Cards, hero surfaces. */
  xl: 20,
  /** Modals and bottom sheets. */
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  full: 9999,
};

/**
 * Spacing. The spec's `xs…4xl` ramp, plus the named layout tokens so screen
 * gutters and section rhythm are declared once rather than per-screen.
 */
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  /** Screen horizontal padding — 20px on every screen. */
  gutter: 20,
  section: 32,
  block: 20,
};

/**
 * Elevation. React Native needs real style objects rather than CSS shadows, so
 * these are consumed through `src/design/index.ts`. Values are also emitted as
 * custom properties for documentation parity.
 *
 * The ramp is deliberately restrained: on a warm paper canvas a card reads as
 * lifted from very little, and the spec pairs each shadow with a hairline
 * border rather than asking the shadow to describe the whole edge. `android`
 * carries the native elevation, which Android composites separately from the
 * iOS shadow parameters.
 */
const shadow = {
  none: { y: 0, blur: 0, opacity: 0, android: 0 },
  /** Input fields on focus, list item cards. */
  sm: { y: 1, blur: 3, opacity: 0.06, android: 1 },
  /** The workhorse — all content cards and grid items. */
  md: { y: 2, blur: 8, opacity: 0.08, android: 3 },
  /** Hero cards, floating action button, tab bar. */
  lg: { y: 4, blur: 16, opacity: 0.1, android: 6 },
  /** Modals, bottom sheets, camera capture ring. */
  xl: { y: 8, blur: 24, opacity: 0.12, android: 12 },
};

/**
 * Brand-tinted glow for primary actions. A terracotta button casting a neutral
 * ink shadow looks dirty; casting its own hue makes it look lit.
 */
const glow = {
  primary: { y: 2, blur: 8, opacity: 0.24, android: 3 },
};

/** Shadows are cast in warm ink, not neutral black. */
const shadowColor = palette.ink.DEFAULT;

/**
 * Interaction tokens (spec §7). Durations are in milliseconds; scales are the
 * compression each surface takes on press.
 */
const motion = {
  duration: {
    /** Button press, chip toggle. */
    fast: 120,
    /** Card press, shadow transitions. */
    normal: 200,
    /** Screen transitions, sheet open/close. */
    slow: 300,
  },
  pressScale: {
    /** Buttons. */
    sm: 0.97,
    /** Cards. */
    md: 0.98,
    /** Floating action button. */
    lg: 0.92,
  },
};

/** `#C1622D` → `193 98 45` (the channel form NativeWind needs for `bg-x/50`). */
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

/** Resolves the spec-named aliases to their hex values. */
function resolveAliases() {
  const flat = flattenPalette();
  return Object.fromEntries(
    Object.entries(colorAliases).map(([alias, target]) => [alias, flat[target]])
  );
}

module.exports = {
  palette,
  colorAliases,
  overlay,
  typography,
  fontWeight,
  radius,
  spacing,
  shadow,
  glow,
  shadowColor,
  motion,
  hexToChannels,
  flattenPalette,
  resolveAliases,
};
