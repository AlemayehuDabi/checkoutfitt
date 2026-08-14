import {
  CalendarDays,
  Images,
  Luggage,
  Palette,
  ScanLine,
  ShoppingBag,
  Sparkles,
  SquareStack,
  Wallet,
  type LucideIcon,
} from "lucide-react-native";

export type StudioGroup = "understand" | "plan" | "refine";

export type StudioTool = {
  key: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  group: StudioGroup;
};

export const STUDIO_GROUPS: { key: StudioGroup; title: string; index: string }[] = [
  { key: "understand", title: "Understand your style", index: "01" },
  { key: "plan", title: "Plan & build", index: "02" },
  { key: "refine", title: "Refine & shop", index: "03" },
];

/**
 * Registry behind the Studio hub. Adding a tool here surfaces it in the hub
 * automatically — no layout changes required.
 */
export const STUDIO_TOOLS: StudioTool[] = [
  {
    key: "coach",
    name: "Style Coach",
    description: "Your style archetype, read from what you actually own",
    href: "/coach",
    icon: Sparkles,
    group: "understand",
  },
  {
    key: "color",
    name: "Colour Analysis",
    description: "Find the palette that works with your undertone",
    href: "/color",
    icon: Palette,
    group: "understand",
  },
  {
    key: "gaps",
    name: "Wardrobe Gaps",
    description: "The pieces missing from a full rotation",
    href: "/gaps",
    icon: SquareStack,
    group: "understand",
  },
  {
    key: "value",
    name: "Closet Value",
    description: "What it's worth, and what each wear costs",
    href: "/value",
    icon: Wallet,
    group: "understand",
  },
  {
    key: "calendar",
    name: "Outfit Calendar",
    description: "Plan looks ahead so mornings are decided",
    href: "/calendar",
    icon: CalendarDays,
    group: "plan",
  },
  {
    key: "capsule",
    name: "Capsule Wardrobe",
    description: "The smallest set that still dresses you for everything",
    href: "/capsule",
    icon: SquareStack,
    group: "plan",
  },
  {
    key: "packing",
    name: "Travel Packing",
    description: "A list and an outfit plan for your next trip",
    href: "/packing",
    icon: Luggage,
    group: "plan",
  },
  {
    key: "rating",
    name: "Outfit Rating",
    description: "Score a look on colour, fit and proportion",
    href: "/rating/capture",
    icon: ScanLine,
    group: "refine",
  },
  {
    key: "recreate",
    name: "Recreate a Look",
    description: "Rebuild a saved image from what you own",
    href: "/recreate",
    icon: Images,
    group: "refine",
  },
  {
    key: "shopping",
    name: "Shopping Assistant",
    description: "Check whether a purchase is actually worth it",
    href: "/shopping",
    icon: ShoppingBag,
    group: "refine",
  },
];
