/**
 * Mock data for the UI build.
 *
 * Shapes mirror the NestJS API responses (server/src/**) so wiring this up
 * later is a matter of swapping the constant for a fetch, not reshaping
 * components. Field names, enum casing, and envelope shapes all match the
 * backend: closet items use UPPERCASE `type`/`status`, list endpoints return
 * `{ items, total, page, limit }`, and IDs are cuid-like strings.
 */

// ---------------------------------------------------------------------------
// Enums — mirror prisma/schema.prisma
// ---------------------------------------------------------------------------

export type ClosetItemType =
  | "TOP"
  | "BOTTOM"
  | "OUTERWEAR"
  | "DRESS"
  | "FOOTWEAR"
  | "ACCESSORY"
  | "BAG"
  | "OTHER";

export type ClosetItemStatus = "PENDING" | "PROCESSING" | "DONE" | "FAILED";

/** OUTFIT_CONTEXTS from server/src/outfit/constants.ts */
export const OUTFIT_CONTEXTS = [
  "casual",
  "office",
  "date_night",
  "meeting",
  "weekend",
  "interview",
  "wedding",
  "party",
  "travel",
  "gym",
] as const;
export type OutfitContext = (typeof OUTFIT_CONTEXTS)[number];

export const CONTEXT_LABELS: Record<OutfitContext, string> = {
  casual: "Casual",
  office: "Office",
  date_night: "Date Night",
  meeting: "Meeting",
  weekend: "Weekend",
  interview: "Interview",
  wedding: "Wedding",
  party: "Party",
  travel: "Travel",
  gym: "Gym",
};

// ---------------------------------------------------------------------------
// Types — mirror API response shapes
// ---------------------------------------------------------------------------

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface MockProfile {
  id: string;
  userId: string;
  genderPresentation: string | null;
  stylePreferences: string[];
  sizeTop: string | null;
  sizeBottom: string | null;
  sizeShoe: string | null;
  onboardingCompleted: boolean;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  styleArchetype: string | null;
  styleTraits: string[] | null;
  styleDescription: string | null;
  styleAnalyzedAt: string | null;
}

