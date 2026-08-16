import { CLOSET_ITEM_TYPES } from '../closet/constants';
import { MAX_INSPO_PIECES, MAX_MATCH_REASONS } from './constants';

export interface InspoPiece {
  type: string;
  color: string;
  style: string;
}

export interface InspoExtractionPayload {
  pieces: InspoPiece[];
  vibe: string;
}

export interface MatchedPiecePayload {
  inspoPieceIndex: number;
  closetItemId: string;
  matchScore: number;
}

export interface MissingPiecePayload {
  type: string;
  color: string;
  style: string;
  suggestion: string;
}

export interface InspoMatchPayload {
  overallMatchPercentage: number;
  matchedPieces: MatchedPiecePayload[];
  missingPieces: MissingPiecePayload[];
  matchReasons: string[];
}

/**
 * Step 1 — read the outfit out of the inspiration photo.
 *
 * This is a multi-garment read, which VisionService.detectGarment can't do:
 * that method is built around a single-item schema. Rather than add a
 * `detectOutfit` to all three vision providers for a shape only this feature
 * uses, it goes through the shared structured-output primitive, which
 * already does image+text -> arbitrary schema on every vendor.
 */
export const INSPO_EXTRACTION_JSON_SCHEMA = {
  type: 'object',
  properties: {
    pieces: {
      type: 'array',
      description: `Every distinct garment or accessory visible in the outfit, at most ${MAX_INSPO_PIECES}. One entry per piece, top to bottom.`,
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: CLOSET_ITEM_TYPES,
            description: 'Broad garment type.',
          },
          color: {
            type: 'string',
            description: 'Dominant colour of the piece, in plain English.',
          },
          style: {
            type: 'string',
            description:
              'Short style descriptors for the piece, e.g. "oversized, cropped, ribbed".',
          },
        },
        required: ['type', 'color', 'style'],
        additionalProperties: false,
      },
    },
    vibe: {
      type: 'string',
      description:
        'The overall aesthetic of the look in a few words, e.g. "relaxed minimalist streetwear".',
    },
  },
  required: ['pieces', 'vibe'],
  additionalProperties: false,
} as const;

export const INSPO_EXTRACTION_SYSTEM_PROMPT =
  "You are CheckoutFitt's outfit reader. You break a styled outfit photo down into the individual garments and accessories being worn, describing only the clothing — never the person wearing it.";

export const INSPO_EXTRACTION_PROMPT =
  "List every distinct garment and accessory worn in this outfit, with each piece's type, dominant colour and style descriptors, and summarise the overall aesthetic of the look.";

/** Step 2 — match those pieces against what the user actually owns. */
export const INSPO_MATCH_JSON_SCHEMA = {
  type: 'object',
  properties: {
    overallMatchPercentage: {
      type: 'number',
      description:
        'How closely this wardrobe can recreate the look overall, 0-100. Weigh the pieces that define the look most heavily.',
    },
    matchedPieces: {
      type: 'array',
      description:
        'One entry per inspiration piece that has a good enough match in the closet. Omit pieces with no reasonable match.',
      items: {
        type: 'object',
        properties: {
          inspoPieceIndex: {
            type: 'number',
            description:
              'Zero-based index of the inspiration piece being matched, from the numbered list.',
          },
          closetItemId: {
            type: 'string',
            description:
              'Id of the closest owned item, copied verbatim from the closet list.',
          },
          matchScore: {
            type: 'number',
            description: 'How close this substitute is, 0-100.',
          },
        },
        required: ['inspoPieceIndex', 'closetItemId', 'matchScore'],
        additionalProperties: false,
      },
    },
    missingPieces: {
      type: 'array',
      description:
        'Inspiration pieces with no good match in the closet, and what to look for instead.',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: CLOSET_ITEM_TYPES,
            description: 'Broad garment type of the missing piece.',
          },
          color: { type: 'string', description: 'Colour it should be.' },
          style: { type: 'string', description: 'Style descriptors.' },
          suggestion: {
            type: 'string',
            description:
              'One sentence on what to buy or substitute to close this gap.',
          },
        },
        required: ['type', 'color', 'style', 'suggestion'],
        additionalProperties: false,
      },
    },
    matchReasons: {
      type: 'array',
      items: { type: 'string' },
      description: `Up to ${MAX_MATCH_REASONS} short phrases explaining why the wardrobe does or doesn't capture the look, e.g. "Similar colour palette", "Matching silhouette".`,
    },
  },
  required: [
    'overallMatchPercentage',
    'matchedPieces',
    'missingPieces',
    'matchReasons',
  ],
  additionalProperties: false,
} as const;

export const INSPO_MATCH_SYSTEM_PROMPT =
  "You are CheckoutFitt's look-recreation stylist. Given an inspiration outfit and a person's real wardrobe, you find the closest thing they already own for each piece and are honest about what they're missing. A loose substitute that still reads as the same look is a good match; a different garment type is not.";

export interface InspirationClosetItem {
  id: string;
  type: string;
  category: string;
  color: string;
  tags: string[];
}

export function buildInspirationMatchPrompt(params: {
  pieces: InspoPiece[];
  vibe: string;
  items: InspirationClosetItem[];
  totalItems: number;
}): string {
  const inspoList = params.pieces
    .map(
      (piece, index) =>
        `${index}. ${piece.color} ${piece.type}${piece.style ? ` — ${piece.style}` : ''}`,
    )
    .join('\n');

  const inventory = params.items.length
    ? params.items
        .map(
          (item) =>
            `- id: ${item.id} | ${item.color} ${item.category} (${item.type})${item.tags.length ? ` [${item.tags.join(', ')}]` : ''}`,
        )
        .join('\n')
    : '(the closet is currently empty)';

  const truncated =
    params.totalItems > params.items.length
      ? `\n(Showing ${params.items.length} of ${params.totalItems} items.)`
      : '';

  return [
    'Work out how closely this person could recreate an inspiration outfit from their own wardrobe.',
    `The look: ${params.vibe}`,
    `Its pieces, numbered:\n${inspoList}`,
    `What they own:\n${inventory}${truncated}`,
    'Match each inspiration piece to the closest item they own, referring to pieces by their number. Note which pieces have no good match, and give an overall percentage for how well the wardrobe captures the look.',
  ].join('\n\n');
}
