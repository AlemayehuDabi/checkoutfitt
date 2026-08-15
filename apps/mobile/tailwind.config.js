const {
  colorAliases,
  overlay,
  palette,
  typography,
  fontWeight,
  radius,
  spacing,
} = require("./src/design/tokens.js");

/**
 * Mirrors the nested palette shape, but every leaf resolves to the CSS custom
 * property emitted into `src/global.css`. Using the `rgb(... / <alpha-value>)`
 * form is what lets NativeWind compose opacity modifiers like `bg-primary/10`.
 *
 * `primary.DEFAULT` → `var(--color-primary)`, `primary.600` → `var(--color-primary-600)`.
 */
function toCssVars(source, prefix = "") {
  const out = {};
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "string") {
      const name = key === "DEFAULT" ? prefix : prefix ? `${prefix}-${key}` : key;
      out[key] = `rgb(var(--color-${name}) / <alpha-value>)`;
    } else {
      out[key] = toCssVars(value, prefix ? `${prefix}-${key}` : key);
    }
  }
  return out;
}

/**
 * The spec's token names as first-class utilities — `bg-bg`, `border-border`,
 * `text-text-muted`, `bg-surface-secondary`. Each points at the alias custom
 * property generated alongside its canonical twin, so both spellings resolve to
 * one value and neither can drift.
 */
function aliasColors() {
  return Object.fromEntries(
    Object.keys(colorAliases).map((alias) => [
      alias,
      `rgb(var(--color-${alias}) / <alpha-value>)`,
    ])
  );
}

/** `{ size, lineHeight, tracking }` → Tailwind's `[size, { … }]` tuple. */
const step = ({ size, lineHeight, tracking }) => [
  `${size}px`,
  { lineHeight: `${lineHeight}px`, letterSpacing: `${tracking}px` },
];

const px = (scale) =>
  Object.fromEntries(Object.entries(scale).map(([k, v]) => [k, `${v}px`]));

module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ...toCssVars(palette),
        ...aliasColors(),
        overlay: {
          DEFAULT: overlay.DEFAULT,
          light: overlay.light,
        },
      },

      /**
       * The numeric ramp is retuned onto the spec's scale so existing
       * `text-base` / `text-sm` usage inherits the new system, and the spec's
       * role names (`text-eyebrow`, `text-tag`, `text-score`, `text-stat`…)
       * are added alongside. Both point at the same tokens.
       */
      fontSize: {
        xs: step(typography.eyebrow),
        sm: step(typography.caption),
        base: step(typography.body),
        lg: step(typography.bodyLg),
        xl: step(typography.h3),
        "2xl": step(typography.h2),
        "3xl": step(typography.h1),
        "4xl": step(typography.display),
        "5xl": step(typography.displayLg),

        eyebrow: step(typography.eyebrow),
        micro: step(typography.micro),
        tag: step(typography.tag),
        caption: step(typography.caption),
        "body-sm": step(typography.bodySm),
        body: step(typography.body),
        "body-lg": step(typography.bodyLg),
        h3: step(typography.h3),
        h2: step(typography.h2),
        h1: step(typography.h1),
        display: step(typography.display),
        "display-lg": step(typography.displayLg),
        score: step(typography.score),
        stat: step(typography.stat),
      },

      fontWeight,

      fontFamily: {
        sans: ["System"],
        display: ["System"],
      },

      borderRadius: px(radius),

      spacing: px(spacing),
    },
  },
  plugins: [],
};
