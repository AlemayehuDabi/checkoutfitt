"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { CloudSun, Sparkles } from "lucide-react";
import { closetItemById, mockTodaysOutfit } from "@/lib/mock-data";
import { GarmentImage } from "@/components/garment-image";
import { OutfitImage } from "@/components/outfit-image";

/**
 * Product mockup rather than a stock photo — the real outfit card, weather
 * chip and garment rail, composed with depth. It's built from the same
 * components the app ships, so the hero can never drift from the product.
 *
 * Layers drift at different rates on scroll for parallax; the effect is
 * deliberately small (≤40px) so it reads as depth, not motion for its own sake.
 */
export function HeroVisual() {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const backDrift = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const frontDrift = useTransform(scrollYProgress, [0, 1], [0, 24]);

  const outfit = mockTodaysOutfit;
  const rail = ["ci_09", "ci_02", "ci_12", "ci_05"]
    .map(closetItemById)
    .filter((i): i is NonNullable<typeof i> => Boolean(i));

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[520px]">
      {/* Warm bloom behind the composition */}
      <div
        aria-hidden
        className="absolute -inset-12 -z-10 rounded-full opacity-70 blur-3xl"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 30% 25%, #f6dbc7 0%, rgba(246,219,199,0) 70%), radial-gradient(55% 55% at 75% 70%, #e8a878 0%, rgba(232,168,120,0) 70%)",
        }}
      />

      {/* Main outfit card */}
      <motion.div
        style={reduce ? undefined : { y: backDrift }}
        className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
      >
        <OutfitImage items={outfit.items} variant="hero" className="h-64 w-full" />
        <div className="p-xl">
          <p className="flex items-center gap-sm text-eyebrow uppercase text-primary-500">
            <Sparkles aria-hidden className="size-3.5" />
            Today&apos;s outfit
          </p>
          <p className="mt-sm text-h3 text-text-primary">Made for the office</p>
          <p className="mt-sm line-clamp-2 text-body text-text-secondary">
            {outfit.explanation}
          </p>
          <ul className="mt-lg flex gap-sm">
            {rail.map((item) => (
              <li key={item.id} className="flex-1">
                <GarmentImage
                  item={item}
                  size="sm"
                  className="aspect-square w-full rounded-sm border border-border"
                />
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Floating weather chip */}
      <motion.div
        style={reduce ? undefined : { y: frontDrift }}
        className="absolute -top-6 -right-4 hidden items-center gap-md rounded-lg border border-border bg-surface px-lg py-md shadow-lg sm:flex"
      >
        <CloudSun aria-hidden className="size-6 text-primary-500" />
        <div>
          <p className="text-body-semibold text-text-primary tabular-nums">21°</p>
          <p className="text-caption text-text-muted">Lisbon</p>
        </div>
      </motion.div>

      {/* Floating stat chip */}
      <motion.div
        style={reduce ? undefined : { y: frontDrift }}
        className="absolute -bottom-8 -left-6 hidden rounded-lg border border-border bg-surface px-lg py-md shadow-lg sm:block"
      >
        <p className="text-eyebrow uppercase text-text-muted">Outfits ready</p>
        <p className="mt-0.5 text-h3 text-primary-500 tabular-nums">128</p>
      </motion.div>
    </div>
  );
}
