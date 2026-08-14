import type { CoachTip, StyleArchetype } from "@/types";

/** Candidate archetypes the mock analyser can land on. */
export const STYLE_ARCHETYPES: StyleArchetype[] = [
  {
    key: "modern-minimalist",
    name: "Modern Minimalist",
    tagline: "Quiet pieces, sharp lines",
    summary:
      "You build outfits from a tight palette and let cut do the talking. Your closet leans neutral, structured and repeatable — the same core pieces reworked rather than a wide rotation.",
    confidence: 87,
    traits: [
      { label: "Neutral palette", value: 92 },
      { label: "Structured silhouettes", value: 78 },
      { label: "Pattern appetite", value: 24 },
      { label: "Layering", value: 64 },
    ],
    signatureColors: [
      { name: "Bone", hex: "#EFE9DF" },
      { name: "Ink", hex: "#17130F" },
      { name: "Stone", hex: "#B4A99A" },
      { name: "Olive", hex: "#6B6E4E" },
    ],
    wearsWell: [
      "Monochrome column dressing",
      "Straight-leg tailoring",
      "One considered accessory",
    ],
    avoid: ["Busy prints", "Boxy oversized layers", "High-shine finishes"],
  },
  {
    key: "old-money",
    name: "Quiet Classic",
    tagline: "Heritage, unbranded",
    summary:
      "Your closet reads as considered and timeless — natural fibres, muted tones and pieces that look better after a few years rather than worse.",
    confidence: 81,
    traits: [
      { label: "Neutral palette", value: 84 },
      { label: "Structured silhouettes", value: 88 },
      { label: "Pattern appetite", value: 41 },
      { label: "Layering", value: 72 },
    ],
    signatureColors: [
      { name: "Camel", hex: "#B08D57" },
      { name: "Navy", hex: "#2B3A55" },
      { name: "Cream", hex: "#E9E1D6" },
      { name: "Burgundy", hex: "#6E2A32" },
    ],
    wearsWell: ["Knitwear over collars", "Tailored outerwear", "Leather accessories"],
    avoid: ["Logo-forward pieces", "Neon accents", "Technical fabrics"],
  },
  {
    key: "street",
    name: "Street Editorial",
    tagline: "Proportion play",
    summary:
      "You dress with contrast — volume against structure, and a willingness to let one loud piece anchor the whole look.",
    confidence: 76,
    traits: [
      { label: "Neutral palette", value: 48 },
      { label: "Structured silhouettes", value: 52 },
      { label: "Pattern appetite", value: 74 },
      { label: "Layering", value: 89 },
    ],
    signatureColors: [
      { name: "Ink", hex: "#17130F" },
      { name: "Paprika", hex: "#C0451F" },
      { name: "Slate", hex: "#5A7691" },
      { name: "Bone", hex: "#EFE9DF" },
    ],
    wearsWell: ["Oversized over slim", "Statement footwear", "Tonal layering"],
    avoid: ["Matchy tailoring", "Fussy detailing", "Overly formal shoes"],
  },
];

/** The archetype the mock analysis resolves to for this user. */
export const CURRENT_ARCHETYPE = STYLE_ARCHETYPES[0];

export const COACH_TIPS: CoachTip[] = [
  {
    id: "t1",
    title: "Break the neutral streak",
    body: "Eleven of your last fifteen outfits stayed inside three tones. One saturated piece — the rust belt or the burgundy slip — would sharpen the whole rotation without fighting your palette.",
    category: "color",
    featured: true,
  },
  {
    id: "t2",
    title: "Your trousers are doing the heavy lifting",
    body: "The wide-leg pants appear in 40% of saved outfits. Rotating in the straight-leg jeans for casual contexts spreads the wear and keeps both looking newer for longer.",
    category: "habit",
  },
  {
    id: "t3",
    title: "Try a third layer",
    body: "Most of your looks stop at two pieces. A light overshirt between top and coat adds depth without changing the silhouette you already like.",
    category: "layering",
  },
  {
    id: "t4",
    title: "Hem length is costing you height",
    body: "On the wide-leg pants, a break just above the shoe opens up the leg line — worth a tailor visit before autumn.",
    category: "fit",
  },
  {
    id: "t5",
    title: "Rotate your knitwear",
    body: "Wool recovers best with a rest day between wears. Alternating your two sweaters roughly doubles their usable life.",
    category: "care",
  },
];

export const TIP_CATEGORY_LABEL: Record<CoachTip["category"], string> = {
  fit: "Fit",
  color: "Colour",
  layering: "Layering",
  care: "Care",
  habit: "Habit",
};

/** Sequential copy for the analysis screen's fake progress. */
export const COACH_ANALYSIS_STEPS = [
  "Reading your closet…",
  "Clustering colours and silhouettes…",
  "Comparing against style archetypes…",
  "Writing your profile…",
];
