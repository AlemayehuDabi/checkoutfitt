import {
  MAX_SUGGESTED_OUTFITS,
  MIN_SUGGESTED_OUTFITS,
  SHOPPING_VERDICTS,
} from './constants';

export interface SuggestedOutfitPayload {
  name: string;
  itemIds: string[];
}

export interface ShoppingEvaluationPayload {
  verdict: string;
  verdictReason: string;
  newOutfitCount: number;
  duplicateRisk: boolean;
  gapFill: boolean;
  suggestedOutfits: SuggestedOutfitPayload[];
}

/** See gap-analysis.schema.ts for the `required`/`additionalProperties` rule. */
export const SHOPPING_EVALUATION_JSON_SCHEMA = {
  type: 'object',
  properties: {
    verdict: {
      type: 'string',
      enum: SHOPPING_VERDICTS,
      description:
        'Whether buying this item is worth it for this specific wardrobe.',
    },
    verdictReason: {
      type: 'string',
      description:
        'One or two sentences justifying the verdict, referring to what the user already owns.',
    },
    newOutfitCount: {
      type: 'number',
      description:
        'How many genuinely new outfit combinations this item would unlock with the existing closet.',
    },
    duplicateRisk: {
      type: 'boolean',
      description:
        'True if the user already owns something close enough that this would be redundant.',
    },
    gapFill: {
      type: 'boolean',
      description:
        'True if this item fills a real gap in the wardrobe rather than adding to a well-covered area.',
    },
    suggestedOutfits: {
      type: 'array',
      description: `Between ${MIN_SUGGESTED_OUTFITS} and ${MAX_SUGGESTED_OUTFITS} example outfits pairing the new item with items the user already owns. Omit entirely (empty array) only if the closet has nothing to pair with.`,
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description:
              'Short label for the look, e.g. "Smart casual Friday".',
          },
          itemIds: {
            type: 'array',
            items: { type: 'string' },
            description:
              'IDs of the owned closet items in this outfit, copied verbatim from the provided list. Do not include the new product here.',
          },
        },
        required: ['name', 'itemIds'],
        additionalProperties: false,
      },
    },
  },
  required: [
    'verdict',
    'verdictReason',
    'newOutfitCount',
    'duplicateRisk',
    'gapFill',
    'suggestedOutfits',
  ],
  additionalProperties: false,
} as const;

export const SHOPPING_SYSTEM_PROMPT =
  "You are CheckoutFitt's shopping advisor. You judge whether a specific garment is worth buying for one specific person, based on what they already own. Be honest and protective of the user's money: recommend skipping items that duplicate what they have, and favour pieces that genuinely extend what they can wear.";

export interface ShoppingClosetItem {
  id: string;
  type: string;
  category: string;
  color: string;
  tags: string[];
}

export interface ProductDescriptor {
  type: string;
  category: string;
  color: string;
  style: string;
}

export function buildShoppingPrompt(
  product: ProductDescriptor,
  items: ShoppingClosetItem[],
  totalItems: number,
): string {
  const inventory = items.length
    ? items
        .map(
          (item) =>
            `- id: ${item.id} | ${item.color} ${item.category} (${item.type})${item.tags.length ? ` [${item.tags.join(', ')}]` : ''}`,
        )
        .join('\n')
    : '(the closet is currently empty)';

  const truncated =
    totalItems > items.length
      ? `\n(Showing ${items.length} of ${totalItems} items.)`
      : '';

  return [
    'Decide whether this person should buy the following item.',
    `Item under consideration: ${product.color} ${product.category} (${product.type})${product.style ? `, style: ${product.style}` : ''}.`,
    `What they already own:\n${inventory}${truncated}`,
    'Judge how many new outfit combinations it would unlock, whether it duplicates something they own, and whether it fills a real gap. Then give example outfits pairing it with items they already own, using the ids exactly as listed.',
  ].join('\n\n');
}
