import {
  MAX_TIPS,
  MAX_TRAITS,
  MIN_TIPS,
  MIN_TRAITS,
  STYLE_ARCHETYPES,
} from './constants';

export interface StyleAnalysisPayload {
  archetype: string;
  traits: string[];
  description: string;
  tips: string[];
}

export interface StyleTipsPayload {
  tips: string[];
}

/** See gap-analysis.schema.ts for the `required`/`additionalProperties` rule. */
export const STYLE_ANALYSIS_JSON_SCHEMA = {
  type: 'object',
  properties: {
    archetype: {
      type: 'string',
      enum: STYLE_ARCHETYPES,
      description:
        'The single archetype that best describes this wardrobe as a whole.',
    },
    traits: {
      type: 'array',
      items: { type: 'string' },
      description: `Between ${MIN_TRAITS} and ${MAX_TRAITS} short descriptors of this wardrobe's character, e.g. "neutral tones", "elegant silhouettes". Two or three words each, no sentences.`,
    },
    description: {
      type: 'string',
      description:
        "A single warm, specific paragraph (3-5 sentences) describing this person's style, written in second person as if speaking to them.",
    },
    tips: {
      type: 'array',
      items: { type: 'string' },
      description: `Between ${MIN_TIPS} and ${MAX_TIPS} actionable styling suggestions tailored to this wardrobe. Each one sentence.`,
    },
  },
  required: ['archetype', 'traits', 'description', 'tips'],
  additionalProperties: false,
} as const;

export const STYLE_TIPS_JSON_SCHEMA = {
  type: 'object',
  properties: {
    tips: {
      type: 'array',
      items: { type: 'string' },
      description: `Between ${MIN_TIPS} and ${MAX_TIPS} fresh, actionable styling suggestions. Each one sentence.`,
    },
  },
  required: ['tips'],
  additionalProperties: false,
} as const;

export const STYLE_COACH_SYSTEM_PROMPT =
  "You are CheckoutFitt's style coach. You read a person's whole wardrobe as a collection and name the aesthetic it expresses, then give practical advice for leaning into it. Be warm, specific and encouraging — describe the style that is actually there rather than prescribing a trend.";

export interface StyleItemSummary {
  type: string;
  category: string;
  color: string;
  tags: string[];
}

function formatItems(items: StyleItemSummary[]): string {
  return items
    .map(
      (item) =>
        `- ${item.color} ${item.category} (${item.type})${item.tags.length ? ` [${item.tags.join(', ')}]` : ''}`,
    )
    .join('\n');
}

export function buildStyleAnalysisPrompt(
  items: StyleItemSummary[],
  totalItems: number,
): string {
  const truncated =
    totalItems > items.length
      ? `\n(Showing ${items.length} of ${totalItems} items.)`
      : '';

  return [
    "Analyze this wardrobe as a whole and determine the person's style.",
    `Wardrobe:\n${formatItems(items)}${truncated}`,
    'Identify the single archetype that best fits, the key traits that characterize it, a description of their style, and actionable tips for building on it.',
  ].join('\n\n');
}

export function buildStyleTipsPrompt(
  archetype: string,
  traits: string[],
  items: StyleItemSummary[],
  totalItems: number,
): string {
  const truncated =
    totalItems > items.length
      ? `\n(Showing ${items.length} of ${totalItems} items.)`
      : '';

  return [
    `This person's style archetype is "${archetype}"${traits.length ? `, characterized by: ${traits.join(', ')}` : ''}.`,
    `Their current wardrobe:\n${formatItems(items)}${truncated}`,
    'Give fresh, practical styling tips that build on this archetype using what they already own. Favour specific advice about combining or wearing these pieces over generic style rules.',
  ].join('\n\n');
}
