import { addDays, daysBetween, fromISODate, toISODate } from "@/lib/date";
import type { OutfitItem, PackingList } from "@/types";

export const TRIP_PURPOSES = ["Business", "Leisure", "Mixed", "Event"] as const;

const DAY_LOOKS: { label: string; items: OutfitItem[] }[] = [
  {
    label: "Travel day",
    items: [
      { id: "t1", label: "Merino Crewneck", category: "top", colorHex: "#6B6E4E" },
      { id: "t2", label: "Wide-Leg Chinos", category: "bottom", colorHex: "#D9C7A8" },
      { id: "t3", label: "White Sneakers", category: "shoes", colorHex: "#EFE9DF" },
    ],
  },
  {
    label: "Meetings",
    items: [
      { id: "t4", label: "White Poplin Shirt", category: "top", colorHex: "#EFE9DF" },
      { id: "t5", label: "Tailored Trousers", category: "bottom", colorHex: "#17130F" },
      { id: "t6", label: "Leather Loafers", category: "shoes", colorHex: "#6E2A32" },
    ],
  },
  {
    label: "Dinner",
    items: [
      { id: "t7", label: "Slip Dress", category: "dress", colorHex: "#17130F" },
      { id: "t8", label: "Cropped Blazer", category: "outerwear", colorHex: "#17130F" },
      { id: "t9", label: "Chelsea Boots", category: "shoes", colorHex: "#17130F" },
    ],
  },
  {
    label: "Exploring",
    items: [
      { id: "t10", label: "Striped Long Sleeve", category: "top", colorHex: "#2B3A55" },
      { id: "t11", label: "Straight Leg Jeans", category: "bottom", colorHex: "#2B3A55" },
      { id: "t12", label: "Denim Jacket", category: "outerwear", colorHex: "#5A7691" },
    ],
  },
];

export function generatePackingList(
  destination: string,
  startDate: string,
  purpose: string
): PackingList {
  const nights = 4;
  const endDate = toISODate(addDays(fromISODate(startDate), nights));
  const days = Math.max(1, daysBetween(startDate, endDate) + 1);

  return {
    destination,
    startDate,
    endDate,
    weatherNote:
      "12–18°C with rain on two days — pack a light waterproof layer and avoid suede.",
    categories: [
      {
        label: "Tops",
        items: [
          { id: "c1", label: "Poplin shirt", qty: 2 },
          { id: "c2", label: "Merino crewneck", qty: 1 },
          { id: "c3", label: "Long sleeve tee", qty: 2 },
        ],
      },
      {
        label: "Bottoms",
        items: [
          { id: "c4", label: "Tailored trousers", qty: 1 },
          { id: "c5", label: "Straight leg jeans", qty: 1 },
          { id: "c6", label: "Chinos", qty: 1 },
        ],
      },
      {
        label: "Layers",
        items: [
          { id: "c7", label: "Cropped blazer", qty: 1 },
          { id: "c8", label: "Light waterproof", qty: 1 },
        ],
      },
      {
        label: "Shoes",
        items: [
          { id: "c9", label: "Leather loafers", qty: 1 },
          { id: "c10", label: "White sneakers", qty: 1 },
        ],
      },
      {
        label: "Accessories",
        items: [
          { id: "c11", label: "Leather belt", qty: 1 },
          { id: "c12", label: "Wool scarf", qty: 1 },
          { id: "c13", label: "Compact umbrella", qty: 1 },
        ],
      },
    ],
    outfitPlan: Array.from({ length: days }, (_, i) => {
      const look = DAY_LOOKS[i % DAY_LOOKS.length];
      return {
        day: toISODate(addDays(fromISODate(startDate), i)),
        // Business trips lead with meetings; leisure leads with exploring.
        label: purpose === "Business" && i === 1 ? "Meetings" : look.label,
        items: look.items,
      };
    }),
  };
}

export const PACKING_ANALYSIS_STEPS = [
  "Checking the forecast…",
  "Choosing a travel palette…",
  "Maximising re-wear…",
  "Building your list…",
];
