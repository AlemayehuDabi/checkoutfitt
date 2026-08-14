import type { ColorSeason } from "@/types";

export const COLOR_SEASON: ColorSeason = {
  season: "Warm Autumn",
  undertone: "Warm / golden",
  contrast: "Medium",
  summary:
    "Your skin, hair and eyes sit in a warm, medium-contrast range. Muted earth tones and spice shades read as intentional on you; cold, icy colours drain the warmth out of your face.",
  best: [
    { name: "Paprika", hex: "#C0451F" },
    { name: "Olive", hex: "#6B6E4E" },
    { name: "Camel", hex: "#B08D57" },
    { name: "Rust", hex: "#9E3517" },
    { name: "Cream", hex: "#E9E1D6" },
    { name: "Forest", hex: "#2F6B4F" },
    { name: "Terracotta", hex: "#CE5730" },
    { name: "Bronze", hex: "#8A6A3B" },
  ],
  avoid: [
    { name: "Icy pink", hex: "#F2C6D8" },
    { name: "Cool grey", hex: "#9AA3AC" },
    { name: "Pure white", hex: "#FFFFFF" },
    { name: "Fuchsia", hex: "#B0257A" },
  ],
  metals: "Gold and bronze over silver",
};

export const COLOR_CAPTURE_TIPS = [
  "Natural daylight, facing a window",
  "No makeup or filters if you can help it",
  "Tie hair back so your face and neck are visible",
];

export const COLOR_ANALYSIS_STEPS = [
  "Reading skin undertone…",
  "Measuring hair and eye contrast…",
  "Matching to a seasonal palette…",
  "Building your colour set…",
];
