// Phase 6's occasion taxonomy (interview, wedding, meeting, party, travel,
// gym, date) is merged into this same list — "meeting" already existed and
// "date" is the same concept as Phase 4's "date_night", so those two aren't
// duplicated. Kept as a plain validated array (see Outfit.context in
// schema.prisma) rather than a Prisma enum so growing it needs no migration.
export const OUTFIT_CONTEXTS = [
  'casual',
  'office',
  'date_night',
  'meeting',
  'weekend',
  'interview',
  'wedding',
  'party',
  'travel',
  'gym',
] as const;
export type OutfitContextValue = (typeof OUTFIT_CONTEXTS)[number];

// "Today's outfit" doesn't ask the user for an occasion, so it needs a
// sensible default context to hand the generator.
export const DEFAULT_DAILY_OUTFIT_CONTEXT: OutfitContextValue = 'casual';
// A little over 24h so the cache never expires mid-day from clock skew — the
// cache *key* (which embeds today's date) is what actually rolls the cache
// over daily, this TTL is just a safety net.
export const DAILY_OUTFIT_CACHE_TTL_SECONDS = 25 * 60 * 60;
