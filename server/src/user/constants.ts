export const STYLE_PREFERENCES = [
  'minimalist',
  'streetwear',
  'old_money',
  'casual',
  'formal',
  'athleisure',
  'preppy',
  'bohemian',
] as const;
export type StylePreference = (typeof STYLE_PREFERENCES)[number];

export const GENDER_PRESENTATIONS = [
  'masculine',
  'feminine',
  'androgynous',
  'no_preference',
] as const;
export type GenderPresentation = (typeof GENDER_PRESENTATIONS)[number];
