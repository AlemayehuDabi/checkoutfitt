/**
 * Cache keys for analyses derived from a user's closet.
 *
 * These live here rather than in the feature modules that produce them so
 * ClosetService can invalidate them on every closet edit without importing
 * (and creating a cycle with) those modules — they all import ClosetModule
 * to reuse ClosetService.
 */
export const gapAnalysisKey = (userId: string) => `gap-analysis:${userId}`;

export const closetValueKey = (userId: string) => `closet-value:${userId}`;

export const styleTipsKey = (userId: string) => `style-tips:${userId}`;

/** Every cached analysis invalidated by any change to the closet. */
export function closetDerivedCacheKeys(userId: string): string[] {
  return [gapAnalysisKey(userId), closetValueKey(userId), styleTipsKey(userId)];
}

/**
 * Closet-derived caches whose key embeds request parameters, so they can
 * only be cleared by glob. Both are user-scoped, keeping each sweep small.
 */
export function closetDerivedCachePatterns(userId: string): string[] {
  return [
    `capsule:${userId}:*`,
    `shopping-eval:${userId}:*`,
    `inspiration:${userId}:*`,
  ];
}
