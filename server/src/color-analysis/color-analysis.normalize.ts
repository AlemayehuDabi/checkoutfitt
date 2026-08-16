import { HEX_COLOR_PATTERN } from './constants';

/**
 * Pure normalizers for model output, kept separate from the service so they
 * can be unit tested without a provider call — they're the guard between an
 * LLM's free-form answer and what clients render.
 */

/**
 * Hex values are rendered directly as swatches, so anything that isn't
 * #RRGGBB is dropped rather than passed through. Shorthand (#abc) is
 * expanded, casing is normalized, and duplicates are collapsed.
 */
export function normalizeHexColors(value: unknown, max: number): string[] {
  const raw = Array.isArray(value) ? value : [];
  const seen = new Set<string>();

  for (const entry of raw) {
    if (typeof entry !== 'string') {
      continue;
    }
    const trimmed = entry.trim();
    const expanded = /^#[0-9A-Fa-f]{3}$/.test(trimmed)
      ? `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`
      : trimmed;
    if (HEX_COLOR_PATTERN.test(expanded)) {
      seen.add(expanded.toUpperCase());
    }
  }

  return [...seen].slice(0, max);
}

/** Drops non-strings and blanks, trims, and caps the list length. */
export function cleanStrings(value: unknown, max: number): string[] {
  return (Array.isArray(value) ? value : [])
    .filter(
      (entry): entry is string =>
        typeof entry === 'string' && entry.trim().length > 0,
    )
    .map((entry) => entry.trim())
    .slice(0, max);
}
