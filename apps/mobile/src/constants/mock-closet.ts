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
  { name: "Black", hex: "#17130F" },
  { name: "White", hex: "#F2ECE3" },
  { name: "Beige", hex: "#D9C7A8" },
  { name: "Olive", hex: "#6B6E4E" },
  { name: "Navy", hex: "#2B3A55" },
  { name: "Rust", hex: "#C0451F" },
  { name: "Grey", hex: "#857A70" },
  { name: "Denim", hex: "#5A7691" },
  { name: "Cream", hex: "#E9E1D6" },
  { name: "Burgundy", hex: "#6E2A32" },
];

export const INITIAL_CLOSET_ITEMS: ClosetItem[] = [
  { id: "c1", type: "Button-Up Shirt", category: "top", color: "White", colorHex: "#F2ECE3", favorite: true, archived: false },
  { id: "c2", type: "Wide-Leg Pants", category: "bottom", color: "Beige", colorHex: "#D9C7A8", favorite: false, archived: false },
  { id: "c3", type: "Denim Jacket", category: "outerwear", color: "Denim", colorHex: "#5A7691", favorite: false, archived: false },
  { id: "c4", type: "Slip Dress", category: "dress", color: "Burgundy", colorHex: "#6E2A32", favorite: true, archived: false },
  { id: "c5", type: "Chelsea Boots", category: "shoes", color: "Black", colorHex: "#17130F", favorite: false, archived: false },
  { id: "c6", type: "Leather Belt", category: "accessory", color: "Rust", colorHex: "#C0451F", favorite: false, archived: false },
  { id: "c7", type: "Sweater", category: "top", color: "Olive", colorHex: "#6B6E4E", favorite: false, archived: false },
  { id: "c8", type: "Jeans", category: "bottom", color: "Navy", colorHex: "#2B3A55", favorite: true, archived: false },
  { id: "c9", type: "Sneakers", category: "shoes", color: "Cream", colorHex: "#E9E1D6", favorite: false, archived: false },
  { id: "c10", type: "Trench Coat", category: "outerwear", color: "Beige", colorHex: "#D9C7A8", favorite: false, archived: false },
  { id: "c11", type: "Tote Bag", category: "accessory", color: "Grey", colorHex: "#857A70", favorite: false, archived: false },
  { id: "c12", type: "T-Shirt", category: "top", color: "Black", colorHex: "#17130F", favorite: false, archived: false },
];

export function randomDetection(category: ClosetCategory) {
  const types = DETECTED_TYPES_BY_CATEGORY[category];
  const type = types[Math.floor(Math.random() * types.length)];
  const color = CLOSET_COLORS[Math.floor(Math.random() * CLOSET_COLORS.length)];
  return { type, color };
}
