import type { OutfitRating } from "@/types";

/**
 * Deterministic-ish mock rating. `seed` lets the results screen vary slightly
 * between captures so re-shooting feels responsive rather than canned.
 */
export function generateRating(seed = 0): OutfitRating {
  const jitter = (base: number, spread = 6) =>
    Math.max(38, Math.min(97, Math.round(base + ((seed * 37) % (spread * 2)) - spread)));

  const colorHarmony = jitter(88);
  const fit = jitter(74);
  const occasion = jitter(81);
  const proportion = jitter(69);

  const overall = Math.round((colorHarmony + fit + occasion + proportion) / 4);

  return {
    overall,
    verdict: overall >= 85 ? "Sharp" : overall >= 70 ? "Working" : "Needs a tweak",
    summary:
      overall >= 85
        ? "This is one of your strongest looks. The palette is disciplined and the proportions read intentional."
        : overall >= 70
          ? "Solid foundation. A couple of small adjustments would take this from good to genuinely sharp."
          : "The pieces are right but they're fighting each other. Start with the proportion note below.",
    breakdown: [
      {
        label: "Colour harmony",
        score: colorHarmony,
        hint: "Tones sit in the same warm family with enough contrast to separate.",
      },
      {
        label: "Fit",
        score: fit,
        hint: "Shoulder line is clean; the hem is breaking a little long over the shoe.",
      },
      {
        label: "Occasion fit",
        score: occasion,
        hint: "Reads correctly for smart-casual. Would need a swap for anything formal.",
      },
      {
        label: "Proportion",
        score: proportion,
        hint: "Volume on top and bottom is close to matched — one side wants to be leaner.",
      },
    ],
    improvements: [
      "Tuck or half-tuck the top to re-establish a waistline.",
      "Swap to the leather loafers — the sneakers flatten the whole line.",
      "Add the rust belt to bridge the top and trousers.",
    ],
  };
}

export const RATING_CAPTURE_TIPS = [
  "Full-length mirror, phone at chest height",
  "Even light — avoid backlighting from a window",
  "Stand square on so proportions read correctly",
];

export const RATING_ANALYSIS_STEPS = [
  "Detecting garments…",
  "Measuring proportion and drape…",
  "Scoring colour harmony…",
  "Drafting suggestions…",
];
