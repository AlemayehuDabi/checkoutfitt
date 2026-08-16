/** Below this, there's nothing meaningful to analyze — answered without an LLM call. */
export const MIN_ITEMS_FOR_GAP_ANALYSIS = 3;

export const GAP_ANALYSIS_CACHE_TTL_SECONDS = 24 * 60 * 60;

/** Guard against a model returning an unbounded list. */
export const MAX_MISSING_ITEMS = 6;

/** Items per valuation request — closets can run to hundreds of garments,
 * which would blow past request size limits in a single call. */
export const CLOSET_VALUE_BATCH_SIZE = 20;

/** Batches in flight at once. Enough to keep a large closet quick without
 * tripping vendor rate limits. */
export const CLOSET_VALUE_BATCH_CONCURRENCY = 3;

export const CLOSET_VALUE_CACHE_TTL_SECONDS = 24 * 60 * 60;

/** How many of the most valuable items the response highlights. */
export const TOP_VALUED_ITEMS = 5;
