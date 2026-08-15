/** Below this, there's nothing meaningful to analyze — answered without an LLM call. */
export const MIN_ITEMS_FOR_GAP_ANALYSIS = 3;

export const GAP_ANALYSIS_CACHE_TTL_SECONDS = 24 * 60 * 60;

/** Guard against a model returning an unbounded list. */
export const MAX_MISSING_ITEMS = 6;
