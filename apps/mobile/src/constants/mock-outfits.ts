import type { ClosetCategory, Outfit, OutfitItem } from "@/types";

export const OUTFIT_CONTEXTS: { key: string; label: string; icon: string }[] = [
  { key: "Casual", label: "Casual", icon: "coffee" },
  { key: "Office", label: "Office", icon: "briefcase" },
  { key: "Date Night", label: "Date Night", icon: "martini" },
  { key: "Meeting", label: "Meeting", icon: "presentation" },
  { key: "Weekend", label: "Weekend", icon: "sun" },
];

export const OCCASIONS: { key: string; label: string; description: string; icon: string }[] = [
  { key: "Interview", label: "Interview", description: "Sharp and confident", icon: "briefcase" },
  { key: "Wedding Guest", label: "Wedding Guest", description: "Elevated and celebratory", icon: "gem" },
  { key: "Meeting", label: "Meeting", description: "Polished and professional", icon: "presentation" },
  { key: "Party", label: "Party", description: "Fun with a little edge", icon: "party-popper" },
  { key: "Travel", label: "Travel", description: "Comfortable, layered, easy", icon: "plane" },
  { key: "Gym", label: "Gym", description: "Built to move", icon: "dumbbell" },
  { key: "Date Night", label: "Date Night", description: "Effortlessly elevated", icon: "martini" },
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

const GYM_ITEM_POOL: Partial<Record<ClosetCategory, { label: string; colorHex: string }[]>> = {
  top: [
    { label: "Performance Tank", colorHex: "#1A1917" },
    { label: "Moisture-Wicking Tee", colorHex: "#5A7691" },
  ],
  bottom: [
    { label: "Track Joggers", colorHex: "#1A1917" },
    { label: "Compression Leggings", colorHex: "#2B3A55" },
  ],
  shoes: [{ label: "Running Sneakers", colorHex: "#F5F1EA" }],
  accessory: [{ label: "Sport Watch", colorHex: "#1A1917" }],
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
  Interview: [
    "A crisp, tailored fit reads as prepared and detail-oriented without feeling overdone.",
    "Neutral tones and structured pieces keep the focus on you, not the outfit.",
  ],
  "Wedding Guest": [
    "A richer palette and elevated fabric feel celebratory without competing with the couple.",
    "Polished and a little dressed-up — appropriate for photos and comfortable enough to dance.",
  ],
  Party: [
    "A bolder color and statement piece add a little edge to an otherwise easy silhouette.",
    "Just enough shine to stand out without overthinking it.",
  ],
  Travel: [
    "Layerable, wrinkle-forgiving pieces move easily from security lines to your seat.",
    "Comfortable through long stretches of sitting, with layers for changing cabin and climate temps.",
  ],
  Gym: [
    "Breathable, flexible fabric built to move with you through a full session.",
    "Lightweight and sweat-wicking, with room to move for whatever's on today's workout.",
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

function buildItem(category: ClosetCategory, pool: typeof ITEM_POOL | typeof GYM_ITEM_POOL = ITEM_POOL): OutfitItem {
  const options = pool[category] ?? ITEM_POOL[category];
  const entry = pick(options);
  return { id: `${category}-${Math.random().toString(36).slice(2, 8)}`, category, ...entry };
}

export function generateOutfit(context: string): Outfit {
  const items: OutfitItem[] = [];
  const isGym = context === "Gym";
  const pool = isGym ? GYM_ITEM_POOL : ITEM_POOL;
  const useDress = !isGym && Math.random() < 0.3;

  if (useDress) {
    items.push(buildItem("dress", pool));
  } else {
    items.push(buildItem("top", pool));
    items.push(buildItem("bottom", pool));
  }
  if (!isGym && Math.random() < 0.55) items.push(buildItem("outerwear", pool));
  items.push(buildItem("shoes", pool));
  if (Math.random() < 0.7) items.push(buildItem("accessory", pool));

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
