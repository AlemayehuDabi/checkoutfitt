/** The standard twelve-season colour analysis system. */
export const SEASONS = [
  'Bright Spring',
  'True Spring',
  'Light Spring',
  'Light Summer',
  'True Summer',
  'Soft Summer',
  'Soft Autumn',
  'True Autumn',
  'Deep Autumn',
  'Deep Winter',
  'True Winter',
  'Bright Winter',
] as const;
export type Season = (typeof SEASONS)[number];

export const UNDERTONES = ['warm', 'cool', 'neutral'] as const;
export type Undertone = (typeof UNDERTONES)[number];

export const CONTRAST_LEVELS = ['low', 'medium', 'high'] as const;
export type ContrastLevel = (typeof CONTRAST_LEVELS)[number];

export const MIN_BEST_COLORS = 6;
export const MAX_BEST_COLORS = 10;
export const MAX_WORST_COLORS = 6;
export const MAX_SEASON_TRAITS = 4;

/** Palette entries must be #RRGGBB — a client renders these directly as
 * swatches, so a malformed value would paint nothing. */
export const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;
