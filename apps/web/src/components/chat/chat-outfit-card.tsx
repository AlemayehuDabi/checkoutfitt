import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CONTEXT_LABELS, type MockOutfit } from "@/lib/mock-data";
import { OutfitImage } from "@/components/outfit-image";

/**
 * A real outfit card rendered inside an assistant bubble — the model returns
 * an `outfitCard` relation, not prose describing a look, so the UI shows the
 * actual pieces and links through to the outfit.
 */
export function ChatOutfitCard({ outfit }: { outfit: MockOutfit }) {
  return (
    <Link
      href={`/outfits/${outfit.id}`}
      className="group mt-md block overflow-hidden rounded-md border border-border bg-bg transition-colors duration-200 hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    >
      <div className="overflow-hidden">
        <OutfitImage
          items={outfit.items}
          variant="hero"
          className="h-36 w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-lg">
        <p className="text-eyebrow uppercase text-primary-500">
          {CONTEXT_LABELS[outfit.context]}
        </p>
        <p className="mt-1 text-body-semibold text-text-primary">
          {outfit.items.length} pieces from your closet
        </p>
        <ul className="mt-md flex flex-wrap gap-1.5">
          {outfit.items.map((item) => (
            <li
              key={item.id}
              className="inline-flex h-7 items-center rounded-sm bg-surface-secondary px-2.5 text-tag text-text-secondary"
            >
              {item.category}
            </li>
          ))}
        </ul>
        <span className="mt-lg inline-flex items-center gap-1.5 text-body-semibold text-primary-500">
          See the full look
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
