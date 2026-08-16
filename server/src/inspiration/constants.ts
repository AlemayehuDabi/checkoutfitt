/** Upper bound on how many garments we try to read out of one inspo photo. */
export const MAX_INSPO_PIECES = 8;

/** Caps how much of a large closet goes into the matching prompt. */
export const MAX_ITEMS_IN_INSPIRATION_PROMPT = 80;

export const MAX_MATCH_REASONS = 5;

/** Same short window as shopping evaluation: re-submitting the same image
 * shouldn't pay for two vision + LLM round trips, but the answer depends on
 * a closet that can change. */
export const INSPIRATION_CACHE_TTL_SECONDS = 60 * 60;
