import type { ClosetCategory, Outfit, OutfitItem } from "@/types";

export const OUTFIT_CONTEXTS: { key: string; label: string; icon: string }[] = [
  { key: "Casual", label: "Casual", icon: "coffee" },
  { key: "Office", label: "Office", icon: "briefcase" },
  { key: "Date Night", label: "Date Night", icon: "martini" },
  { key: "Meeting", label: "Meeting", icon: "presentation" },
  { key: "Weekend", label: "Weekend", icon: "sun" },
];

const ITEM_POOL: Record<ClosetCategory, { label: string; colorHex: string }[]> = {
  top: [
    { label: "White Poplin Shirt", colorHex: "#F5F1EA" },
    { label: "Ribbed Knit Sweater", colorHex: "#6B6E4E" },
    { label: "Black Tank Top", colorHex: "#1A1917" },
    { label: "Striped Tee", colorHex: "#5A7691" },
  ],
  bottom: [
    { label: "Tailored Trousers", colorHex: "#1A1917" },
    { label: "Straight Leg Jeans", colorHex: "#2B3A55" },
    { label: "Pleated Midi Skirt", colorHex: "#6E2A32" },
    { label: "Wide-Leg Chinos", colorHex: "#D9C7A8" },
  ],
  outerwear: [
    { label: "Wool Trench Coat", colorHex: "#D9C7A8" },
    { label: "Cropped Blazer", colorHex: "#1A1917" },
    { label: "Denim Jacket", colorHex: "#5A7691" },
  ],
  dress: [
    { label: "Wrap Midi Dress", colorHex: "#6E2A32" },
    { label: "Slip Dress", colorHex: "#1A1917" },
  ],
  shoes: [
    { label: "Leather Loafers", colorHex: "#6E2A32" },
    { label: "White Sneakers", colorHex: "#F5F1EA" },
    { label: "Chelsea Boots", colorHex: "#1A1917" },
    { label: "Strappy Heels", colorHex: "#C1622D" },
  ],
  accessory: [
    { label: "Gold Hoop Earrings", colorHex: "#C1622D" },
    { label: "Leather Tote", colorHex: "#8A8580" },
    { label: "Silk Scarf", colorHex: "#6E2A32" },
    { label: "Minimal Watch", colorHex: "#1A1917" },
  ],
};

const REASON_TEMPLATES: Record<string, string[]> = {
  Casual: [
    "Relaxed layers and easy fabrics keep this comfortable without looking undone — great for running around or grabbing coffee.",
    "A laid-back palette and soft textures make this feel effortless while still put-together.",
  ],
  Office: [
    "Clean lines and a neutral palette read as polished and professional without feeling stiff.",
    "Tailored pieces balance comfort and structure — sharp enough for meetings, easy enough for a full day at your desk.",
  ],
  "Date Night": [
    "A richer color story and elevated silhouette add just enough polish for an evening out.",
    "This pairing leans a little more elevated with a flattering silhouette that photographs well in low light.",
  ],
  Meeting: [
    "A structured silhouette and muted tones project confidence without pulling focus.",
    "Sharp tailoring keeps this feeling authoritative while staying comfortable for back-to-back conversations.",
  ],
  Weekend: [
    "Breathable layers and a relaxed fit are built for wherever the day takes you.",
    "Nothing precious here — just an easy, weather-flexible combination for your two days off.",
  ],
};

let outfitCounter = 0;
function nextOutfitId() {
  outfitCounter += 1;
  return `outfit-${Date.now()}-${outfitCounter}`;
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildItem(category: ClosetCategory): OutfitItem {
  const entry = pick(ITEM_POOL[category]);
  return { id: `${category}-${Math.random().toString(36).slice(2, 8)}`, category, ...entry };
}

export function generateOutfit(context: string): Outfit {
  const items: OutfitItem[] = [];
  const useDress = Math.random() < 0.3;

  if (useDress) {
    items.push(buildItem("dress"));
  } else {
    items.push(buildItem("top"));
    items.push(buildItem("bottom"));
  }
  if (Math.random() < 0.55) items.push(buildItem("outerwear"));
  items.push(buildItem("shoes"));
  if (Math.random() < 0.7) items.push(buildItem("accessory"));

  const reasons = REASON_TEMPLATES[context] ?? REASON_TEMPLATES.Casual;

  return {
    id: nextOutfitId(),
    context,
    title: `${context} Look`,
    reason: pick(reasons),
    items,
  };
}

export function generateOutfits(context: string, count = 3): Outfit[] {
  return Array.from({ length: count }, () => generateOutfit(context));
}
