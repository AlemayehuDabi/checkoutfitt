import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Bookmark,
  Calendar,
  CreditCard,
  DollarSign,
  Droplet,
  House,
  ImageIcon,
  Layers,
  Luggage,
  MessageCircle,
  Palette,
  PartyPopper,
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

/**
 * Sidebar structure. Regrouped from the spec's original MAIN/STYLE/TOOLS once
 * the feature set grew: "Tools" had become a 7-item catch-all. Now grouped by
 * what you're doing — everyday actions, managing the wardrobe you have, and
 * the analysis features.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", label: "Home", icon: House, title: "Home" },
      { href: "/dashboard/generate", label: "Generate", icon: Sparkles, title: "Generate an outfit" },
      { href: "/dashboard/occasions", label: "Occasions", icon: PartyPopper, title: "Occasions" },
      { href: "/dashboard/chat", label: "AI Chat", icon: MessageCircle, title: "AI Stylist" },
    ],
  },
  {
    label: "Wardrobe",
    items: [
      { href: "/dashboard/closet", label: "My Closet", icon: Shirt, title: "My Closet" },
      { href: "/dashboard/outfits/saved", label: "Saved Outfits", icon: Bookmark, title: "Saved outfits" },
      { href: "/dashboard/calendar", label: "Outfit Calendar", icon: Calendar, title: "Outfit Calendar" },
      { href: "/dashboard/wardrobe-gaps", label: "Wardrobe Gaps", icon: BarChart3, title: "Wardrobe Gaps" },
      { href: "/dashboard/closet-value", label: "Closet Value", icon: DollarSign, title: "Closet Value" },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { href: "/dashboard/style-coach", label: "Style Coach", icon: Palette, title: "Style Coach" },
      { href: "/dashboard/color-analysis", label: "Color Analysis", icon: Droplet, title: "Color Analysis" },
      { href: "/dashboard/outfit-rating", label: "Outfit Rating", icon: Star, title: "Outfit Rating" },
      { href: "/dashboard/shopping", label: "Shopping Assistant", icon: ShoppingBag, title: "Shopping Assistant" },
      { href: "/dashboard/capsule", label: "Capsule Builder", icon: Layers, title: "Capsule Builder" },
      { href: "/dashboard/travel", label: "Travel Packing", icon: Luggage, title: "Travel Packing" },
      { href: "/dashboard/inspiration", label: "Inspiration Match", icon: ImageIcon, title: "Inspiration Match" },
    ],
  },
];

export const PROFILE_NAV: NavItem = {
  href: "/dashboard/profile",
  label: "Profile",
  icon: Settings,
  title: "Profile",
};

/** Account destinations, reachable from the profile and top bar rather than
 *  the main rail — they're settings, not places you work. */
export const ACCOUNT_NAV: NavItem[] = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings, title: "Settings" },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, title: "Notifications" },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard, title: "Subscription" },
];

const ALL_ITEMS = [
  ...NAV_GROUPS.flatMap((g) => g.items),
  PROFILE_NAV,
  ...ACCOUNT_NAV,
];

/** Titles for routes that aren't sidebar destinations (detail pages, flows). */
const EXTRA_TITLES: Record<string, string> = {
  "/dashboard/closet/new": "Add items",
  "/dashboard/today": "Today's outfit",
  "/dashboard/outfit-rating/history": "Rating history",
  "/components": "Component gallery",
};

/**
 * Resolves the top-bar title for a pathname, preferring the longest matching
 * prefix so `/dashboard/closet/abc` still reads as "My Closet" rather than falling back.
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
  // The dashboard root would otherwise match every page beneath it.
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
