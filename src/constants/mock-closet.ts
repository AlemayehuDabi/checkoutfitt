import type { ClosetCategory, ClosetItem } from "@/types";

export const CLOSET_CATEGORIES: { key: ClosetCategory; label: string }[] = [
  { key: "top", label: "Tops" },
  { key: "bottom", label: "Bottoms" },
  { key: "outerwear", label: "Outerwear" },
  { key: "dress", label: "Dresses" },
  { key: "shoes", label: "Shoes" },
  { key: "accessory", label: "Accessories" },
];

export const DETECTED_TYPES_BY_CATEGORY: Record<ClosetCategory, string[]> = {
  top: ["T-Shirt", "Button-Up Shirt", "Sweater", "Blouse", "Tank Top"],
  bottom: ["Jeans", "Chinos", "Trousers", "Shorts", "Wide-Leg Pants"],
  outerwear: ["Denim Jacket", "Trench Coat", "Blazer", "Bomber Jacket", "Wool Coat"],
  dress: ["Slip Dress", "Wrap Dress", "Shirt Dress", "Midi Dress"],
  shoes: ["Sneakers", "Loafers", "Chelsea Boots", "Sandals", "Heels"],
  accessory: ["Leather Belt", "Tote Bag", "Sunglasses", "Wool Scarf", "Watch"],
};

export const CLOSET_COLORS: { name: string; hex: string }[] = [
  { name: "Black", hex: "#1A1917" },
  { name: "White", hex: "#F5F1EA" },
  { name: "Beige", hex: "#D9C7A8" },
  { name: "Olive", hex: "#6B6E4E" },
  { name: "Navy", hex: "#2B3A55" },
  { name: "Rust", hex: "#C1622D" },
  { name: "Grey", hex: "#8A8580" },
  { name: "Denim", hex: "#5A7691" },
  { name: "Cream", hex: "#EDE7DD" },
  { name: "Burgundy", hex: "#6E2A32" },
];

export const INITIAL_CLOSET_ITEMS: ClosetItem[] = [
  { id: "c1", type: "Button-Up Shirt", category: "top", color: "White", colorHex: "#F5F1EA", favorite: true, archived: false },
  { id: "c2", type: "Wide-Leg Pants", category: "bottom", color: "Beige", colorHex: "#D9C7A8", favorite: false, archived: false },
  { id: "c3", type: "Denim Jacket", category: "outerwear", color: "Denim", colorHex: "#5A7691", favorite: false, archived: false },
  { id: "c4", type: "Slip Dress", category: "dress", color: "Burgundy", colorHex: "#6E2A32", favorite: true, archived: false },
  { id: "c5", type: "Chelsea Boots", category: "shoes", color: "Black", colorHex: "#1A1917", favorite: false, archived: false },
  { id: "c6", type: "Leather Belt", category: "accessory", color: "Rust", colorHex: "#C1622D", favorite: false, archived: false },
  { id: "c7", type: "Sweater", category: "top", color: "Olive", colorHex: "#6B6E4E", favorite: false, archived: false },
  { id: "c8", type: "Jeans", category: "bottom", color: "Navy", colorHex: "#2B3A55", favorite: true, archived: false },
  { id: "c9", type: "Sneakers", category: "shoes", color: "Cream", colorHex: "#EDE7DD", favorite: false, archived: false },
  { id: "c10", type: "Trench Coat", category: "outerwear", color: "Beige", colorHex: "#D9C7A8", favorite: false, archived: false },
  { id: "c11", type: "Tote Bag", category: "accessory", color: "Grey", colorHex: "#8A8580", favorite: false, archived: false },
  { id: "c12", type: "T-Shirt", category: "top", color: "Black", colorHex: "#1A1917", favorite: false, archived: false },
];

export function randomDetection(category: ClosetCategory) {
  const types = DETECTED_TYPES_BY_CATEGORY[category];
  const type = types[Math.floor(Math.random() * types.length)];
  const color = CLOSET_COLORS[Math.floor(Math.random() * CLOSET_COLORS.length)];
  return { type, color };
}
