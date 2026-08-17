import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CONTEXT_LABELS, type MockOutfit } from "@/lib/mock-data";
import { OutfitImage } from "@/components/outfit-image";
import { GarmentImage } from "@/components/garment-image";

/**
 * The assistant's outfit reply, as a rich content block.
 *
 * The model returns an `outfitCard` relation rather than prose describing a
 * look, so this shows the real pieces. It sits below the message text at full
 * column width — a horizontal split with a proper hero image, not a thumbnail
 * card crammed into a bubble. On a phone it stacks image-over-detail.
 */
export function ChatOutfitCard({ outfit }: { outfit: MockOutfit }) {
  return (
    <Link
      href={`/dashboard/outfits/${outfit.id}`}
      className="group mt-xl block overflow-hidden rounded-xl border border-border bg-surface shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-border-strong hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    >
      <div className="grid sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
        <div className="overflow-hidden">
          <OutfitImage
            items={outfit.items}
            variant="hero"
            className="h-52 w-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.04] sm:h-full sm:min-h-[260px]"
          />
        </div>

        <div className="flex flex-col p-2xl">
          <p className="text-eyebrow uppercase text-primary-500">
            {CONTEXT_LABELS[outfit.context]}
          </p>
          <p className="mt-sm text-h3 text-text-primary">
            {outfit.items.length} pieces from your closet
          </p>

          {/* The actual garments, not just their names — this is the answer. */}
          <ul className="mt-lg flex flex-wrap gap-md">
            {outfit.items.map((item) => (
              <li key={item.id} className="flex w-16 flex-col gap-1.5">
                <GarmentImage
                  item={item}
                  size="sm"
                  className="aspect-square w-16 rounded-md border border-border"
                />
                <span className="truncate text-caption text-text-muted">
                  {item.category}
                </span>
              </li>
            ))}
          </ul>

          <span className="mt-auto inline-flex items-center gap-1.5 pt-xl text-body-semibold text-primary-500">
            See the full look
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
