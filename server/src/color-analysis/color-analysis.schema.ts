import {
  CONTRAST_LEVELS,
  MAX_BEST_COLORS,
  MAX_SEASON_TRAITS,
  MAX_WORST_COLORS,
  MIN_BEST_COLORS,
  SEASONS,
  UNDERTONES,
} from './constants';

export interface ColorAnalysisPayload {
  season: string;
  seasonTraits: string[];
  bestColors: string[];
  worstColors: string[];
  undertone: string;
  contrast: string;
  proTip: string;
}

/** See gap-analysis.schema.ts for the `required`/`additionalProperties` rule. */
export const COLOR_ANALYSIS_JSON_SCHEMA = {
  type: 'object',
  properties: {
    season: {
      type: 'string',
      enum: SEASONS,
      description:
        'The seasonal colour type that best matches this person’s colouring.',
    },
    seasonTraits: {
      type: 'array',
      items: { type: 'string' },
      description: `Up to ${MAX_SEASON_TRAITS} one-word descriptors of the season, e.g. "Warm", "Muted", "Rich".`,
    },
    bestColors: {
      type: 'array',
      items: { type: 'string' },
      description: `Between ${MIN_BEST_COLORS} and ${MAX_BEST_COLORS} flattering colours as #RRGGBB hex strings, e.g. "#8C6239". Hex only, no colour names.`,
    },
    worstColors: {
      type: 'array',
      items: { type: 'string' },
      description: `Up to ${MAX_WORST_COLORS} unflattering colours as #RRGGBB hex strings. Hex only, no colour names.`,
    },
    undertone: {
      type: 'string',
      enum: UNDERTONES,
      description: 'The skin undertone.',
    },
    contrast: {
      type: 'string',
      enum: CONTRAST_LEVELS,
      description:
        'Overall contrast level between hair, skin and eyes, which decides how much contrast an outfit should carry.',
    },
    proTip: {
      type: 'string',
      description:
        'One practical sentence on how to use this palette when dressing.',
    },
  },
  required: [
    'season',
    'seasonTraits',
    'bestColors',
    'worstColors',
    'undertone',
    'contrast',
    'proTip',
  ],
  additionalProperties: false,
} as const;

/**
 * The guardrail sentence is deliberate: this endpoint takes a photo of the
 * user's face, and the model's job is strictly to read colouring for palette
 * purposes — not to describe, rate or infer anything else about the person.
 */
export const COLOR_ANALYSIS_SYSTEM_PROMPT =
  "You are CheckoutFitt's colour analyst. You perform seasonal colour analysis: reading skin undertone, plus hair and eye colouring, to determine which clothing colours flatter someone. Judge only colouring for the purpose of recommending a wardrobe palette — never comment on or infer the person's appearance, attractiveness, age, ethnicity or identity. Give every colour as a #RRGGBB hex value.";

export const COLOR_ANALYSIS_PROMPT = [
  'Perform a seasonal colour analysis from this photo.',
  'Determine: the skin undertone (warm, cool or neutral); the overall contrast level between hair, skin and eyes; the twelve-system seasonal type this colouring belongs to; and the short traits that characterise that season.',
  'Then give a palette of flattering colours and a shorter list of colours to avoid, all as #RRGGBB hex values, plus one practical tip for dressing with this palette.',
].join('\n\n');
