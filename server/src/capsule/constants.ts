export const CAPSULE_SEASONS = ['spring', 'summer', 'fall', 'winter'] as const;
export type CapsuleSeason = (typeof CAPSULE_SEASONS)[number];

export const DEFAULT_CAPSULE_SIZE = 10;
export const MIN_CAPSULE_SIZE = 5;
export const MAX_CAPSULE_SIZE = 20;

export const MIN_SAMPLE_OUTFITS = 3;
export const MAX_SAMPLE_OUTFITS = 5;

export const CAPSULE_CACHE_TTL_SECONDS = 12 * 60 * 60;

/** Caps how much of a large closet goes into the prompt. */
export const MAX_ITEMS_IN_CAPSULE_PROMPT = 80;
