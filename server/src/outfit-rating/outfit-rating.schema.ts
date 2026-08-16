export interface OutfitRatingPayload {
  colorHarmonyScore: number;
  fitScore: number;
  occasionMatchScore: number;
  suggestions: string[];
}

/**
 * `overallScore` is deliberately absent: it's the mean of the three
 * sub-scores and is computed server-side, so the model can't return a total
 * that contradicts its own parts.
 *
 * See gap-analysis.schema.ts for why every property is `required` with
 * `additionalProperties: false`.
 */
export const OUTFIT_RATING_JSON_SCHEMA = {
  type: 'object',
  properties: {
    colorHarmonyScore: {
      type: 'number',
      description:
        'How well the colors in the outfit work together, 0-10. Consider palette cohesion, contrast and whether any color clashes.',
    },
    fitScore: {
      type: 'number',
      description:
        'How well the clothing appears to fit the wearer, 0-10. Consider proportions, tailoring, and whether pieces look too tight, too loose or well-proportioned.',
    },
    occasionMatchScore: {
      type: 'number',
      description:
        'How well this outfit suits the stated occasion, 0-10. Judge appropriateness of formality and style for that setting.',
    },
    suggestions: {
      type: 'array',
      items: { type: 'string' },
      description:
        'Between 2 and 4 short, specific, actionable improvements. Each one sentence, phrased kindly and constructively.',
    },
  },
  required: [
    'colorHarmonyScore',
    'fitScore',
    'occasionMatchScore',
    'suggestions',
  ],
  additionalProperties: false,
} as const;

export const OUTFIT_RATING_SYSTEM_PROMPT =
  "You are CheckoutFitt's outfit critic. You score a photo of a person's outfit on three independent axes and give constructive, specific feedback. Be honest but encouraging — score genuinely rather than flattering, and never comment on the person's body, appearance or attractiveness, only on the clothing and how it is worn.";

export function buildOutfitRatingPrompt(
  occasion: string | undefined,
  occasionGuidance: string | undefined,
): string {
  const sections = [
    'Rate the outfit worn by the person in this photo.',
    'Score each of these three axes from 0 to 10 independently:\n' +
      '- colorHarmony: do the colors in the outfit work together?\n' +
      '- fit: does the clothing appear to fit the wearer well?\n' +
      `- occasionMatch: does this outfit suit ${
        occasion ? `a "${occasion}" occasion` : 'general everyday wear'
      }?`,
  ];

  if (occasionGuidance) {
    // Reuses the same occasion styling rules the outfit generator applies,
    // so "interview" means the same thing when rating as when generating.
    sections.push(`Occasion context: ${occasionGuidance}`);
  }

  sections.push(
    'Then give a few short, actionable suggestions for improving the look.',
  );

  return sections.join('\n\n');
}
