"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OccasionMeta } from "@/lib/occasions";

/**
 * Selectable occasion tile.
 *
 * `rich` gives each occasion its own tinted wash and a large ghosted glyph —
 * used on the Occasions page, where the grid is the whole point. The plain
 * variant keeps the generator's selector calm.
 */
export function ContextCard({
  meta,
  selected,
  onSelect,
  rich = false,
}: {
  meta: OccasionMeta;
  selected: boolean;
  onSelect: () => void;
  rich?: boolean;
}) {
  const reduce = useReducedMotion();
  const Icon = meta.icon;

  return (
    <motion.button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      whileHover={reduce ? undefined : { y: -4 }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "relative min-h-[132px] cursor-pointer overflow-hidden rounded-xl border p-2xl text-left shadow-sm transition-all duration-200 hover:shadow-md",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
        selected
          ? "border-[1.5px] border-primary-500 bg-primary-50"
          : "border-border bg-surface hover:border-border-strong",
        rich && "min-h-[184px]",
      )}
    >
      {rich && (
        <>
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 transition-opacity duration-200",
              selected ? "opacity-0" : "opacity-100",
            )}
            style={{
              backgroundImage: `linear-gradient(140deg, ${meta.from} 0%, ${meta.to} 100%)`,
            }}
          />
          <span
            aria-hidden
            className="absolute -right-5 -bottom-7 opacity-[0.18]"
          >
            <Icon className="size-32 stroke-[1]" />
          </span>
          {/* Keeps label contrast legible over the wash. */}
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 bg-surface/70 transition-opacity duration-200",
              selected ? "opacity-0" : "opacity-100",
            )}
          />
        </>
      )}

      {selected && (
        <motion.span
          initial={reduce ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute top-xl right-xl z-10 inline-flex size-6 items-center justify-center rounded-full bg-primary-500 text-white shadow-sm"
        >
          <Check aria-hidden className="size-3.5" strokeWidth={3} />
        </motion.span>
      )}

      <span className="relative flex h-full flex-col">
        <span
          className={cn(
            "inline-flex size-12 items-center justify-center rounded-lg transition-colors duration-200",
            selected
              ? "bg-primary-500 text-white"
              : "bg-surface-secondary text-primary-500",
          )}
        >
          <Icon aria-hidden className="size-6" />
        </span>

        <span className="mt-auto pt-xl">
          <span
            className={cn(
              "block text-h3",
              selected ? "text-primary-500" : "text-text-primary",
            )}
          >
            {meta.label}
          </span>
          <span className="mt-sm block text-sm text-text-secondary">
            {meta.description}
          </span>
        </span>
      </span>
    </motion.button>
  );
}
