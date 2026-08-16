"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Layers, Pencil, Sparkles } from "lucide-react";
import {
  CONTEXT_LABELS,
  CAPSULE_SEASONS,
  DEFAULT_CAPSULE_SIZE,
  OUTFIT_CONTEXTS,
  SEASON_LABELS,
  buildMockCapsule,
  closetItemById,
  type CapsuleSeason,
  type MockCapsule,
  type OutfitContext,
} from "@/lib/mock-data";
import { AnimatedNumber } from "@/components/animated-number";
import { GarmentImage } from "@/components/garment-image";
import { Button, ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { SizeStepper } from "./size-stepper";

type Stage = "input" | "generating" | "result";

export function CapsuleView() {
  const reduce = useReducedMotion();
  const [stage, setStage] = React.useState<Stage>("input");
  const [size, setSize] = React.useState(DEFAULT_CAPSULE_SIZE);
  const [occasions, setOccasions] = React.useState<OutfitContext[]>([
    "office",
    "casual",
  ]);
  const [season, setSeason] = React.useState<CapsuleSeason | null>("spring");
  const [capsule, setCapsule] = React.useState<MockCapsule | null>(null);

  function toggleOccasion(value: OutfitContext) {
    setOccasions((current) =>
      current.includes(value)
        ? current.filter((c) => c !== value)
        : [...current, value],
    );
  }

  function generate() {
    setStage("generating");
    window.setTimeout(() => {
      setCapsule(buildMockCapsule(size, occasions, season));
      setStage("result");
    }, 2400);
  }

  return (
    <div className="mx-auto max-w-[900px] py-2xl">
      <AnimatePresence mode="wait">
        {stage !== "result" ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-h1 text-text-primary text-balance">
              Build a capsule from what you own
            </h2>
            <p className="mt-sm text-body-lg text-text-secondary">
              A small set of pieces that mix into as many outfits as possible.
              Tell us the constraints and we&apos;ll do the curating.
            </p>

            <div className="mt-3xl flex flex-col gap-3xl">
              <section>
                <SectionHeader
                  eyebrow="How many"
                  title="Capsule size"
                  as="h3"
                  className="mb-lg"
                />
                <SizeStepper value={size} onChange={setSize} />
              </section>

              <section>
                <SectionHeader
                  eyebrow="What for"
                  title="Occasions"
                  description="Pick every setting the capsule needs to cover."
                  as="h3"
                  className="mb-lg"
                />
                <div className="flex flex-wrap gap-sm">
                  {OUTFIT_CONTEXTS.map((context) => (
                    <Chip
                      key={context}
                      selected={occasions.includes(context)}
                      onClick={() => toggleOccasion(context)}
                    >
                      {CONTEXT_LABELS[context]}
                    </Chip>
                  ))}
                </div>
              </section>

              <section>
                <SectionHeader
                  eyebrow="When"
                  title="Season"
                  description="Optional — leave it off for an all-year set."
                  as="h3"
                  className="mb-lg"
                />
                <div className="flex flex-wrap gap-sm">
                  {CAPSULE_SEASONS.map((value) => (
                    <Chip
                      key={value}
                      selected={season === value}
                      onClick={() => setSeason((s) => (s === value ? null : value))}
                    >
                      {SEASON_LABELS[value]}
                    </Chip>
                  ))}
                </div>
              </section>
            </div>

            {stage === "generating" ? (
              <div className="mt-3xl">
                <div className="mb-lg flex items-center gap-md">
                  <Sparkles aria-hidden className="size-5 animate-pulse text-primary-500" />
                  <p aria-live="polite" className="text-body-medium text-text-secondary">
                    Choosing the pieces that combine best…
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-lg sm:grid-cols-5">
                  {Array.from({ length: size }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-md" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-3xl flex flex-wrap items-center gap-md">
                <Button
                  size="lg"
                  disabled={occasions.length === 0}
                  onClick={generate}
                  iconLeft={<Layers className="size-4" />}
                >
                  Generate capsule
                </Button>
                {occasions.length === 0 && (
                  <p className="text-caption text-text-muted">
                    Pick at least one occasion.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          capsule && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-wrap items-end justify-between gap-lg">
                <div>
                  <p className="text-eyebrow uppercase text-primary-500">
                    {capsule.occasions.map((o) => CONTEXT_LABELS[o]).join(" · ")}
                  </p>
                  <h2 className="mt-1 text-h1 text-text-primary text-balance">
                    {capsule.title}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setStage("input")}
                  iconLeft={<Pencil className="size-4" />}
                >
                  Edit
                </Button>
              </div>

              {/* Pieces assemble into the grid */}
              <ul className="mt-2xl grid grid-cols-3 gap-lg sm:grid-cols-5">
                {capsule.items.map((item, index) => {
                  const closetItem = closetItemById(item.closetItemId);
                  if (!closetItem) return null;
                  return (
                    <motion.li
                      key={item.closetItemId}
                      initial={reduce ? false : { opacity: 0, scale: 0.85, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.045,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                    >
                      <Link
                        href={`/dashboard/closet/${item.closetItemId}`}
                        className="group block overflow-hidden rounded-md border border-border transition-colors hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                      >
                        <GarmentImage
                          item={closetItem}
                          className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                      </Link>
                      <p className="mt-sm truncate text-caption text-text-secondary">
                        {item.category}
                      </p>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Summary */}
              <div className="mt-3xl rounded-md bg-surface-secondary p-xl">
                <p className="text-eyebrow uppercase text-text-muted">
                  Capsule summary
                </p>
                <dl className="mt-lg grid grid-cols-2 gap-lg">
                  <div>
                    <dt className="text-caption text-text-muted">Total items</dt>
                    <dd className="mt-1 text-stat text-text-primary tabular-nums">
                      <AnimatedNumber value={capsule.items.length} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-caption text-text-muted">Total outfits</dt>
                    <dd className="mt-1 text-stat text-primary-500 tabular-nums">
                      <AnimatedNumber value={capsule.totalOutfits} />
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Sample outfits */}
              <section className="mt-4xl">
                <SectionHeader
                  eyebrow="Worked examples"
                  title="Sample outfits"
                  description="Every piece here comes from the capsule above."
                  as="h3"
                />
                <ul className="grid gap-lg sm:grid-cols-2 lg:grid-cols-3">
                  {capsule.sampleOutfits.map((outfit, index) => (
                    <motion.li
                      key={outfit.name}
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.07 }}
                      className="rounded-xl border border-border bg-surface p-lg shadow-md"
                    >
                      <p className="text-body-semibold text-text-primary">
                        {outfit.name}
                      </p>
                      <div className="mt-md flex gap-sm">
                        {outfit.items.map((item) => {
                          const closetItem = closetItemById(item.closetItemId);
                          return closetItem ? (
                            <GarmentImage
                              key={item.closetItemId}
                              item={closetItem}
                              size="sm"
                              className="size-14 flex-1 rounded-sm border border-border"
                            />
                          ) : null;
                        })}
                      </div>
                      <p className="mt-md truncate text-caption text-text-muted">
                        {outfit.items.map((i) => i.category).join(" · ")}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              </section>

              <div className="mt-3xl flex flex-wrap gap-md">
                <ButtonLink href="/dashboard/outfits/saved" iconLeft={<Sparkles className="size-4" />}>
                    View all outfits
                  </ButtonLink>
                <Button variant="secondary" onClick={() => setStage("input")}>
                  Change constraints
                </Button>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
