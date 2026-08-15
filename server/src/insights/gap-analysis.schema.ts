import { CLOSET_ITEM_TYPES } from '../closet/constants';

export interface MissingItem {
  name: string;
  type: string;
  category: string;
  reason: string;
  estimatedNewOutfits: number;
}

/** Raw model output, before normalization in GapAnalysisService. */
export interface GapAnalysisPayload {
  completionPercentage: number;
  missingItems: MissingItem[];
  summary: string;
}

/**
 * Shared across all three LLM vendors, same as GARMENT_JSON_SCHEMA and
 * OUTFIT_JSON_SCHEMA. Every object lists all properties in `required` and
 * sets `additionalProperties: false` — OpenAI's `strict: true` mode rejects
 * schemas that don't, and the other two vendors accept that form fine.
 */
export const GAP_ANALYSIS_JSON_SCHEMA = {
  type: 'object',
  properties: {
    completionPercentage: {
      type: 'number',
      description:
        'How complete this wardrobe is as a versatile, self-sufficient closet, 0-100. A closet that can already dress its owner for most everyday occasions scores high.',
    },
    missingItems: {
      type: 'array',
      description:
        'The missing staples that would unlock the most new outfit combinations, most impactful first. Return between 1 and 6.',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description:
              'Short, shoppable name for the item, e.g. "white leather sneakers".',
          },
          type: {
            type: 'string',
            enum: CLOSET_ITEM_TYPES,
            description: 'Broad garment type this item belongs to.',
          },
          category: {
            type: 'string',
            description:
              'Specific garment category, e.g. "sneakers", "denim jacket".',
          },
          reason: {
            type: 'string',
            description:
              'One sentence on why this gap matters for this specific wardrobe.',
          },
          estimatedNewOutfits: {
            type: 'number',
            description:
              'Roughly how many new outfit combinations adding this item would unlock.',
          },
        },
        required: ['name', 'type', 'category', 'reason', 'estimatedNewOutfits'],
        additionalProperties: false,
      },
    },
    summary: {
      type: 'string',
      description:
        "A short (1-3 sentence), friendly overall assessment of the wardrobe's strengths and biggest gap.",
    },
  },
  required: ['completionPercentage', 'missingItems', 'summary'],
  additionalProperties: false,
} as const;

export const GAP_ANALYSIS_SYSTEM_PROMPT =
  "You are CheckoutFitt's wardrobe analyst. You assess a user's closet inventory and identify the missing staples that would unlock the most new outfit combinations. Judge versatility, not volume — a small well-chosen wardrobe can score high.";

/**
 * Counts rather than a full item list: the model only needs the shape of the
 * wardrobe to spot what's absent, and counts keep the prompt flat as closets
 * grow into the hundreds.
 */
export interface InventorySummary {
  totalItems: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
  byColor: Record<string, number>;
}

function formatCounts(counts: Record<string, number>): string {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return entries.length
    ? entries.map(([name, count]) => `${name} (${count})`).join(', ')
    : 'none';
}

export function buildGapAnalysisPrompt(inventory: InventorySummary): string {
  return [
    "Analyze this user's wardrobe and identify what's missing.",
    `Total items: ${inventory.totalItems}`,
    `By type: ${formatCounts(inventory.byType)}`,
    `By category: ${formatCounts(inventory.byCategory)}`,
    `By color: ${formatCounts(inventory.byColor)}`,
    'Identify the missing staples that would unlock the most new outfit combinations, and rate how complete this wardrobe already is. Consider what the user can and cannot currently assemble — gaps in a whole garment type matter more than a missing variation of something they already own.',
  ].join('\n\n');
}
