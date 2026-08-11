export interface ChatToolDefinition {
  name: string;
  description: string;
  /** Plain JSON Schema — translated into each vendor's native tool-definition shape by the provider. */
  inputSchema: Record<string, unknown>;
}

export interface ChatToolCall {
  name: string;
  input: Record<string, unknown>;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatParams {
  systemPrompt: string;
  history: ChatHistoryMessage[];
  userMessage: string;
  /** URL of an image the user attached to this message, if any. */
  imageUrl?: string;
  tools: ChatToolDefinition[];
}

export interface ChatResult {
  /** Present when the model answered directly without needing a tool. */
  text: string | null;
  /** Present when the model chose to call a tool instead of answering directly (at most one, by design — see ChatService). */
  toolCall: ChatToolCall | null;
}

export interface StreamChatParams {
  systemPrompt: string;
  history: ChatHistoryMessage[];
  userMessage: string;
  onDelta: (chunk: string) => void;
}
