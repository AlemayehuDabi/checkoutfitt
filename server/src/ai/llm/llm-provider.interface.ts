import {
  ChatParams,
  ChatResult,
  StreamChatParams,
} from './chat-provider.interface';

export interface OutfitItemCandidate {
  id: string;
  type: string;
  category: string;
  color: string;
  tags: string[];
}

export interface GeneratedOutfit {
  itemIds: string[];
  explanation: string;
}

export interface GenerateOutfitParams {
  context: string;
  items: OutfitItemCandidate[];
  /** Item IDs from a previous generation to steer away from, for shuffle. */
  excludeItemIds?: string[];
  /**
   * Extra prompt guidance layered on top of the base instructions — e.g.
   * today's weather (Phase 5) or occasion-specific tone like "dress
   * conservatively" for an interview (Phase 6). Not exposed to API callers
   * directly; other services pass it in when they call LLMService.
   */
  extraInstructions?: string;
}

export interface LLMProvider {
  generateOutfit(params: GenerateOutfitParams): Promise<GeneratedOutfit>;
  chat(params: ChatParams): Promise<ChatResult>;
  streamChat(params: StreamChatParams): Promise<string>;
}

/** Shared across all three providers so swapping LLM_PROVIDER never changes the response shape. */
export const OUTFIT_JSON_SCHEMA = {
  type: 'object',
  properties: {
    itemIds: {
      type: 'array',
      items: { type: 'string' },
      description:
        'IDs, taken from the provided closet items list, of the 2-6 items that form this outfit.',
    },
    explanation: {
      type: 'string',
      description:
        'A short (1-3 sentence), friendly explanation of why these pieces work together for the occasion.',
    },
  },
  required: ['itemIds', 'explanation'],
  additionalProperties: false,
} as const;

export function buildOutfitPrompt(params: GenerateOutfitParams): string {
  const itemsList = params.items
    .map(
      (item) =>
        `- id: ${item.id} | type: ${item.type} | category: ${item.category} | color: ${item.color} | tags: ${item.tags.join(', ')}`,
    )
    .join('\n');

  const sections = [
    `Assemble a coherent outfit for a "${params.context}" occasion using ONLY items from the closet list below.`,
    'Select between 2 and 6 items that work well together as a complete outfit (for example, do not pick two tops with no bottom).',
    `Closet items:\n${itemsList}`,
  ];

  if (params.excludeItemIds?.length) {
    sections.push(
      `Avoid reproducing this exact combination of item IDs: ${params.excludeItemIds.join(', ')}. Pick a meaningfully different combination.`,
    );
  }
  if (params.extraInstructions) {
    sections.push(params.extraInstructions);
  }
  sections.push(
    'Respond with the chosen item IDs and a short explanation of why they work together.',
  );

  return sections.join('\n\n');
}
