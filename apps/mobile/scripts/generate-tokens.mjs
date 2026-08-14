/**
 * Regenerates the `:root` custom-property block in `src/global.css` from
 * `src/design/tokens.js`, so the CSS variables and the runtime/Tailwind values
 * can never drift apart.
 *
 *   npm run tokens
 *
 * Everything between the BEGIN/END markers is owned by this script; anything
 * outside them is preserved.
 */
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const {
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
} = require(resolve(root, "src/design/tokens.js"));

const BEGIN = "  /* === BEGIN GENERATED TOKENS — edit src/design/tokens.js === */";
const END = "  /* === END GENERATED TOKENS === */";

const lines = [];
const section = (title) => lines.push("", `  /* ${title} */`);

section("Color — channel triplets so NativeWind can apply opacity modifiers");
for (const [name, hex] of Object.entries(flattenPalette())) {
  lines.push(`  --color-${name}: ${hexToChannels(hex)}; /* ${hex} */`);
}

section("Typography — size / line-height / letter-spacing");
for (const [name, step] of Object.entries(typography)) {
  const kebab = name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  lines.push(`  --font-size-${kebab}: ${step.size}px;`);
  lines.push(`  --line-height-${kebab}: ${step.lineHeight}px;`);
  lines.push(`  --tracking-${kebab}: ${step.tracking}px;`);
}

section("Font weight");
for (const [name, value] of Object.entries(fontWeight)) {
  lines.push(`  --font-weight-${name}: ${value};`);
}

section("Radius");
for (const [name, value] of Object.entries(radius)) {
  lines.push(`  --radius-${name}: ${value}px;`);
}

section("Spacing — named layout rhythm");
for (const [name, value] of Object.entries(spacing)) {
  lines.push(`  --spacing-${name}: ${value}px;`);
}

section("Elevation — consumed at runtime via src/design/index.ts");
lines.push(`  --shadow-color: ${hexToChannels(shadowColor)}; /* ${shadowColor} */`);
for (const [name, step] of Object.entries(shadow)) {
  lines.push(
    `  --shadow-${name}: 0px ${step.y}px ${step.blur}px rgb(var(--shadow-color) / ${step.opacity});`
  );
  lines.push(`  --elevation-${name}: ${step.android};`);
}
for (const [name, step] of Object.entries(glow)) {
  lines.push(
    `  --glow-${name}: 0px ${step.y}px ${step.blur}px rgb(var(--color-${name}) / ${step.opacity});`
  );
}

const cssPath = resolve(root, "src/global.css");
const current = readFileSync(cssPath, "utf8");
const block = [BEGIN, ...lines, "", END].join("\n");

const next = current.includes(BEGIN)
  ? current.replace(
      new RegExp(`${escapeRegExp(BEGIN)}[\\s\\S]*?${escapeRegExp(END)}`),
      block
    )
  : `${current.trimEnd()}\n\n:root {\n${block}\n}\n`;

writeFileSync(cssPath, next);
console.log(`✓ Wrote ${lines.filter((l) => l.includes("--")).length} tokens to src/global.css`);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
