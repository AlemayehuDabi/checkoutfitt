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
