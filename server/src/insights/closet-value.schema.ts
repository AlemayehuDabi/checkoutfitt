/**
 * Valuation is forced into a single currency so batch results can simply be
 * summed. A per-item currency that the model chose freely would make
 * `totalValue` meaningless the moment one item came back in EUR.
 */
export const VALUATION_CURRENCY = 'USD';

export const CONFIDENCE_LEVELS = ['low', 'medium', 'high'] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

export interface ValuedItemPayload {
  closetItemId: string;
  estimatedValue: number;
  currency: string;
  confidence: string;
  brandGuess: string;
}

export interface ClosetValueBatchPayload {
  items: ValuedItemPayload[];
}

/** Shared across all three vendors; see the note in gap-analysis.schema.ts
 * about `required` / `additionalProperties` and OpenAI strict mode. */
export const CLOSET_VALUE_JSON_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      description:
        'One entry for every item in the provided list, in the same order.',
      items: {
        type: 'object',
        properties: {
          closetItemId: {
            type: 'string',
            description:
              'The exact id of the item being valued, copied from the provided list.',
          },
          estimatedValue: {
            type: 'number',
            description: `Estimated current resale value of the item in ${VALUATION_CURRENCY}, as a number with no currency symbol.`,
          },
          currency: {
            type: 'string',
            enum: [VALUATION_CURRENCY],
            description: `Always "${VALUATION_CURRENCY}".`,
          },
          confidence: {
            type: 'string',
            enum: CONFIDENCE_LEVELS,
            description:
              'How confident this estimate is, given how much the photo and metadata reveal.',
          },
          brandGuess: {
            type: 'string',
            description:
              'Best guess at the brand, or "unknown" when the photo shows no identifiable branding.',
          },
        },
        required: [
          'closetItemId',
          'estimatedValue',
          'currency',
          'confidence',
          'brandGuess',
        ],
        additionalProperties: false,
      },
    },
  },
  required: ['items'],
  additionalProperties: false,
} as const;

export const CLOSET_VALUE_SYSTEM_PROMPT = `You are CheckoutFitt's garment appraiser. You estimate the realistic current second-hand resale value of clothing from a photo plus its recorded attributes. Be conservative: value ordinary unbranded basics accordingly, and only assign premium values when the photo or attributes genuinely indicate a premium or designer piece. Always answer in ${VALUATION_CURRENCY}.`;

export interface ValuationCandidate {
  id: string;
  type: string;
  category: string;
  color: string;
  tags: string[];
}

export function buildClosetValuePrompt(items: ValuationCandidate[]): string {
  const list = items
    .map(
      (item, index) =>
        `${index + 1}. id: ${item.id} | type: ${item.type} | category: ${item.category} | color: ${item.color} | tags: ${item.tags.join(', ') || 'none'}`,
    )
    .join('\n');

  return [
    `Estimate the second-hand resale value of each of the following ${items.length} clothing item(s).`,
    `Items:\n${list}`,
    `The attached images correspond to these items in the same order (image 1 is item 1, and so on). Use each photo to judge condition, material quality and any visible branding.`,
    `Return exactly one entry per item, copying the id verbatim. Give every value in ${VALUATION_CURRENCY}.`,
  ].join('\n\n');
}
