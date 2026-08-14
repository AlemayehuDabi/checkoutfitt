/**
 * @deprecated Import `color` from `@/design` instead.
 *
 * This module used to hand-duplicate every hex value from `tailwind.config.js`.
 * It now derives entirely from `src/design/tokens.js` — the same source behind
 * the CSS custom properties in `global.css` — and is kept only as a
 * compatibility alias. There are no remaining values declared here.
 */
export { color as colors } from "@/design";
