"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { SHADOW_LG } from "@/lib/motion";
import { CONTEXT_LABELS, type MockOutfit } from "@/lib/mock-data";
import { OutfitImage } from "@/components/outfit-image";

/**
 * The dashboard centrepiece. The whole card is one link, with the image and
 * chevron responding to the group hover so it reads as a single target.
 */
export function TodaysOutfitCard({ outfit }: { outfit: MockOutfit }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -3, boxShadow: SHADOW_LG }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden rounded-xl border border-border bg-surface shadow-lg transition-colors duration-200 hover:border-border-strong"
    >
      <Link
        href="/today"
        className="group grid rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:grid-cols-[minmax(0,1fr)_1.1fr]"
      >
        <div className="overflow-hidden">
          <OutfitImage
            items={outfit.items}
            variant="hero"
            className="h-56 w-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03] sm:h-full sm:min-h-[300px]"
          />
        </div>

        <div className="flex flex-col justify-center p-2xl">
          <p className="flex items-center gap-sm text-eyebrow uppercase text-primary-500">
            <Sparkles aria-hidden className="size-3.5" />
            Today&apos;s outfit
          </p>

          <h3 className="mt-md text-h2 text-text-primary text-balance">
            Made for {CONTEXT_LABELS[outfit.context].toLowerCase()}
          </h3>

          <p className="mt-md line-clamp-3 text-body text-text-secondary">
            {outfit.explanation}
          </p>

          <ul className="mt-xl flex flex-wrap gap-1.5">
            {outfit.items.map((item) => (
              <li
                key={item.id}
                className="inline-flex h-7 items-center rounded-sm bg-surface-secondary px-2.5 text-tag text-text-secondary"
              >
                {item.category}
              </li>
            ))}
          </ul>

          <span className="mt-xl inline-flex items-center gap-1.5 text-body-semibold text-primary-500">
            See the full look
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
