// Phase 6 extends this list with more occasions (interview, wedding, party,
// travel, gym); kept as a plain validated array (see Outfit.context in
// schema.prisma) rather than a Prisma enum so growing it needs no migration.
export const OUTFIT_CONTEXTS = [
  'casual',
  'office',
  'date_night',
  'meeting',
  'weekend',
] as const;
export type OutfitContextValue = (typeof OUTFIT_CONTEXTS)[number];
