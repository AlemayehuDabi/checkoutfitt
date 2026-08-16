"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Lightbulb, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STYLE_EXEMPLAR_IDS,
  closetItemById,
  type MockStyleAnalysis,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/chip";
import { SectionHeader } from "@/components/ui/section-header";
import { GarmentImage } from "@/components/garment-image";

function Reveal({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StyleResults({
  analysis,
  onReanalyze,
}: {
  analysis: MockStyleAnalysis;
  onReanalyze: () => void;
}) {
  const exemplars = STYLE_EXEMPLAR_IDS.map(closetItemById).filter(
    (item): item is NonNullable<typeof item> => Boolean(item),
  );

  const analyzedOn = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(analysis.analyzedAt));

  return (
    <div className="mx-auto max-w-[820px] py-2xl">
      <Reveal>
        <p className="text-eyebrow uppercase text-text-muted">
          Your style archetype
        </p>
        {/* The archetype itself carries the accent; the rest stays quiet. */}
        <h2 className="mt-md text-display text-text-primary text-balance">
          You&apos;re an{" "}
          <span className="text-primary-500">{analysis.archetypeLabel}</span>{" "}
          Minimalist
        </h2>
      </Reveal>

      <Reveal delay={0.08}>
        <p className="mt-lg text-body-lg text-text-secondary">
          {analysis.description}
        </p>
      </Reveal>

      <Reveal delay={0.16}>
        <ul className="mt-xl flex flex-wrap gap-sm">
          {analysis.traits.map((trait) => (
            <li key={trait}>
              <Tag className="h-9 px-lg">{trait}</Tag>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Collage — deliberately uneven so it reads as a moodboard, not a grid */}
      <Reveal delay={0.24} className="mt-4xl">
        <SectionHeader
          eyebrow="In your closet"
          title="The pieces that define it"
          as="h3"
        />
        <div className="grid grid-cols-2 gap-lg sm:grid-cols-3">
          {exemplars.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.35,
                delay: 0.3 + index * 0.06,
                ease: [0.4, 0, 0.2, 1],
              }}
              className={cn(
                "overflow-hidden rounded-xl border border-border shadow-sm",
                // Two tiles run tall, breaking the uniform grid rhythm.
                index === 0 || index === 4 ? "row-span-2 h-full" : undefined,
              )}
            >
              <GarmentImage
                item={item}
                className={cn(
                  "w-full",
                  index === 0 || index === 4 ? "h-full min-h-[240px]" : "aspect-square",
                )}
              />
            </motion.div>
          ))}
        </div>
      </Reveal>

      {/* Key traits */}
      <Reveal delay={0.32} className="mt-4xl">
        <SectionHeader eyebrow="What defines it" title="Key style traits" as="h3" />
        <div className="rounded-md bg-surface-secondary p-xl">
          <ul className="flex flex-col gap-md">
            {analysis.traits.map((trait) => (
              <li key={trait} className="flex items-start gap-md">
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-white"
                >
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span className="text-body text-text-secondary">{trait}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Tips */}
      <Reveal delay={0.4} className="mt-4xl">
        <SectionHeader
          eyebrow="What to do next"
          title="Style tips"
          description="Specific to what you already own."
          as="h3"
        />
        <ul className="flex flex-col gap-md">
          {analysis.tips.map((tip, index) => (
            <motion.li
              key={tip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.45 + index * 0.06 }}
              className="flex gap-lg rounded-xl border border-border bg-surface p-xl shadow-md"
            >
              <span
                aria-hidden
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-500"
              >
                <Lightbulb className="size-[18px]" />
              </span>
              <p className="text-body text-text-secondary">{tip}</p>
            </motion.li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.5} className="mt-4xl">
        <div className="flex flex-wrap items-center gap-lg">
          <Button
            variant="secondary"
            onClick={onReanalyze}
            iconLeft={<RefreshCw className="size-4" />}
          >
            Re-analyze my style
          </Button>
          <p className="text-caption text-text-muted">
            Last analyzed {analyzedOn} · {analysis.itemCount} pieces
          </p>
        </div>
      </Reveal>
    </div>
  );
}
