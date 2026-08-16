export const SHOPPING_VERDICTS = ['worth_it', 'maybe', 'skip'] as const;
export type ShoppingVerdict = (typeof SHOPPING_VERDICTS)[number];

export const MIN_SUGGESTED_OUTFITS = 2;
export const MAX_SUGGESTED_OUTFITS = 3;

/** Caps how much of a large closet goes into the prompt. */
export const MAX_ITEMS_IN_SHOPPING_PROMPT = 60;

/** Short-lived: re-evaluating the same product minutes later shouldn't cost
 * two vision + LLM round trips, but the answer depends on a closet that can
 * change, so it shouldn't be cached for long either. */
export const SHOPPING_EVAL_CACHE_TTL_SECONDS = 60 * 60;