export interface MockClosetItem {
  id: string;
  ownerId: string;
  imageUrl: string;
  attachmentId: string | null;
  type: ClosetItemType | null;
  category: string | null;
  color: string | null;
  tags: string[];
  status: ClosetItemStatus;
  failureReason: string | null;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MockOutfit {
  id: string;
  ownerId: string;
  context: OutfitContext;
  items: MockClosetItem[];
  explanation: string;
  saved: boolean;
  createdAt: string;
}

/** GET /weather/me — WeatherSnapshot */
export interface MockWeather {
  tempCelsius: number;
  condition: string;
  description: string;
  rainMm: number;
  windSpeedMs: number;
  uvIndex: number;
  fetchedAt: string;
  /** Display-only; the API returns coordinates on the profile. */
  city: string;
  highCelsius: number;
  lowCelsius: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type ChatRole = "USER" | "ASSISTANT";

/**
 * GET /chat/messages — ChatMessage rows with `outfitCard` hydrated
 * (server/src/chat/chat.service.ts includes `outfitCard: { include: { items } }`).
 */
export interface MockChatMessage {
  id: string;
  ownerId: string;
  role: ChatRole;
  content: string;
  attachedImageUrl: string | null;
  outfitCardId: string | null;
  outfitCard: MockOutfit | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const mockUser: MockUser = {
  id: "usr_2n8fq0x1a",
  name: "Sarah Chen",
  email: "sarah.chen@example.com",
  image: null,
};

export const mockProfile: MockProfile = {
  id: "prf_9d0slq2b",
  userId: mockUser.id,
  genderPresentation: "feminine",
  stylePreferences: ["minimalist", "old_money", "casual"],
  sizeTop: "M",
  sizeBottom: "28",
  sizeShoe: "38",
  onboardingCompleted: true,
  latitude: 38.7223,
  longitude: -9.1393,
  city: "Lisbon",
  styleArchetype: "old_money",
  styleTraits: [
    "Neutral palette",
    "Structured tailoring",
    "Luxurious fabrics",
    "Understated elegance",
  ],
  styleDescription:
    "Your wardrobe leans quietly polished — natural fibres, clean lines and a palette that never shouts. You buy few things and wear them often.",
  styleAnalyzedAt: "2026-08-14T09:12:00.000Z",
};

export const mockWeather: MockWeather = {
  tempCelsius: 21,
  condition: "Clouds",
  description: "partly cloudy",
  rainMm: 0,
  windSpeedMs: 4.2,
  uvIndex: 5,
  fetchedAt: "2026-08-16T07:30:00.000Z",
  city: "Lisbon",
  highCelsius: 26,
  lowCelsius: 17,
};

/**
 * Garment imagery is rendered as a generated gradient swatch rather than a
 * photo — see GarmentImage. `imageUrl` is kept on the shape (and unused in
 * the UI) so the real Cloudinary URL drops straight in later.
 */
function item(
  id: string,
  type: ClosetItemType,
  category: string,
  color: string,
  tags: string[],
  daysAgo: number,
  status: ClosetItemStatus = "DONE",
): MockClosetItem {
  const created = new Date(Date.UTC(2026, 7, 16) - daysAgo * 86_400_000);
  return {
    id,
    ownerId: mockUser.id,
    imageUrl: `https://res.cloudinary.com/checkoutfitt/image/upload/closet/${id}.jpg`,
    attachmentId: `att_${id}`,
    type,
    category,
    color,
    tags,
    status,
    failureReason: status === "FAILED" ? "Vision provider timed out" : null,
    archived: false,
    createdAt: created.toISOString(),
    updatedAt: created.toISOString(),
  };
}

export const mockClosetItems: MockClosetItem[] = [
  item("ci_01", "TOP", "Oxford shirt", "White", ["cotton", "crisp", "smart"], 2),
  item("ci_02", "TOP", "Silk blouse", "Ivory", ["silk", "drapey"], 5),
  item("ci_03", "TOP", "Cashmere sweater", "Camel", ["cashmere", "warm"], 9),
  item("ci_04", "TOP", "Striped tee", "Navy", ["cotton", "casual"], 14),
  item("ci_05", "BOTTOM", "Tailored trousers", "Charcoal", ["wool", "pressed"], 3),
  item("ci_06", "BOTTOM", "Straight jeans", "Indigo", ["denim", "casual"], 21),
  item("ci_07", "BOTTOM", "Pleated skirt", "Black", ["wool", "structured"], 30),
  item("ci_08", "BOTTOM", "Linen shorts", "Sand", ["linen", "summer"], 44),
  item("ci_09", "OUTERWEAR", "Wool coat", "Camel", ["wool", "longline"], 60),
  item("ci_10", "OUTERWEAR", "Tailored blazer", "Navy", ["wool", "structured"], 12),
  item("ci_11", "OUTERWEAR", "Denim jacket", "Mid blue", ["denim", "casual"], 75),
  item("ci_12", "FOOTWEAR", "Leather loafers", "Chestnut", ["leather", "polished"], 18),
  item("ci_13", "FOOTWEAR", "Minimal sneakers", "White", ["leather", "casual"], 25),
  item("ci_14", "FOOTWEAR", "Ankle boots", "Black", ["leather", "heeled"], 90),
  item("ci_15", "DRESS", "Slip dress", "Olive", ["satin", "evening"], 40),
  item("ci_16", "BAG", "Structured tote", "Tan", ["leather", "roomy"], 33),
  item("ci_17", "BAG", "Evening clutch", "Black", ["satin", "compact"], 120),
  item("ci_18", "ACCESSORY", "Leather belt", "Chestnut", ["leather"], 51),
  item("ci_19", "ACCESSORY", "Silk scarf", "Rust", ["silk", "printed"], 66),
  item("ci_20", "ACCESSORY", "Gold hoops", "Gold", ["metal", "everyday"], 8),
];

function byId(id: string): MockClosetItem {
  const found = mockClosetItems.find((i) => i.id === id);
  if (!found) throw new Error(`Unknown mock closet item: ${id}`);
  return found;
}

function outfit(
  id: string,
  context: OutfitContext,
  itemIds: string[],
  explanation: string,
  saved: boolean,
  daysAgo: number,
): MockOutfit {
  return {
    id,
    ownerId: mockUser.id,
    context,
    items: itemIds.map(byId),
    explanation,
    saved,
    createdAt: new Date(
      Date.UTC(2026, 7, 16) - daysAgo * 86_400_000,
    ).toISOString(),
  };
}

export const mockOutfits: MockOutfit[] = [
  outfit(
    "ot_01",
    "office",
    ["ci_02", "ci_05", "ci_12", "ci_10"],
    "The silk blouse softens the tailoring, and the loafers keep it walkable — polished without tipping into formal.",
    true,
    0,
  ),
  outfit(
    "ot_02",
    "casual",
    ["ci_04", "ci_06", "ci_13"],
    "A striped tee and straight jeans is the most repeatable thing you own. White sneakers stop the navy reading heavy.",
    true,
    1,
  ),
  outfit(
    "ot_03",
    "date_night",
    ["ci_15", "ci_14", "ci_17"],
    "The olive slip does the work; ankle boots keep it from feeling delicate, and the clutch is the only thing you need to carry.",
    true,
    3,
  ),
  outfit(
    "ot_04",
    "weekend",
    ["ci_03", "ci_06", "ci_13", "ci_16"],
    "Camel cashmere over indigo denim is your warm-neutral default. The tote makes it a proper out-all-day outfit.",
    false,
    4,
  ),
  outfit(
    "ot_05",
    "meeting",
    ["ci_01", "ci_05", "ci_12", "ci_18"],
    "Crisp white against charcoal reads decisive. Matching the belt to the loafers is the detail that makes it look considered.",
    true,
    6,
  ),
  outfit(
    "ot_06",
    "interview",
    ["ci_01", "ci_07", "ci_14", "ci_10"],
    "Structured and quiet: navy blazer, black skirt, nothing to distract from what you're saying.",
    false,
    8,
  ),
];

/** The outfit surfaced by GET /outfits/today. */
export const mockTodaysOutfit = mockOutfits[0];

export const mockSavedOutfits = mockOutfits.filter((o) => o.saved);

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------

function chatMessage(
  id: string,
  role: ChatRole,
  content: string,
  minutesAgo: number,
  outfitCard: MockOutfit | null = null,
): MockChatMessage {
  return {
    id,
    ownerId: mockUser.id,
    role,
    content,
    attachedImageUrl: null,
    outfitCardId: outfitCard?.id ?? null,
    outfitCard,
    createdAt: new Date(
      Date.UTC(2026, 7, 16, 9, 0) - minutesAgo * 60_000,
    ).toISOString(),
  };
}

/** Seed conversation, oldest first — the order the API returns. */
export const mockChatMessages: MockChatMessage[] = [
  chatMessage(
    "cm_01",
    "USER",
    "I've got a client meeting on Thursday. What should I wear?",
    24,
  ),
  chatMessage(
    "cm_02",
    "ASSISTANT",
    "Something structured but not stiff — you want to look considered without seeming like you tried too hard. Here's what I'd pull from your closet:",
    23,
    mockOutfits[4],
  ),
  chatMessage("cm_03", "USER", "Is the belt necessary?", 21),
  chatMessage(
    "cm_04",
    "ASSISTANT",
    "Not strictly, but it's the detail that makes the outfit look deliberate. Your chestnut belt picks up the loafers, and that repetition reads as intentional rather than accidental. If you skip it, tuck the shirt loosely so the waist still has some definition.",
    20,
  ),
];

export const CHAT_SUGGESTIONS = [
  { label: "Style me for a meeting", pro: false },
  { label: "What should I wear today?", pro: false },
  { label: "Analyze my closet", pro: false },
  { label: "Plan a week of outfits", pro: true },
];

// ---------------------------------------------------------------------------
// Outfit rating
// ---------------------------------------------------------------------------

/**
 * POST /outfit-rating — scores are 0-10 floats and `overallScore` is their
 * mean, computed server-side (never returned by the model), so it can't
 * disagree with its parts. `suggestions` is a Json string[].
 */
export interface MockOutfitRating {
  id: string;
  ownerId: string;
  imageAttachmentId: string;
  colorHarmonyScore: number;
  fitScore: number;
  occasionMatchScore: number;
  overallScore: number;
  occasion: OutfitContext | null;
  suggestions: string[];
  createdAt: string;
}

/** Mirrors the server's rounding: mean of the three, one decimal. */
export function meanScore(color: number, fit: number, occasion: number): number {
  return Math.round(((color + fit + occasion) / 3) * 10) / 10;
}

function rating(
  id: string,
  color: number,
  fit: number,
  occasionMatch: number,
  occasion: OutfitContext | null,
  suggestions: string[],
  daysAgo: number,
): MockOutfitRating {
  return {
    id,
    ownerId: mockUser.id,
    imageAttachmentId: `att_${id}`,
    colorHarmonyScore: color,
    fitScore: fit,
    occasionMatchScore: occasionMatch,
    overallScore: meanScore(color, fit, occasionMatch),
    occasion,
    suggestions,
    createdAt: new Date(
      Date.UTC(2026, 7, 16) - daysAgo * 86_400_000,
    ).toISOString(),
  };
}

export const mockRatings: MockOutfitRating[] = [
  rating(
    "or_01",
    8.5,
    7.5,
    9.0,
    "interview",
    [
      "Swap the longer earrings for small studs — for an interview you want nothing competing with your face.",
      "The blazer sleeve is sitting slightly long; a half-inch shorter would show a cleaner line at the wrist.",
      "Consider a solid blouse instead of the layered tops to keep the silhouette simple.",
    ],
    1,
  ),
  rating(
    "or_02",
    9.0,
    8.0,
    8.5,
    "office",
    [
      "The camel-and-charcoal pairing is doing a lot of work here — keep it.",
      "Try tucking the shirt more loosely so the waist reads softer.",
    ],
    4,
  ),
  rating(
    "or_03",
    7.0,
    8.5,
    6.5,
    "date_night",
    [
      "Lovely fit, but the palette is a touch flat for evening — one richer tone would lift it.",
      "Swap the sneakers for the ankle boots to match the occasion.",
    ],
    9,
  ),
  rating(
    "or_04",
    8.0,
    7.0,
    8.0,
    "casual",
    [
      "Relaxed and easy. Rolling the cuffs once would sharpen the proportions.",
    ],
    16,
  ),
];

export function ratingById(id: string): MockOutfitRating | undefined {
  return mockRatings.find((r) => r.id === id);
}

// ---------------------------------------------------------------------------
// Style coach
// ---------------------------------------------------------------------------

/** POST /style-coach/analyze — archetype, traits, description and tips. */
export interface MockStyleAnalysis {
  archetype: string;
  /** Display name for the archetype enum value. */
  archetypeLabel: string;
  traits: string[];
  description: string;
  tips: string[];
  itemCount: number;
  analyzed: boolean;
  analyzedAt: string;
}

export const mockStyleAnalysis: MockStyleAnalysis = {
  archetype: "old_money",
  archetypeLabel: "Old Money",
  traits: [
    "Neutral palette",
    "Structured tailoring",
    "Luxurious fabrics",
    "Understated elegance",
    "Timeless silhouettes",
  ],
  description:
    "Your wardrobe reads quietly expensive. You gravitate to natural fibres — wool, cashmere, silk, cotton — in a palette that stays within camel, ivory, charcoal and navy. Nothing shouts. The tailoring does the talking, and because almost everything sits in the same tonal family, near enough any two pieces you own will go together. It's a wardrobe built to be worn, not photographed.",
  tips: [
    "Keep leaning on natural fibres. They hold their shape longer and are the single biggest reason this look reads as considered.",
    "One piece of classic jewellery — a slim gold watch or pearl studs — would finish most of these outfits without disturbing the restraint.",
    "Layer textures within your neutrals: silk under cashmere, wool over cotton. It adds depth without adding colour.",
    "A subtle pattern — a fine pinstripe or a muted check — would introduce interest while staying true to the palette.",
    "You're thin on genuinely dressy options. One elevated evening piece would extend this wardrobe further than three more basics.",
  ],
  itemCount: 20,
  analyzed: true,
  analyzedAt: "2026-08-14T09:12:00.000Z",
};

/** Archetype names the loading state cycles through while "analyzing". */
export const STYLE_ARCHETYPE_LABELS = [
  "Minimalist",
  "Streetwear",
  "Old Money",
  "Classic",
  "Bohemian",
  "Edgy",
  "Romantic",
  "Sporty",
  "Eclectic",
];

/** The pieces the collage uses to illustrate the archetype. */
export const STYLE_EXEMPLAR_IDS = [
  "ci_09",
  "ci_02",
  "ci_05",
  "ci_03",
  "ci_12",
  "ci_10",
];

// ---------------------------------------------------------------------------
// Color analysis
// ---------------------------------------------------------------------------

/**
 * GET /color-analysis — one row per user (ownerId is unique, re-analysis
 * upserts). `bestColors`/`worstColors` are Json arrays of hex strings, so the
 * shape here is string[] and names are display-only lookups.
 */
export interface MockColorAnalysis {
  id: string;
  ownerId: string;
  imageAttachmentId: string;
  season: string;
  seasonTraits: string[];
  bestColors: string[];
  worstColors: string[];
  undertone: string;
  contrast: string;
  proTip: string;
  createdAt: string;
}

export const mockColorAnalysis: MockColorAnalysis = {
  id: "ca_01",
  ownerId: mockUser.id,
  imageAttachmentId: "att_ca_01",
  season: "Soft Autumn",
  seasonTraits: ["Warm", "Muted", "Rich"],
  bestColors: [
    "#c1622d", "#a9532c", "#c9a476", "#d4a03c", "#8a7b4f", "#6b6b45",
    "#7d8a6a", "#5f7a6e", "#4f6b6b", "#8a5a37", "#b08968", "#c9b8a0",
    "#9c6b52", "#7a5c48", "#a8836b", "#6e5a49",
  ],
  worstColors: [
    "#000000", "#ffffff", "#ff2d95", "#00b3ff", "#7b2fff", "#00e5b0",
    "#e6e6fa", "#c0c0c0",
  ],
  undertone: "Warm",
  contrast: "Low to medium",
  proTip:
    "Your colouring is gently warm rather than golden, so the trick is muted over saturated. If a colour looks slightly dusty next to a pure primary, it's yours. Keep pure black away from your face — swap it for chocolate or deep olive and you'll look rested rather than washed out.",
  createdAt: "2026-08-12T14:20:00.000Z",
};

/** Display names for swatch tooltips; the API stores hex only. */
export const COLOR_NAMES: Record<string, string> = {
  "#c1622d": "Terracotta",
  "#a9532c": "Burnt sienna",
  "#c9a476": "Camel",
  "#d4a03c": "Ochre",
  "#8a7b4f": "Moss gold",
  "#6b6b45": "Olive",
  "#7d8a6a": "Sage",
  "#5f7a6e": "Soft pine",
  "#4f6b6b": "Muted teal",
  "#8a5a37": "Chestnut",
  "#b08968": "Warm tan",
  "#c9b8a0": "Oat",
  "#9c6b52": "Clay",
  "#7a5c48": "Cocoa",
  "#a8836b": "Praline",
  "#6e5a49": "Bark",
  "#000000": "Pure black",
  "#ffffff": "Optic white",
  "#ff2d95": "Hot pink",
  "#00b3ff": "Electric blue",
  "#7b2fff": "Violet",
  "#00e5b0": "Neon mint",
  "#e6e6fa": "Icy lavender",
  "#c0c0c0": "Cool silver",
};

// ---------------------------------------------------------------------------
// Outfit calendar
// ---------------------------------------------------------------------------

/**
 * GET /calendar?month=YYYY-MM — `{ month, entries }` where each entry has its
 * outfit expanded with items. `date` is a date-only DATE column, so it's
 * carried as a plain YYYY-MM-DD string rather than a timestamp.
 */
export interface MockSchedule {
  id: string;
  ownerId: string;
  outfitId: string;
  date: string;
  notes: string | null;
  createdAt: string;
  outfit: MockOutfit;
}

/**
 * Seeded relative to the real current date so the calendar always opens on a
 * month with something in it, whenever this runs. Offsets are in days.
 */
const SCHEDULE_SEED: { offset: number; outfitId: string; notes: string | null }[] = [
  { offset: 0, outfitId: "ot_01", notes: "Client meeting at 2pm" },
  { offset: 1, outfitId: "ot_02", notes: null },
  { offset: 3, outfitId: "ot_05", notes: "Quarterly review" },
  { offset: 6, outfitId: "ot_03", notes: "Dinner, book the table" },
  { offset: -2, outfitId: "ot_04", notes: null },
  { offset: -5, outfitId: "ot_02", notes: null },
  { offset: 9, outfitId: "ot_06", notes: "Interview — press the blazer" },
];

function scheduleDateKey(offset: number): string {
  const now = new Date();
  const base = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
  );
  base.setUTCDate(base.getUTCDate() + offset);
  return base.toISOString().slice(0, 10);
}

export function buildMockSchedules(): MockSchedule[] {
  return SCHEDULE_SEED.map((seed, index) => {
    const outfit = mockOutfits.find((o) => o.id === seed.outfitId)!;
    const date = scheduleDateKey(seed.offset);
    return {
      id: `os_${index + 1}`,
      ownerId: mockUser.id,
      outfitId: outfit.id,
      date,
      notes: seed.notes,
      createdAt: new Date().toISOString(),
      outfit,
    };
  });
}

// ---------------------------------------------------------------------------
// Wardrobe gap analysis
// ---------------------------------------------------------------------------

/** GET /closet/gap-analysis */
export interface MockMissingItem {
  name: string;
  type: ClosetItemType;
  category: string;
  reason: string;
  estimatedNewOutfits: number;
}

export interface MockGapAnalysis {
  completionPercentage: number;
  missingItems: MockMissingItem[];
  summary: string;
  itemCount: number;
  analyzed: boolean;
  generatedAt: string;
}

export const mockGapAnalysis: MockGapAnalysis = {
  completionPercentage: 78,
  summary:
    "Your wardrobe covers office and casual well, with a tonal palette that makes almost everything combine. The gaps are at the edges: nothing genuinely dressy, and only one warm layer.",
  missingItems: [
    {
      name: "Tailored blazer in charcoal",
      type: "OUTERWEAR",
      category: "Blazer",
      reason:
        "You own one navy blazer doing all the work. A second in charcoal would pair with the pieces navy fights.",
      estimatedNewOutfits: 18,
    },
    {
      name: "White leather sneakers",
      type: "FOOTWEAR",
      category: "Sneakers",
      reason:
        "Your only casual shoe is showing wear. A clean white pair works with every bottom you own.",
      estimatedNewOutfits: 14,
    },
    {
      name: "Silk midi skirt",
      type: "BOTTOM",
      category: "Skirt",
      reason:
        "You have no bottom that reads dressy. This bridges your existing tops into evening.",
      estimatedNewOutfits: 11,
    },
    {
      name: "Fine-knit turtleneck",
      type: "TOP",
      category: "Turtleneck",
      reason:
        "Layers under the blazers and the wool coat, extending three outfits into winter.",
      estimatedNewOutfits: 9,
    },
    {
      name: "Leather crossbody bag",
      type: "BAG",
      category: "Crossbody",
      reason:
        "Both your bags are large. A smaller one suits evenings and travel days.",
      estimatedNewOutfits: 7,
    },
  ],
  itemCount: 20,
  analyzed: true,
  generatedAt: "2026-08-16T06:40:00.000Z",
};

// ---------------------------------------------------------------------------
// Closet value
// ---------------------------------------------------------------------------

export interface MockValuedItem {
  closetItemId: string;
  name: string;
  type: string;
  category: string;
  estimatedValue: number;
  imageUrl: string;
}

export interface MockCategoryValue {
  name: string;
  itemCount: number;
  totalValue: number;
}

/** GET /closet/value */
export interface MockClosetValue {
  totalValue: number;
  currency: string;
  totalItems: number;
  valuedItems: number;
  categoryCount: number;
  categories: MockCategoryValue[];
  topItems: MockValuedItem[];
  generatedAt: string;
}

/** Per-item resale estimates, keyed by closet item id. */
const ITEM_VALUES: Record<string, number> = {
  ci_01: 65, ci_02: 180, ci_03: 320, ci_04: 35,
  ci_05: 210, ci_06: 95, ci_07: 140, ci_08: 55,
  ci_09: 680, ci_10: 395, ci_11: 120, ci_12: 260,
  ci_13: 110, ci_14: 240, ci_15: 175, ci_16: 430,
  ci_17: 150, ci_18: 85, ci_19: 190, ci_20: 240,
};

/**
 * Aggregated the way the API does — totals derived from the per-item values
 * rather than hardcoded, so the hero figure, the category rows and the top
 * items can never disagree.
 *
 * One deliberate difference: the server groups by `category`, but every mock
 * item has a unique category, which would yield 20 groups of one. Grouping by
 * garment type gives a breakdown that actually reads. The response shape is
 * identical either way.
 */
export function buildMockClosetValue(): MockClosetValue {
  const active = mockClosetItems.filter((item) => !item.archived);

  const categories = new Map<string, MockCategoryValue>();
  for (const item of active) {
    const name = CLOSET_TYPE_LABELS[item.type ?? "OTHER"];
    const value = ITEM_VALUES[item.id] ?? 0;
    const bucket = categories.get(name) ?? { name, itemCount: 0, totalValue: 0 };
    bucket.itemCount += 1;
    bucket.totalValue += value;
    categories.set(name, bucket);
  }

  const topItems: MockValuedItem[] = [...active]
    .sort((a, b) => (ITEM_VALUES[b.id] ?? 0) - (ITEM_VALUES[a.id] ?? 0))
    .slice(0, 6)
    .map((item) => ({
      closetItemId: item.id,
      name: item.category ?? "Untitled piece",
      type: (item.type ?? "other").toLowerCase(),
      category: item.category ?? "unknown",
      estimatedValue: ITEM_VALUES[item.id] ?? 0,
      imageUrl: item.imageUrl,
    }));

  return {
    totalValue: active.reduce((sum, item) => sum + (ITEM_VALUES[item.id] ?? 0), 0),
    currency: "USD",
    totalItems: active.length,
    valuedItems: active.length,
    categoryCount: categories.size,
    categories: [...categories.values()].sort(
      (a, b) => b.totalValue - a.totalValue,
    ),
    topItems,
    generatedAt: "2026-08-16T06:40:00.000Z",
  };
}

// ---------------------------------------------------------------------------
// Shopping assistant
// ---------------------------------------------------------------------------

export type ShoppingVerdict = "worth_it" | "maybe" | "skip";

export interface MockProductDescriptor {
  type: ClosetItemType;
  category: string;
  color: string;
  style: string;
}

export interface MockSuggestedOutfit {
  name: string;
  items: { closetItemId: string; type: string; category: string; imageUrl: string }[];
}

/** POST /shopping/evaluate */
export interface MockShoppingEvaluation {
  product: MockProductDescriptor;
  verdict: ShoppingVerdict;
  verdictReason: string;
  newOutfitCount: number;
  duplicateRisk: boolean;
  gapFill: boolean;
  suggestedOutfits: MockSuggestedOutfit[];
  generatedAt: string;
}

function suggested(name: string, ids: string[]): MockSuggestedOutfit {
  return {
    name,
    items: ids.map((id) => {
      const item = byId(id);
      return {
        closetItemId: item.id,
        type: (item.type ?? "other").toLowerCase(),
        category: item.category ?? "unknown",
        imageUrl: item.imageUrl,
      };
    }),
  };
}

export const mockShoppingEvaluation: MockShoppingEvaluation = {
  product: {
    type: "OUTERWEAR",
    category: "Trench coat",
    color: "Camel",
    style: "classic, belted, water-resistant",
  },
  verdict: "worth_it",
  verdictReason:
    "You own one warm layer and one light jacket, with nothing in between — this fills exactly that gap. Camel sits inside the palette you already wear, so it pairs with almost everything rather than needing outfits built around it.",
  newOutfitCount: 12,
  duplicateRisk: false,
  gapFill: true,
  suggestedOutfits: [
    suggested("Over the office look", ["ci_02", "ci_05", "ci_12"]),
    suggested("Weekend layers", ["ci_03", "ci_06", "ci_13"]),
    suggested("Evening out", ["ci_15", "ci_14", "ci_17"]),
  ],
  generatedAt: "2026-08-16T07:10:00.000Z",
};

export const VERDICT_LABELS: Record<ShoppingVerdict, string> = {
  worth_it: "Worth it",
  maybe: "Maybe",
  skip: "Skip it",
};

// ---------------------------------------------------------------------------
// Capsule wardrobe
// ---------------------------------------------------------------------------

export const CAPSULE_SEASONS = ["spring", "summer", "fall", "winter"] as const;
export type CapsuleSeason = (typeof CAPSULE_SEASONS)[number];

export const SEASON_LABELS: Record<CapsuleSeason, string> = {
  spring: "Spring",
  summer: "Summer",
  fall: "Fall",
  winter: "Winter",
};

export const MIN_CAPSULE_SIZE = 5;
export const MAX_CAPSULE_SIZE = 20;
export const DEFAULT_CAPSULE_SIZE = 10;

export interface MockCapsuleItem {
  closetItemId: string;
  type: string;
  category: string;
  imageUrl: string;
}

export interface MockCapsuleSampleOutfit {
  name: string;
  items: MockCapsuleItem[];
}

/** POST /capsule/generate */
export interface MockCapsule {
  title: string;
  items: MockCapsuleItem[];
  totalOutfits: number;
  sampleOutfits: MockCapsuleSampleOutfit[];
  requestedSize: number;
  occasions: OutfitContext[];
  season: CapsuleSeason | null;
  generatedAt: string;
}

function capsuleItem(id: string): MockCapsuleItem {
  const item = byId(id);
  return {
    closetItemId: item.id,
    type: (item.type ?? "other").toLowerCase(),
    category: item.category ?? "unknown",
    imageUrl: item.imageUrl,
  };
}

/**
 * Picks a plausible capsule of `size` pieces. Ordered so the most versatile
 * items are chosen first and the set still covers tops, bottoms, outerwear
 * and shoes at the smallest size — the same coverage rule the prompt gives
 * the model server-side.
 */
const CAPSULE_PRIORITY = [
  "ci_01", "ci_05", "ci_12", "ci_10", "ci_06",
  "ci_02", "ci_03", "ci_13", "ci_09", "ci_16",
  "ci_04", "ci_07", "ci_14", "ci_18", "ci_11",
  "ci_15", "ci_19", "ci_20", "ci_08", "ci_17",
];

export function buildMockCapsule(
  size: number,
  occasions: OutfitContext[],
  season: CapsuleSeason | null,
): MockCapsule {
  const items = CAPSULE_PRIORITY.slice(0, size).map(capsuleItem);
  const seasonLabel = season ? SEASON_LABELS[season] : "Everyday";

  const samples: MockCapsuleSampleOutfit[] = [
    { name: "Monday meeting", ids: ["ci_02", "ci_05", "ci_12"] },
    { name: "Casual Friday", ids: ["ci_01", "ci_06", "ci_13"] },
    { name: "Weekend errands", ids: ["ci_03", "ci_06", "ci_13"] },
    { name: "Dinner out", ids: ["ci_02", "ci_07", "ci_14"] },
    { name: "Cold morning", ids: ["ci_03", "ci_05", "ci_09"] },
  ]
    // A sample can only use pieces the capsule actually contains.
    .filter((sample) => sample.ids.every((id) => items.some((i) => i.closetItemId === id)))
    .slice(0, 5)
    .map((sample) => ({ name: sample.name, items: sample.ids.map(capsuleItem) }));

  return {
    title: `Your ${seasonLabel} Capsule`,
    items,
    // Roughly what a well-chosen set of this size supports.
    totalOutfits: Math.round(size * 4.8),
    sampleOutfits: samples,
    requestedSize: size,
    occasions,
    season,
    generatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Travel packing
// ---------------------------------------------------------------------------

/** TRAVEL_OCCASIONS from server/src/travel/constants.ts */
export const TRAVEL_OCCASIONS = [
  "sightseeing",
  "business_meeting",
  "dinner",
  "beach",
  "hiking",
  "nightlife",
  "shopping",
  "relaxing",
] as const;
export type TravelOccasion = (typeof TRAVEL_OCCASIONS)[number];

export const TRAVEL_OCCASION_LABELS: Record<TravelOccasion, string> = {
  sightseeing: "Sightseeing",
  business_meeting: "Business meeting",
  dinner: "Dinner",
  beach: "Beach",
  hiking: "Hiking",
  nightlife: "Nightlife",
  shopping: "Shopping",
  relaxing: "Relaxing",
};

export const MAX_TRIP_DAYS = 14;

export interface MockPackingItem {
  closetItemId: string;
  type: string;
  name: string;
  imageUrl: string;
  essential: boolean;
}

export interface MockDailyOutfit {
  date: string;
  occasion: string;
  items: { closetItemId: string; type: string; category: string; imageUrl: string }[];
  /** Display-only: the forecast condition for that day. */
  condition: string;
  tempCelsius: number;
}

/** POST /travel/pack */
export interface MockTravelPlan {
  destination: string;
  dates: { start: string; end: string };
  weather: {
    tempRange: { minCelsius: number; maxCelsius: number };
    conditions: string[];
    partial: boolean;
    daysForecast: number;
    totalDays: number;
  };
  advice: string;
  packingList: MockPackingItem[];
  dailyOutfits: MockDailyOutfit[];
  generatedAt: string;
}

const PACKING_SEED: { id: string; essential: boolean }[] = [
  { id: "ci_01", essential: true },
  { id: "ci_04", essential: true },
  { id: "ci_02", essential: false },
  { id: "ci_06", essential: true },
  { id: "ci_05", essential: true },
  { id: "ci_08", essential: false },
  { id: "ci_10", essential: true },
  { id: "ci_11", essential: false },
  { id: "ci_13", essential: true },
  { id: "ci_12", essential: false },
  { id: "ci_16", essential: true },
  { id: "ci_19", essential: false },
];

const DAY_PLAN: { occasion: string; ids: string[]; condition: string; temp: number }[] = [
  { occasion: "Travel day", ids: ["ci_04", "ci_06", "ci_13"], condition: "Clouds", temp: 19 },
  { occasion: "Sightseeing", ids: ["ci_01", "ci_06", "ci_13"], condition: "Clear", temp: 24 },
  { occasion: "Business meeting", ids: ["ci_02", "ci_05", "ci_12"], condition: "Clear", temp: 25 },
  { occasion: "Dinner", ids: ["ci_02", "ci_05", "ci_12"], condition: "Clouds", temp: 21 },
  { occasion: "Sightseeing", ids: ["ci_01", "ci_08", "ci_13"], condition: "Rain", temp: 18 },
  { occasion: "Travel home", ids: ["ci_04", "ci_06", "ci_13"], condition: "Clouds", temp: 20 },
];

export function buildMockTravelPlan(
  destination: string,
  startDate: string,
  endDate: string,
  occasions: TravelOccasion[],
): MockTravelPlan {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  const totalDays =
    Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;

  // Chosen activities fill the middle of the trip; the first and last days
  // are always travel days regardless of what was selected.
  const chosen = occasions.map((o) => TRAVEL_OCCASION_LABELS[o]);

  const dailyOutfits: MockDailyOutfit[] = Array.from(
    { length: totalDays },
    (_, i) => {
      const plan = DAY_PLAN[i % DAY_PLAN.length];
      const date = new Date(start);
      date.setUTCDate(date.getUTCDate() + i);

      const isTravelDay = i === 0 || i === totalDays - 1;
      const occasion =
        isTravelDay || chosen.length === 0
          ? plan.occasion
          : chosen[(i - 1) % chosen.length];

      return {
        date: date.toISOString().slice(0, 10),
        occasion,
        condition: plan.condition,
        tempCelsius: plan.temp,
        items: plan.ids.map((id) => {
          const item = byId(id);
          return {
            closetItemId: item.id,
            type: (item.type ?? "other").toLowerCase(),
            category: item.category ?? "unknown",
            imageUrl: item.imageUrl,
          };
        }),
      };
    },
  );

  // OpenWeather only forecasts ~8 days, so longer trips are partly uncovered.
  const daysForecast = Math.min(totalDays, 8);

  return {
    destination,
    dates: { start: startDate, end: endDate },
    weather: {
      tempRange: { minCelsius: 17, maxCelsius: 26 },
      conditions: ["Clear", "Clouds", "Rain"],
      partial: totalDays > daysForecast,
      daysForecast,
      totalDays,
    },
    advice:
      "Mild but changeable — warm afternoons and cooler evenings, with one wet day mid-trip. Pack layers you can add and drop rather than anything heavy, and bring one water-resistant outer.",
    packingList: PACKING_SEED.map((seed) => {
      const item = byId(seed.id);
      return {
        closetItemId: item.id,
        type: (item.type ?? "other").toLowerCase(),
        name: item.category ?? "Untitled piece",
        imageUrl: item.imageUrl,
        essential: seed.essential,
      };
    }),
    dailyOutfits,
    generatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Inspiration match
// ---------------------------------------------------------------------------

export interface MockMatchedPiece {
  inspoPiece: { type: ClosetItemType; color: string; style: string };
  matchedItem: { closetItemId: string; imageUrl: string; type: string };
  matchScore: number;
}

export interface MockMissingPiece {
  type: ClosetItemType;
  color: string;
  style: string;
  suggestion: string;
}

/** POST /inspiration/match */
export interface MockInspirationMatch {
  overallMatchPercentage: number;
  matchedPieces: MockMatchedPiece[];
  missingPieces: MockMissingPiece[];
  matchReasons: string[];
  generatedAt: string;
}

function matched(
  id: string,
  type: ClosetItemType,
  color: string,
  style: string,
  score: number,
): MockMatchedPiece {
  const item = byId(id);
  return {
    inspoPiece: { type, color, style },
    matchedItem: {
      closetItemId: item.id,
      imageUrl: item.imageUrl,
      type: (item.type ?? "other").toLowerCase(),
    },
    matchScore: score,
  };
}

export const mockInspirationMatch: MockInspirationMatch = {
  overallMatchPercentage: 87,
  matchedPieces: [
    matched("ci_02", "TOP", "Cream", "silk, relaxed collar", 92),
    matched("ci_05", "BOTTOM", "Charcoal", "wide-leg tailored", 88),
    matched("ci_12", "FOOTWEAR", "Brown", "leather loafer", 84),
    matched("ci_09", "OUTERWEAR", "Camel", "longline wool coat", 84),
  ],
  missingPieces: [
    {
      type: "ACCESSORY",
      color: "Gold",
      style: "slim chain necklace",
      suggestion:
        "A fine gold chain would finish the neckline the way the reference does.",
    },
    {
      type: "BAG",
      color: "Chocolate",
      style: "structured top-handle",
      suggestion:
        "Your tan tote is close in shape but reads lighter — a darker top-handle would match more exactly.",
    },
  ],
  matchReasons: [
    "Similar warm-neutral colour palette",
    "Matching relaxed-over-tailored silhouette",
    "Same fabric weight — silk over wool",
    "Four of six pieces already in your closet",
  ],
  generatedAt: "2026-08-16T07:25:00.000Z",
};

// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------

export const CLOSET_TYPE_LABELS: Record<ClosetItemType, string> = {
  TOP: "Tops",
  BOTTOM: "Bottoms",
  OUTERWEAR: "Outerwear",
  DRESS: "Dresses",
  FOOTWEAR: "Shoes",
  ACCESSORY: "Accessories",
  BAG: "Bags",
  OTHER: "Other",
};

export function paginate<T>(all: T[], page = 1, limit = 20): Paginated<T> {
  return {
    items: all.slice((page - 1) * limit, page * limit),
    total: all.length,
    page,
    limit,
  };
}

export function closetItemById(id: string): MockClosetItem | undefined {
  return mockClosetItems.find((i) => i.id === id);
}

export function outfitById(id: string): MockOutfit | undefined {
  return mockOutfits.find((o) => o.id === id);
}

/** Outfits that include a given garment — powers "Outfits with this item". */
export function outfitsWithItem(itemId: string): MockOutfit[] {
  return mockOutfits.filter((o) => o.items.some((i) => i.id === itemId));
}
