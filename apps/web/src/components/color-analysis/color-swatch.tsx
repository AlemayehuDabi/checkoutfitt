"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COLOR_NAMES } from "@/lib/mock-data";

/**
 * 36px circular swatch, per §8.15 — scales up on hover with a tooltip naming
 * the colour. Swatches carry meaning, so the name is exposed to assistive
 * tech rather than left to colour alone.
 */
export function ColorSwatch({ hex, index }: { hex: string; index: number }) {
  const reduce = useReducedMotion();
  const name = COLOR_NAMES[hex.toLowerCase()] ?? hex.toUpperCase();

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        // Sequenced so the palette lands one colour at a time.
        delay: index * 0.035,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className="group relative"
    >
      <motion.span
        whileHover={reduce ? undefined : { scale: 1.15 }}
        transition={{ duration: 0.15 }}
        tabIndex={0}
        role="img"
        aria-label={name}
        className="block size-9 cursor-default rounded-full border border-border-strong/40 shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        style={{ backgroundColor: hex }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 rounded-sm bg-primary-50 px-2 py-1 text-tag whitespace-nowrap text-primary-700 opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {name}
      </span>
    </motion.li>
  );
}

export function SwatchRow({ colors }: { colors: string[] }) {
  return (
    <ul className="flex flex-wrap gap-sm">
      {colors.map((hex, index) => (
        <ColorSwatch key={hex} hex={hex} index={index} />
      ))}
    </ul>
  );
}
