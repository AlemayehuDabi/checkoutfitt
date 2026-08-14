const {
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
      colors: toCssVars(palette),

      /**
       * The numeric ramp is retuned onto the editorial scale so existing
       * `text-base` / `text-sm` usage inherits the new system, and semantic
       * aliases are added for new work. Both point at the same tokens.
       */
      fontSize: {
        xs: step(typography.micro),
        sm: step(typography.caption),
        base: step(typography.body),
        lg: step(typography.bodyLg),
        xl: step(typography.h3),
        "2xl": step(typography.h2),
        "3xl": step(typography.h1),
        "4xl": step(typography.display),
        "5xl": step(typography.displayLg),

        micro: step(typography.micro),
        caption: step(typography.caption),
        "body-sm": step(typography.bodySm),
        body: step(typography.body),
        "body-lg": step(typography.bodyLg),
        h3: step(typography.h3),
        h2: step(typography.h2),
        h1: step(typography.h1),
        display: step(typography.display),
        "display-lg": step(typography.displayLg),
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
