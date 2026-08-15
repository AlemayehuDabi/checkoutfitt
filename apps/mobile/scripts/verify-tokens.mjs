/**
 * Audits the design-token pipeline.
 *
 *   npm run tokens
 *
 * Tokens live as literal values in `src/design/tokens.js` and flow into
 * `tailwind.config.js` (utility classes) and `src/design/index.ts` (runtime
 * values). This script guards the one property that has to hold for the app to
 * render on device: **no colour in the compiled Tailwind theme may be a `var()`
 * reference.**
 *
 * NativeWind turns a var-backed colour into a deferred runtime lookup rather
 * than a value. Browsers resolve `var()` natively so the web build stays
 * correct, which is what made the previous regression so hard to spot: the
 * whole colour system silently evaluated to nothing on native only.
 */
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const tailwind = require(resolve(root, "tailwind.config.js"));
const { flattenPalette, colorAliases } = tailwind.__tokenAudit;

const failures = [];

/** Walks the theme's colour tree and reports any non-literal leaf. */
function auditColors(node, path = "") {
  for (const [key, value] of Object.entries(node)) {
    const name = path ? `${path}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      auditColors(value, name);
      continue;
    }
    if (typeof value !== "string") {
      failures.push(`${name} is ${typeof value}, expected a literal string`);
    } else if (value.includes("var(")) {
      failures.push(`${name} resolves through var() — native cannot resolve it: ${value}`);
    } else if (!/^(#[0-9a-f]{3,8}|rgba?\(|hsla?\()/i.test(value)) {
      failures.push(`${name} is not a literal colour: ${value}`);
    }
  }
}

auditColors(tailwind.theme.extend.colors);

/** Sizes, radii and spacing must be concrete px strings for the same reason. */
function auditScale(label, scale, unwrap = (v) => v) {
  for (const [key, raw] of Object.entries(scale)) {
    const value = unwrap(raw);
    if (typeof value !== "string" || value.includes("var(")) {
      failures.push(`${label}.${key} is not a literal: ${JSON.stringify(raw)}`);
    }
  }
}

auditScale("fontSize", tailwind.theme.extend.fontSize, (v) => (Array.isArray(v) ? v[0] : v));
auditScale("borderRadius", tailwind.theme.extend.borderRadius);
auditScale("spacing", tailwind.theme.extend.spacing);

/** Every spec alias has to point at a real canonical token. */
const flat = flattenPalette();
for (const [alias, target] of Object.entries(colorAliases)) {
  if (!flat[target]) failures.push(`alias "${alias}" points at unknown token "${target}"`);
}

/** `global.css` must stay free of token declarations (comments may cite them). */
const css = readFileSync(resolve(root, "src/global.css"), "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  ""
);
if (/--(?:color|space|spacing|radius|text|font-size|shadow)-/.test(css)) {
  failures.push("src/global.css declares design tokens as custom properties again");
}

if (failures.length) {
  console.error("✗ Token pipeline audit failed:\n" + failures.map((f) => `  • ${f}`).join("\n"));
  process.exit(1);
}

const colorCount = Object.keys(flat).length + Object.keys(colorAliases).length;
console.log(
  `✓ Token pipeline is literal — ${colorCount} colours, ` +
    `${Object.keys(tailwind.theme.extend.fontSize).length} type steps, ` +
    `${Object.keys(tailwind.theme.extend.spacing).length} spacing steps, no var() references`
);
