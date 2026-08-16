/**
 * Archetypes the coach can assign. Deliberately a separate taxonomy from
 * user/constants.ts STYLE_PREFERENCES: those are aspirations the user picks
 * in the onboarding quiz, these are conclusions drawn from what they
 * actually own. They overlap but are not interchangeable.
 */
export const STYLE_ARCHETYPES = [
  'minimalist',
  'streetwear',
  'old_money',
  'casual',
  'bohemian',
  'classic',
  'edgy',
  'romantic',
  'sporty',
  'eclectic',
] as const;
export type StyleArchetype = (typeof STYLE_ARCHETYPES)[number];

/** Below this there isn't enough of a collection to read a style from. */
export const MIN_ITEMS_FOR_STYLE_ANALYSIS = 5;

export const MIN_TRAITS = 3;
export const MAX_TRAITS = 6;
export const MIN_TIPS = 3;
export const MAX_TIPS = 5;

export const STYLE_TIPS_CACHE_TTL_SECONDS = 24 * 60 * 60;

/** Caps how much of a large closet goes into the prompt. Style reads from a
 * representative sample; sending 300 garments would just cost tokens. */
export const MAX_ITEMS_IN_STYLE_PROMPT = 60;
