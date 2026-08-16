import * as React from "react";
import {
  Footprints,
  Package,
  Shirt,
  ShoppingBag,
  Sparkles,
  Watch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ClosetItemType, MockClosetItem } from "@/lib/mock-data";

/**
 * Stand-in for garment photography.
 *
 * The app has no image assets yet, and a broken <img> would undercut every
 * screen it appears on. This renders a swatch built from the item's own
 * colour plus a silhouette icon for its type, so grids read as a real
 * wardrobe. Swap for next/image on `item.imageUrl` once uploads are wired.
 */

const COLOR_HEX: Record<string, string> = {
  white: "#f4f2ed",
  ivory: "#efe9dc",
  sand: "#e2d5bf",
  camel: "#c9a476",
  tan: "#c8a887",
  chestnut: "#8a5a37",
  rust: "#a9532c",
  gold: "#c9a227",
  olive: "#6b6b45",
  navy: "#2c3a54",
  "mid blue": "#5878a0",
  indigo: "#3a4a6b",
  charcoal: "#3d3d3f",
  black: "#2a2926",
};

const TYPE_ICON: Record<ClosetItemType, React.ElementType> = {
  TOP: Shirt,
  BOTTOM: Package,
  OUTERWEAR: Shirt,
  DRESS: Sparkles,
  FOOTWEAR: Footprints,
  ACCESSORY: Watch,
  BAG: ShoppingBag,
  OTHER: Package,
};

function hexFor(color: string | null): string {
  if (!color) return "#d8d2c6";
  return COLOR_HEX[color.toLowerCase()] ?? "#d8d2c6";
}

/** Light swatches need dark iconography and vice versa. */
function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 165;
}

export interface GarmentImageProps {
  item: Pick<MockClosetItem, "type" | "color" | "category">;
  className?: string;
  /** Enlarges the silhouette for hero/detail placements. */
  size?: "sm" | "md" | "lg";
}

export function GarmentImage({ item, className, size = "md" }: GarmentImageProps) {
  const hex = hexFor(item.color);
  const Icon = TYPE_ICON[item.type ?? "OTHER"];
  const light = isLight(hex);

  const iconSize =
    size === "lg" ? "size-20" : size === "sm" ? "size-6" : "size-10";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-surface-secondary",
        className,
      )}
      style={{
        backgroundImage: `radial-gradient(120% 100% at 30% 20%, ${hex}f2 0%, ${hex}d9 45%, ${hex}a6 100%)`,
      }}
      role="img"
      aria-label={`${item.category ?? "Garment"} in ${item.color ?? "unknown colour"}`}
    >
      {/* Soft sheen so flat colours still read as fabric. */}
      <span
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 42%, rgba(0,0,0,0.10) 100%)",
        }}
      />
      <Icon
        aria-hidden
        className={cn(
          "relative stroke-[1.25]",
          iconSize,
          light ? "text-[#1a1917]/25" : "text-white/40",
        )}
      />
    </div>
  );
}
