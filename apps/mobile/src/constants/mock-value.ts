import type { ValuedItem } from "@/types";

export const VALUED_ITEMS: ValuedItem[] = [
  { id: "v1", label: "Wool Trench Coat", category: "outerwear", colorHex: "#B08D57", value: 420, wears: 38 },
  { id: "v2", label: "Cropped Blazer", category: "outerwear", colorHex: "#17130F", value: 260, wears: 26 },
  { id: "v3", label: "Chelsea Boots", category: "shoes", colorHex: "#17130F", value: 245, wears: 71 },
  { id: "v4", label: "Leather Loafers", category: "shoes", colorHex: "#6E2A32", value: 190, wears: 44 },
  { id: "v5", label: "Tailored Trousers", category: "bottom", colorHex: "#17130F", value: 165, wears: 52 },
  { id: "v6", label: "Slip Dress", category: "dress", colorHex: "#6E2A32", value: 140, wears: 9 },
  { id: "v7", label: "Straight Leg Jeans", category: "bottom", colorHex: "#2B3A55", value: 120, wears: 88 },
  { id: "v8", label: "Denim Jacket", category: "outerwear", colorHex: "#5A7691", value: 115, wears: 31 },
  { id: "v9", label: "White Poplin Shirt", category: "top", colorHex: "#EFE9DF", value: 95, wears: 64 },
  { id: "v10", label: "Merino Crewneck", category: "top", colorHex: "#6B6E4E", value: 88, wears: 19 },
  { id: "v11", label: "Leather Tote", category: "accessory", colorHex: "#857A70", value: 210, wears: 57 },
  { id: "v12", label: "Wide-Leg Chinos", category: "bottom", colorHex: "#D9C7A8", value: 78, wears: 41 },
  { id: "v13", label: "White Sneakers", category: "shoes", colorHex: "#EFE9DF", value: 92, wears: 96 },
  { id: "v14", label: "Wool Scarf", category: "accessory", colorHex: "#6E2A32", value: 55, wears: 22 },
  { id: "v15", label: "Leather Belt", category: "accessory", colorHex: "#C0451F", value: 62, wears: 48 },
];

export const CURRENCY = "$";

export function costPerWear(item: ValuedItem): number {
  return item.value / Math.max(1, item.wears);
}

export function formatMoney(amount: number, decimals = 0): string {
  return `${CURRENCY}${amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}
