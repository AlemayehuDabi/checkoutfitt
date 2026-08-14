import type { RecreationMatch } from "@/types";

export const INSPO_SOURCES = ["Pinterest", "Instagram", "Celebrity", "Runway"] as const;

export const RECREATION_MATCHES: RecreationMatch[] = [
  {
    id: "r1",
    inspoLabel: "Oversized shirt",
    ownedItem: {
      id: "m1",
      label: "White Poplin Shirt",
      category: "top",
      colorHex: "#EFE9DF",
    },
    match: 92,
    note: "Near-exact match in colour and weight — yours is slightly more fitted.",
  },
  {
    id: "r2",
    inspoLabel: "Wide trousers",
    ownedItem: {
      id: "m2",
      label: "Wide-Leg Chinos",
      category: "bottom",
      colorHex: "#D9C7A8",
    },
    match: 81,
    note: "Same silhouette, half a shade warmer. Reads the same from a distance.",
  },
  {
    id: "r3",
    inspoLabel: "Tan trench",
    ownedItem: {
      id: "m3",
      label: "Wool Trench Coat",
      category: "outerwear",
      colorHex: "#B08D57",
    },
    match: 74,
    note: "Yours is wool rather than cotton gabardine — heavier drape, same line.",
  },
  {
    id: "r4",
    inspoLabel: "Pointed flats",
    ownedItem: {
      id: "m4",
      label: "Leather Loafers",
      category: "shoes",
      colorHex: "#6E2A32",
    },
    match: 58,
    note: "Closest thing you own. A pointed toe would land this properly.",
  },
];

export const RECREATION_SUMMARY = {
  overall: 76,
  headline: "You can get most of the way there",
  body: "Three of the four pieces are close enough to read as the same look. The footwear is the weak link — everything else you already own.",
  missing: "Pointed-toe flat in black or bone",
};

export const RECREATION_ANALYSIS_STEPS = [
  "Reading the reference…",
  "Isolating each garment…",
  "Searching your closet…",
  "Scoring the matches…",
];
