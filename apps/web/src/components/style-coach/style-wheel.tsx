"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  STYLE_ARCHETYPE_LABELS,
  STYLE_EXEMPLAR_IDS,
  closetItemById,
} from "@/lib/mock-data";
import { GarmentImage } from "@/components/garment-image";

/**
 * The "analyzing" state.
 *
 * Rather than a spinner, the user's own garments orbit a centre that cycles
 * through candidate archetypes — it reads as the app considering the wardrobe
 * it can actually see. Each tile counter-rotates so the garments stay upright
 * while the ring turns.
 */
export function StyleWheel() {
  const reduce = useReducedMotion();
  const [labelIndex, setLabelIndex] = React.useState(0);

  const pieces = STYLE_EXEMPLAR_IDS.map(closetItemById).filter(
    (item): item is NonNullable<typeof item> => Boolean(item),
  );

  React.useEffect(() => {
    const id = window.setInterval(
      () => setLabelIndex((i) => (i + 1) % STYLE_ARCHETYPE_LABELS.length),
      700,
    );
    return () => window.clearInterval(id);
  }, []);

  const radius = 128;

  return (
    <div className="flex flex-col items-center py-4xl" aria-live="polite">
      <div className="relative size-[340px]">
        {/* Track rings */}
        <div className="absolute inset-0 rounded-full border border-border" />
        <div className="absolute inset-8 rounded-full border border-border/60" />

        {/* Orbiting garments */}
        <motion.div
          className="absolute inset-0"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {pieces.map((item, index) => {
            const angle = (index / pieces.length) * 2 * Math.PI;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <motion.div
                key={item.id}
                className="absolute top-1/2 left-1/2 size-16"
                style={{ x: x - 32, y: y - 32 }}
                // Counter-rotate so garments never appear upside down.
                animate={reduce ? undefined : { rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              >
                <GarmentImage
                  item={item}
                  size="sm"
                  className="size-16 rounded-md border border-border shadow-sm"
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Cycling archetype */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-eyebrow uppercase text-text-muted">Reading your closet</p>
          <div className="mt-sm h-10 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={labelIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="text-h2 text-primary-500"
              >
                {STYLE_ARCHETYPE_LABELS[labelIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <p className="mt-3xl max-w-[42ch] text-center text-body text-text-secondary">
        Looking at every piece you own — fabrics, colours, silhouettes — to work
        out what they add up to.
      </p>
    </div>
  );
}
