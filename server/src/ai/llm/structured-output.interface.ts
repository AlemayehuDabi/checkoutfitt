/**
 * Generic structured-output primitive.
 *
 * `generateOutfit` predates this and stays as its own method — it has a fixed
 * schema and a prompt builder of its own. Every *other* structured feature
 * (gap analysis, valuation, ratings, style archetype, shopping verdicts,
 * capsules, packing, inspiration matching) is the same shape of call with a
 * different schema and prompt, so they all route through this one method
 * instead of adding a method per feature to all three providers.
 *
 * Schemas passed here must satisfy the strictest vendor's rules, which is
 * OpenAI's `strict: true`: every object lists all of its properties in
 * `required` and sets `additionalProperties: false`. Optional-in-spirit
 * fields should be modelled as nullable or as an explicit empty value.
 */
export interface StructuredParams {
  /** The user-turn prompt: task, data, and any constraints. */
  prompt: string;
  /** Plain JSON Schema describing the expected response. */
  schema: Record<string, unknown>;
  /** Schema identifier — OpenAI requires a name alongside the schema. */
  schemaName: string;
  /** Optional system/role instructions. */
  systemPrompt?: string;
  /** Hosted image URLs to analyze alongside the prompt. */
  imageUrls?: string[];
  /** Defaults to 2048 where the vendor requires an explicit cap. */
  maxTokens?: number;
}
