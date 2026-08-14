export type ClosetCategory = "top" | "bottom" | "outerwear" | "dress" | "shoes" | "accessory";

export type ClosetItem = {
  id: string;
  type: string;
  category: ClosetCategory;
  color: string;
  colorHex: string;
  imageUri?: string;
  favorite: boolean;
  archived: boolean;
};

export type OutfitItem = {
  id: string;
  label: string;
  category: ClosetCategory;
  colorHex: string;
};

export type OutfitContext =
  | "Casual"
  | "Office"
  | "Date Night"
  | "Meeting"
  | "Weekend";

export type Outfit = {
  id: string;
  context: string;
  title: string;
  reason: string;
  items: OutfitItem[];
};

export type Occasion = {
  key: string;
  label: string;
  description: string;
  icon: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  imageUri?: string;
  outfit?: Outfit;
  createdAt: number;
};

export type WeatherData = {
  location: string;
  tempF: number;
  condition: string;
  rainChance: number;
  windMph: number;
  uvIndex: number;
};

// ── Phase 2: personalisation ────────────────────────────────────────────────

export type StyleArchetype = {
  key: string;
  name: string;
  tagline: string;
  summary: string;
  /** 0–100 confidence from the mock closet analysis. */
  confidence: number;
  traits: { label: string; value: number }[];
  signatureColors: { name: string; hex: string }[];
  wearsWell: string[];
  avoid: string[];
};

export type CoachTip = {
  id: string;
  title: string;
  body: string;
  category: "fit" | "color" | "layering" | "care" | "habit";
  /** Marks the tip as this week's focus. */
  featured?: boolean;
};

export type RatingBreakdown = {
  label: string;
  score: number;
  hint: string;
};

export type OutfitRating = {
  overall: number;
  verdict: string;
  summary: string;
  breakdown: RatingBreakdown[];
  improvements: string[];
};

export type PlannedOutfit = {
  /** ISO `YYYY-MM-DD`. */
  date: string;
  outfit: Outfit;
  note?: string;
};

export type WardrobeGap = {
  id: string;
  item: string;
  category: ClosetCategory;
  /** Higher = more urgent. 0–100. */
  priority: number;
  reason: string;
  unlocks: number;
  priceRange: string;
};

export type ColorSeason = {
  season: string;
  undertone: string;
  contrast: string;
  summary: string;
  best: { name: string; hex: string }[];
  avoid: { name: string; hex: string }[];
  metals: string;
};

// ── Phase 3: expansion & commerce ───────────────────────────────────────────

export type ShoppingVerdict = {
  verdict: "buy" | "skip" | "maybe";
  headline: string;
  reasoning: string;
  outfitsUnlocked: number;
  costPerWear: string;
  versatility: number;
  pairsWith: OutfitItem[];
};

export type CapsulePlan = {
  itemCount: number;
  combinations: number;
  occasions: string[];
  items: OutfitItem[];
  coverage: { label: string; score: number }[];
};

export type PackingList = {
  destination: string;
  startDate: string;
  endDate: string;
  weatherNote: string;
  categories: { label: string; items: { id: string; label: string; qty: number }[] }[];
  outfitPlan: { day: string; label: string; items: OutfitItem[] }[];
};

export type RecreationMatch = {
  id: string;
  inspoLabel: string;
  ownedItem: OutfitItem;
  match: number;
  note: string;
};

export type ValuedItem = {
  id: string;
  label: string;
  category: ClosetCategory;
  colorHex: string;
  value: number;
  wears: number;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  icon: "sparkles" | "sun" | "heart" | "bell" | "crown";
};
