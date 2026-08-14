import type { WardrobeGap } from "@/types";

export const WARDROBE_GAPS: WardrobeGap[] = [
  {
    id: "g1",
    item: "Neutral crewneck knit",
    category: "top",
    priority: 92,
    reason:
      "You have no mid-weight knit. It's the missing link between your shirts and your outerwear for eight months of the year.",
    unlocks: 14,
    priceRange: "$70 – $140",
  },
  {
    id: "g2",
    item: "Dark straight-leg denim",
    category: "bottom",
    priority: 84,
    reason:
      "Your only denim is a light wash, which caps how dressed-up a casual look can go. A dark rinse covers evening and smart-casual.",
    unlocks: 11,
    priceRange: "$90 – $180",
  },
  {
    id: "g3",
    item: "Leather derby or loafer",
    category: "shoes",
    priority: 71,
    reason:
      "Every saved office outfit currently resolves to the same Chelsea boots. A second smart shoe doubles your formal rotation.",
    unlocks: 9,
    priceRange: "$130 – $260",
  },
  {
    id: "g4",
    item: "Lightweight overshirt",
    category: "outerwear",
    priority: 58,
    reason:
      "Your layering jumps straight from shirt to heavy jacket. An overshirt fills the transitional gap.",
    unlocks: 7,
    priceRange: "$80 – $150",
  },
  {
    id: "g5",
    item: "Tonal scarf",
    category: "accessory",
    priority: 34,
    reason: "Low urgency, but the fastest way to add texture to an otherwise flat winter look.",
    unlocks: 4,
    priceRange: "$30 – $70",
  },
];

/** Category coverage used for the summary meters. */
export const GAP_COVERAGE = [
  { label: "Tops", score: 78 },
  { label: "Bottoms", score: 54 },
  { label: "Outerwear", score: 61 },
  { label: "Shoes", score: 42 },
  { label: "Accessories", score: 35 },
];

export const WARDROBE_HEALTH = 62;
