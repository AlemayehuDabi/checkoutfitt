import type { ChatMessage } from "@/types";

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "seed-1",
    role: "assistant",
    text: "Hey! I'm your AI stylist. Tell me what you're getting dressed for, or attach a photo of a piece you want to build a look around.",
    createdAt: Date.now() - 1000 * 60 * 5,
  },
];

export const SUGGESTION_CHIPS: { label: string; prompt: string; pro?: boolean }[] = [
  { label: "What should I wear today?", prompt: "What should I wear today?" },
  { label: "Style me for a wedding", prompt: "Style me for a wedding" },
  { label: "Build a capsule wardrobe", prompt: "Build a capsule wardrobe", pro: true },
];

const KEYWORD_CONTEXTS: { keywords: string[]; context: string }[] = [
  { keywords: ["wedding"], context: "Wedding Guest" },
  { keywords: ["interview"], context: "Interview" },
  { keywords: ["date"], context: "Date Night" },
  { keywords: ["gym", "workout"], context: "Gym" },
  { keywords: ["meeting"], context: "Meeting" },
  { keywords: ["work", "office"], context: "Office" },
  { keywords: ["party"], context: "Party" },
  { keywords: ["travel", "flight", "trip"], context: "Travel" },
  { keywords: ["weekend"], context: "Weekend" },
  { keywords: ["outfit", "wear", "look"], context: "Casual" },
];

const GENERIC_REPLIES = [
  "Love that direction. Want me to pull a few pieces together for it?",
  "Good call — comfort and color are usually the first things I check for a look like that.",
  "Noted! I'll factor that into your next few suggestions.",
  "I can definitely help with that — tell me a little more about the occasion.",
];

export function matchOutfitContext(message: string): string | null {
  const lower = message.toLowerCase();
  for (const entry of KEYWORD_CONTEXTS) {
    if (entry.keywords.some((keyword) => lower.includes(keyword))) {
      return entry.context;
    }
  }
  return null;
}

export function pickGenericReply(): string {
  return GENERIC_REPLIES[Math.floor(Math.random() * GENERIC_REPLIES.length)];
}

export function imageAcknowledgement(): string {
  const replies = [
    "Nice piece! I'll factor this into your recommendations.",
    "Got it — I can already think of a few things that would pair well with this.",
    "Saved that to mind. Want me to build a full outfit around it?",
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}
