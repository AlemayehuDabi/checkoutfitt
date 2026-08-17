"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { SHADOW_XL, listItem } from "@/lib/motion";
import { CONTEXT_LABELS, type MockOutfit } from "@/lib/mock-data";
import { OutfitImage } from "@/components/outfit-image";

/**
 * Grid tile for a generated outfit. Reused by Saved outfits and any other
 * outfit grid.
 *
 * A 4:5 frame and a card-weight caption block — an outfit is the product here,
 * so the tile is sized to be looked at rather than skimmed past.
 */
export function OutfitGridCard({ outfit }: { outfit: MockOutfit }) {
  const reduce = useReducedMotion();

  return (
    <motion.li variants={listItem}>
      <motion.div
        whileHover={reduce ? undefined : { y: -6, boxShadow: SHADOW_XL }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="h-full max-h-[35rem] overflow-hidden rounded-xl border border-border bg-surface shadow-md transition-colors duration-200 hover:border-border-strong"
      >
        <Link
          href={`/dashboard/outfits/${outfit.id}`}
          className="group flex h-full flex-col rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <div className="relative overflow-hidden bg-surface-secondary max-h-[35rem]">
            <OutfitImage
              items={outfit.items}
              className="aspect-[4/5] w-full h-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.04]"
            />
            {outfit.saved && (
              <span className="absolute top-md right-md inline-flex size-8 items-center justify-center rounded-full bg-surface/90 text-primary-500 shadow-sm backdrop-blur-sm">
                <Bookmark aria-hidden className="size-4 fill-current" />
                <span className="sr-only">Saved</span>
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col p-xl">
            <p className="text-eyebrow uppercase text-primary-500">
              {CONTEXT_LABELS[outfit.context]}
            </p>
            <p className="mt-sm text-body-semibold text-text-primary">
              {outfit.items.length} pieces
            </p>
            <p className="mt-sm line-clamp-2 text-sm text-text-secondary">
              {outfit.explanation}
            </p>
          </div>
        </Link>
      </motion.div>
    </motion.li>
  );
}
