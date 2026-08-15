const {
  colorAliases,
  overlay,
  palette,
  typography,
  fontWeight,
  radius,
  spacing,
  flattenPalette,
  resolveAliases,
} = require("./src/design/tokens.js");

/**
 * Mirrors the nested palette shape with **literal** values.
 *
 * These used to resolve to `rgb(var(--color-…) / <alpha-value>)`, with the
 * variables emitted into a `:root` block in `global.css`. Browsers resolve
 * `var()` themselves so the web build was fine, but NativeWind compiles a
 * var-backed colour into a deferred runtime lookup rather than a value:
 *
 *   "bg-primary-100": [{}, "rgb", [[{}, "var", ["--color-primary-100"], 1], 1]]
 *
 * On native that lookup does not reliably resolve, so every colour silently
 * came out empty and components rendered unstyled. Literals compile to a real
 * value on both platforms:
 *
 *   "bg-overlay": "#1a191766"
 *
 * Tailwind still composes opacity modifiers (`bg-primary/10`, `bg-white/15`)
 * against a hex value on its own — the `<alpha-value>` placeholder is only
 * needed for function-style colours, which is exactly what we've removed.
 */
function toLiterals(source) {
  const out = {};
  for (const [key, value] of Object.entries(source)) {
    out[key] = typeof value === "string" ? value : toLiterals(value);
  }
  return out;
}

/**
 * The spec's token names as first-class utilities — `bg-bg`, `border-border`,
 * `text-text-muted`, `bg-surface-secondary` — each resolving to the same
 * literal as its canonical twin so the two spellings can never drift.
 */
function aliasColors() {
  return resolveAliases();
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
        ...toLiterals(palette),
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
       * are added alongside. Both point at the same tokens. Sizes have always
       * been literal px — only colours went through `var()`.
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

/** Exported for `scripts/verify-tokens.mjs`, which guards against `var()` regressions. */
module.exports.__tokenAudit = { flattenPalette, colorAliases };
