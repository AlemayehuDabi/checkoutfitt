export interface DetectedGarment {
  type: string;
  category: string;
  color: string;
  tags: string[];
}

export interface VisionProvider {
  detectGarment(imageUrl: string): Promise<DetectedGarment>;
}

/**
 * Shared JSON Schema every provider is asked to fill in. Keeping this one
 * schema common to all three keeps their outputs directly comparable and
 * means swapping VISION_PROVIDER never changes the shape callers see.
 */
export const GARMENT_JSON_SCHEMA = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: [
        'top',
        'bottom',
        'outerwear',
        'dress',
        'footwear',
        'accessory',
        'bag',
        'other',
      ],
      description: 'Broad garment category used to assemble outfits.',
    },
    category: {
      type: 'string',
      description:
        'Specific garment category, e.g. "denim jacket", "sneakers", "t-shirt".',
    },
    color: {
      type: 'string',
      description:
        'The single dominant color of the item, in plain English, e.g. "navy blue".',
    },
    tags: {
      type: 'array',
      items: { type: 'string' },
      description:
        'Short style/material descriptors, e.g. ["striped", "cotton", "casual"].',
    },
  },
  required: ['type', 'category', 'color', 'tags'],
  additionalProperties: false,
} as const;

export const GARMENT_DETECTION_PROMPT =
  'Identify the single clothing item in this image. Respond with its broad type, a specific category, its dominant color, and a few short style tags.';
