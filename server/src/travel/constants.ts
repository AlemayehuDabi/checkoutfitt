/**
 * Trip activities. Deliberately its own taxonomy rather than the outfit
 * generator's OUTFIT_CONTEXTS: what you do on a trip ("sightseeing",
 * "hiking") isn't the same axis as the formality contexts used to assemble a
 * single outfit.
 */
export const TRAVEL_OCCASIONS = [
  'sightseeing',
  'business_meeting',
  'dinner',
  'beach',
  'hiking',
  'nightlife',
  'shopping',
  'relaxing',
] as const;
export type TravelOccasion = (typeof TRAVEL_OCCASIONS)[number];

export const MAX_TRIP_DAYS = 14;

/** Caps how much of a large closet goes into the prompt. */
export const MAX_ITEMS_IN_TRAVEL_PROMPT = 80;

/** "48.85,2.35" — coordinates passed inline instead of a place name. */
export const COORDINATE_PATTERN =
  /^\s*(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/;
