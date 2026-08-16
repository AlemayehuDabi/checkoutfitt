"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { SHADOW_LG, listItem } from "@/lib/motion";
import { CONTEXT_LABELS, type MockOutfit } from "@/lib/mock-data";
import { OutfitImage } from "@/components/outfit-image";

/** Reused by Saved outfits and any other outfit grid. */
export function OutfitGridCard({ outfit }: { outfit: MockOutfit }) {
  const reduce = useReducedMotion();

  return (
    <motion.li variants={listItem}>
      <motion.div
        whileHover={reduce ? undefined : { y: -3, boxShadow: SHADOW_LG }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="h-full overflow-hidden rounded-xl border border-border bg-surface shadow-md transition-colors duration-200 hover:border-border-strong"
      >
        <Link
          href={`/outfits/${outfit.id}`}
          className="group block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <div className="relative overflow-hidden">
            <OutfitImage
              items={outfit.items}
              className="aspect-[4/3] w-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
            />
            {outfit.saved && (
              <span className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full bg-surface/90 text-primary-500 shadow-sm">
                <Bookmark aria-hidden className="size-3.5 fill-current" />
                <span className="sr-only">Saved</span>
              </span>
            )}
          </div>
          <div className="p-lg">
            <p className="text-body-semibold text-text-primary">
              {CONTEXT_LABELS[outfit.context]}
            </p>
            <p className="mt-1 line-clamp-2 text-caption text-text-secondary">
              {outfit.explanation}
            </p>
          </div>
        </Link>
      </motion.div>
    </motion.li>
  );
}
