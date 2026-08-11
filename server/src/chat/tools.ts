import { ChatToolDefinition } from '../ai/llm/chat-provider.interface';
import { CLOSET_ITEM_TYPES } from '../closet/constants';
import { OUTFIT_CONTEXTS } from '../outfit/constants';

export const LIST_CLOSET_ITEMS_TOOL: ChatToolDefinition = {
  name: 'list_closet_items',
  description:
    "List the user's closet items, optionally filtered by garment type. Use this when you need to know what the user owns before answering — e.g. checking whether they have a certain item.",
  inputSchema: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: CLOSET_ITEM_TYPES,
        description: 'Optional garment type filter',
      },
    },
    additionalProperties: false,
  },
};

export const GENERATE_OUTFIT_TOOL: ChatToolDefinition = {
  name: 'generate_outfit',
  description:
    "Generate a complete outfit suggestion from the user's closet for a given occasion. Use this whenever the user asks what to wear, for outfit ideas, or styling help for an occasion — do not describe an outfit yourself without calling this.",
  inputSchema: {
    type: 'object',
    properties: {
      context: {
        type: 'string',
        enum: OUTFIT_CONTEXTS,
        description: 'The occasion to generate the outfit for',
      },
    },
    required: ['context'],
    additionalProperties: false,
  },
};

export const CHAT_TOOLS: ChatToolDefinition[] = [
  LIST_CLOSET_ITEMS_TOOL,
  GENERATE_OUTFIT_TOOL,
];
