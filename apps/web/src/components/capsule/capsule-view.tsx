"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Layers, Sparkles } from "lucide-react";
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
import {
  Workbench,
  WorkbenchIdle,
  WorkbenchResult,
} from "@/components/layout/workbench";
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

  /* Constraints stay on screen next to the capsule they produced — changing
     the size or dropping an occasion and re-running is the whole workflow. */
  const panel = (
    <>
      <h2 className="text-h3 text-text-primary text-balance">
        Build a capsule from what you own
      </h2>
      <p className="mt-sm text-sm text-text-secondary">
        A small set of pieces that mix into as many outfits as possible.
      </p>

      <div className="mt-xl flex flex-col gap-2xl">
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

      <div className="mt-xl flex flex-col gap-md">
        <Button
          className="w-full"
          disabled={occasions.length === 0 || stage === "generating"}
          loading={stage === "generating"}
          onClick={generate}
          iconLeft={<Layers className="size-4" />}
        >
          {stage === "result" ? "Regenerate capsule" : "Generate capsule"}
        </Button>
        {occasions.length === 0 && (
          <p className="text-caption text-text-muted">
            Pick at least one occasion.
          </p>
        )}
      </div>
    </>
  );

  return (
    <Workbench panel={panel}>
      {stage === "input" && (
        <WorkbenchIdle
          icon={<Layers />}
          title="No capsule yet"
          description="Set the size, occasions and season on the left, then generate — the curated set and sample outfits land here."
        />
      )}

      {stage === "generating" && (
        <div>
          <div className="mb-lg flex items-center gap-md">
            <Sparkles aria-hidden className="size-5 animate-pulse text-primary-500" />
            <p aria-live="polite" className="text-body-medium text-text-secondary">
              Choosing the pieces that combine best…
            </p>
          </div>
          <div className="grid grid-cols-3 gap-lg sm:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: size }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
        </div>
      )}

      {stage === "result" && capsule && (
        <WorkbenchResult>
          <div>
            <p className="text-eyebrow uppercase text-primary-500">
              {capsule.occasions.map((o) => CONTEXT_LABELS[o]).join(" · ")}
            </p>
            <h2 className="mt-1 text-h1 text-text-primary text-balance">
              {capsule.title}
            </h2>
          </div>

          {/* Pieces assemble into the grid */}
          <ul className="mt-2xl grid grid-cols-3 gap-lg sm:grid-cols-5 xl:grid-cols-6">
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
          <section className="mt-3xl">
            <SectionHeader
              eyebrow="Worked examples"
              title="Sample outfits"
              description="Every piece here comes from the capsule above."
              as="h3"
            />
            <ul className="grid gap-lg sm:grid-cols-2 xl:grid-cols-3">
              {capsule.sampleOutfits.map((outfit, index) => (
                <motion.li
                  key={outfit.name}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.07 }}
                  className="min-w-0 rounded-xl border border-border bg-surface p-xl shadow-md transition-all duration-200 hover:-translate-y-[3px] hover:border-border-strong hover:shadow-lg"
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
            <ButtonLink
              href="/dashboard/outfits/saved"
              iconLeft={<Sparkles className="size-4" />}
            >
              View all outfits
            </ButtonLink>
          </div>
        </WorkbenchResult>
      )}
    </Workbench>
  );
}
