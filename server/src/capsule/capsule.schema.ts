import { MAX_SAMPLE_OUTFITS, MIN_SAMPLE_OUTFITS } from './constants';

export interface SampleOutfitPayload {
  name: string;
  itemIds: string[];
}

export interface CapsulePayload {
  title: string;
  itemIds: string[];
  totalOutfits: number;
  sampleOutfits: SampleOutfitPayload[];
}

/** See gap-analysis.schema.ts for the `required`/`additionalProperties` rule. */
export const CAPSULE_JSON_SCHEMA = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description:
        'Short name for this capsule, e.g. "Your Spring Capsule" or "Workweek Capsule".',
    },
    itemIds: {
      type: 'array',
      items: { type: 'string' },
      description:
        'IDs of the chosen closet items, copied verbatim from the provided list. Return exactly the requested number of items, with no duplicates.',
    },
    totalOutfits: {
      type: 'number',
      description:
        'Estimated number of distinct, sensible outfits that can be assembled from this capsule alone.',
    },
    sampleOutfits: {
      type: 'array',
      description: `Between ${MIN_SAMPLE_OUTFITS} and ${MAX_SAMPLE_OUTFITS} example outfits assembled only from the capsule items above.`,
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Short label, e.g. "Monday meeting".',
          },
          itemIds: {
            type: 'array',
            items: { type: 'string' },
            description:
              'IDs of the capsule items in this outfit. Every id must also appear in the capsule itemIds.',
          },
        },
        required: ['name', 'itemIds'],
        additionalProperties: false,
      },
    },
  },
  required: ['title', 'itemIds', 'totalOutfits', 'sampleOutfits'],
  additionalProperties: false,
} as const;

export const CAPSULE_SYSTEM_PROMPT =
  "You are CheckoutFitt's capsule wardrobe curator. From a person's existing closet you select a small, tightly interchangeable set of garments that mixes and matches into as many complete outfits as possible. Favour versatile, neutral, easily-combined pieces over statement items, and make sure the set can actually dress someone head to toe — tops, bottoms and footwear all covered.";

export interface CapsuleCandidate {
  id: string;
  type: string;
  category: string;
  color: string;
  tags: string[];
}

export function buildCapsulePrompt(params: {
  items: CapsuleCandidate[];
  totalItems: number;
  targetSize: number;
  occasions: string[];
  season?: string;
}): string {
  const inventory = params.items
    .map(
      (item) =>
        `- id: ${item.id} | ${item.color} ${item.category} (${item.type})${item.tags.length ? ` [${item.tags.join(', ')}]` : ''}`,
    )
    .join('\n');

  const truncated =
    params.totalItems > params.items.length
      ? `\n(Showing ${params.items.length} of ${params.totalItems} items.)`
      : '';

  const sections = [
    `Build a capsule wardrobe of exactly ${params.targetSize} items from this closet.`,
    `Closet:\n${inventory}${truncated}`,
    `Optimize the capsule for these occasions: ${params.occasions.join(', ')}. Choose the subset that yields the most complete outfits across all of them.`,
  ];

  if (params.season) {
    sections.push(
      `The capsule is for ${params.season}, so favour items appropriate to that season's weather and leave out clearly off-season pieces.`,
    );
  }

  sections.push(
    `Then give example outfits built only from the items you selected, and estimate how many distinct outfits the capsule supports in total.`,
  );

  return sections.join('\n\n');
}
