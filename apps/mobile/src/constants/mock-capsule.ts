import type { CapsulePlan, OutfitItem } from "@/types";

export const CAPSULE_SIZES = [8, 12, 16, 20] as const;

export const CAPSULE_OCCASIONS = [
  "Everyday",
  "Office",
  "Evening",
  "Weekend",
  "Travel",
] as const;

const POOL: OutfitItem[] = [
  { id: "k1", label: "White Poplin Shirt", category: "top", colorHex: "#EFE9DF" },
  { id: "k2", label: "Merino Crewneck", category: "top", colorHex: "#6B6E4E" },
  { id: "k3", label: "Striped Long Sleeve", category: "top", colorHex: "#2B3A55" },
  { id: "k4", label: "Silk Camisole", category: "top", colorHex: "#B08D57" },
  { id: "k5", label: "Tailored Trousers", category: "bottom", colorHex: "#17130F" },
  { id: "k6", label: "Straight Leg Jeans", category: "bottom", colorHex: "#2B3A55" },
  { id: "k7", label: "Pleated Midi Skirt", category: "bottom", colorHex: "#6E2A32" },
  { id: "k8", label: "Wide-Leg Chinos", category: "bottom", colorHex: "#D9C7A8" },
  { id: "k9", label: "Wool Trench Coat", category: "outerwear", colorHex: "#B08D57" },
  { id: "k10", label: "Cropped Blazer", category: "outerwear", colorHex: "#17130F" },
  { id: "k11", label: "Denim Jacket", category: "outerwear", colorHex: "#5A7691" },
  { id: "k12", label: "Slip Dress", category: "dress", colorHex: "#17130F" },
  { id: "k13", label: "Leather Loafers", category: "shoes", colorHex: "#6E2A32" },
  { id: "k14", label: "White Sneakers", category: "shoes", colorHex: "#EFE9DF" },
  { id: "k15", label: "Chelsea Boots", category: "shoes", colorHex: "#17130F" },
  { id: "k16", label: "Leather Belt", category: "accessory", colorHex: "#C0451F" },
  { id: "k17", label: "Wool Scarf", category: "accessory", colorHex: "#6E2A32" },
  { id: "k18", label: "Minimal Watch", category: "accessory", colorHex: "#17130F" },
  { id: "k19", label: "Leather Tote", category: "accessory", colorHex: "#857A70" },
  { id: "k20", label: "Gold Hoops", category: "accessory", colorHex: "#B08D57" },
];

export function generateCapsule(itemCount: number, occasions: string[]): CapsulePlan {
  const items = POOL.slice(0, itemCount);

  const tops = items.filter((i) => i.category === "top").length;
  const bottoms = items.filter((i) => i.category === "bottom").length;
  const layers = items.filter((i) => i.category === "outerwear").length;
  const shoes = items.filter((i) => i.category === "shoes").length;

  // Rough combinatorial estimate: every top × bottom, multiplied by layering and
  // footwear options, plus standalone dresses.
  const dresses = items.filter((i) => i.category === "dress").length;
  const combinations =
    tops * bottoms * Math.max(1, layers) * Math.max(1, shoes) + dresses * Math.max(1, shoes);

  return {
    itemCount,
    combinations,
    occasions,
    items,
    coverage: [
      { label: "Everyday", score: Math.min(98, 55 + itemCount * 2) },
      { label: "Office", score: occasions.includes("Office") ? Math.min(95, 40 + itemCount * 3) : 48 },
      { label: "Evening", score: occasions.includes("Evening") ? Math.min(92, 35 + itemCount * 3) : 41 },
      { label: "Weekend", score: Math.min(96, 60 + itemCount * 2) },
    ],
  };
}
