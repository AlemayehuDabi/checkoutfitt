import * as React from "react";
import { cn } from "@/lib/utils";
import { GarmentImage } from "./garment-image";
import type { MockClosetItem } from "@/lib/mock-data";

/**
 * Composes an outfit's pieces into a flat-lay style arrangement.
 *
 * Standing in for a rendered outfit photo: the hero variant gives the first
 * piece a tall anchor panel with the rest stacked beside it, which reads as a
 * styled composition rather than a plain grid of tiles.
 */
export interface OutfitImageProps {
  items: MockClosetItem[];
  className?: string;
  variant?: "hero" | "tile";
}

export function OutfitImage({
  items,
  className,
  variant = "tile",
}: OutfitImageProps) {
  const pieces = items.slice(0, 4);

  if (pieces.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-surface-secondary",
          className,
        )}
      />
    );
  }

  if (variant === "tile") {
    return (
      <div
        className={cn(
          "grid grid-cols-2 gap-0.5 overflow-hidden bg-border",
          className,
        )}
      >
        {pieces.map((item) => (
          <GarmentImage key={item.id} item={item} size="sm" className="h-full w-full" />
        ))}
        {pieces.length === 3 && <div className="bg-surface-secondary" />}
      </div>
    );
  }

  const [anchor, ...rest] = pieces;

  return (
    <div className={cn("flex gap-0.5 overflow-hidden bg-border", className)}>
      <GarmentImage item={anchor} size="lg" className="h-full flex-[1.4]" />
      {rest.length > 0 && (
        <div className="flex flex-1 flex-col gap-0.5">
          {rest.map((item) => (
            <GarmentImage
              key={item.id}
              item={item}
              size="md"
              className="w-full flex-1"
            />
          ))}
        </div>
      )}
    </div>
  );
}
