import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Droplet,
  House,
  ImageIcon,
  Layers,
  Luggage,
  MessageCircle,
  Palette,
  Settings,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Title shown in the top bar for this route. */
  title: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Sidebar structure per docs/design-system.md §8.5. */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Main",
    items: [
      { href: "/", label: "Home", icon: House, title: "Home" },
      { href: "/closet", label: "My Closet", icon: Shirt, title: "My Closet" },
      { href: "/generate", label: "Generate", icon: Sparkles, title: "Generate an outfit" },
    ],
  },
  {
    label: "Style",
    items: [
      { href: "/chat", label: "AI Chat", icon: MessageCircle, title: "AI Stylist" },
      { href: "/style-coach", label: "Style Coach", icon: Palette, title: "Style Coach" },
      { href: "/color-analysis", label: "Color Analysis", icon: Droplet, title: "Color Analysis" },
      { href: "/calendar", label: "Outfit Calendar", icon: Calendar, title: "Outfit Calendar" },
    ],
  },
  {
    label: "Tools",
    items: [
      { href: "/shopping", label: "Shopping Assistant", icon: ShoppingBag, title: "Shopping Assistant" },
      { href: "/outfit-rating", label: "Outfit Rating", icon: Star, title: "Outfit Rating" },
      { href: "/wardrobe-gaps", label: "Wardrobe Gaps", icon: BarChart3, title: "Wardrobe Gaps" },
      { href: "/capsule", label: "Capsule Builder", icon: Layers, title: "Capsule Builder" },
      { href: "/travel", label: "Travel Packing", icon: Luggage, title: "Travel Packing" },
      { href: "/inspiration", label: "Inspiration Match", icon: ImageIcon, title: "Inspiration Match" },
      { href: "/closet-value", label: "Closet Value", icon: DollarSign, title: "Closet Value" },
    ],
  },
];

export const PROFILE_NAV: NavItem = {
  href: "/profile",
  label: "Profile & Settings",
  icon: Settings,
  title: "Profile & Settings",
};

const ALL_ITEMS = [...NAV_GROUPS.flatMap((g) => g.items), PROFILE_NAV];

/** Titles for routes that aren't sidebar destinations (detail pages, flows). */
const EXTRA_TITLES: Record<string, string> = {
  "/closet/new": "Add items",
  "/outfits/saved": "Saved outfits",
  "/occasions": "Occasions",
  "/today": "Today's outfit",
  "/components": "Component gallery",
};

/**
 * Resolves the top-bar title for a pathname, preferring the longest matching
 * prefix so `/closet/abc` still reads as "My Closet" rather than falling back.
 */
export function titleForPath(pathname: string): string {
  if (EXTRA_TITLES[pathname]) return EXTRA_TITLES[pathname];

  const exact = ALL_ITEMS.find((item) => item.href === pathname);
  if (exact) return exact.title;

  const prefixed = ALL_ITEMS.filter(
    (item) => item.href !== "/" && pathname.startsWith(`${item.href}/`),
  ).sort((a, b) => b.href.length - a.href.length)[0];

  return prefixed?.title ?? "CheckoutFitt";
}

export function isActivePath(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
