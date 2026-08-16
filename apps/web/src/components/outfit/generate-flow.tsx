"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Lightbulb, RefreshCw, Sparkles } from "lucide-react";
import { staggerContainer } from "@/lib/motion";
import { OCCASIONS } from "@/lib/occasions";
import {
  CONTEXT_LABELS,
  mockOutfits,
  type MockOutfit,
  type OutfitContext,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { CalloutCard } from "@/components/ui/callout-card";
import { Skeleton } from "@/components/ui/skeleton";
import { OutfitImage } from "@/components/outfit-image";
import { GarmentImage } from "@/components/garment-image";
import { ContextCard } from "./context-card";
import { OutfitGridCard } from "./outfit-grid-card";
import { SaveToggle } from "./save-toggle";

type Stage = "select" | "generating" | "result";

/** Picks a plausible primary result plus alternatives for the chosen context. */
function resultsFor(context: OutfitContext): {
  primary: MockOutfit;
  alternatives: MockOutfit[];
} {
  const exact = mockOutfits.filter((o) => o.context === context);
  const others = mockOutfits.filter((o) => o.context !== context);
  const ordered = [...exact, ...others];
  return {
    primary: { ...ordered[0], context },
    alternatives: ordered.slice(1, 4).map((o) => ({ ...o, context })),
  };
}

/** Copy cycles while the model works, so the wait reads as progress. */
const STEPS = [
  "Reading your closet…",
  "Matching pieces to the occasion…",
  "Checking colours work together…",
  "Putting the look together…",
];

function GeneratingState() {
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(
      () => setStep((s) => Math.min(STEPS.length - 1, s + 1)),
      900,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div>
      <div className="mb-xl flex items-center gap-md">
        <Sparkles aria-hidden className="size-5 animate-pulse text-primary-500" />
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            aria-live="polite"
            className="text-body-medium text-text-secondary"
          >
            {STEPS[step]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Shaped like the result card it becomes. */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-md">
        <div className="grid sm:grid-cols-[minmax(0,1fr)_1.1fr]">
          <Skeleton className="h-56 w-full rounded-none sm:h-full sm:min-h-[320px]" />
          <div className="flex flex-col gap-lg p-2xl">
            <Skeleton className="h-3 w-24 rounded-sm" />
            <Skeleton className="h-7 w-2/3 rounded-md" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3.5 w-full rounded-sm" />
              <Skeleton className="h-3.5 w-[88%] rounded-sm" />
              <Skeleton className="h-3.5 w-[70%] rounded-sm" />
            </div>
            <div className="mt-auto flex gap-sm">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-20 rounded-sm" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GenerateFlow({
  contexts,
  initialContext,
  heading,
  subheading,
  rich = false,
}: {
  contexts: OutfitContext[];
  initialContext?: OutfitContext;
  heading: string;
  subheading: string;
  rich?: boolean;
}) {
  const [selected, setSelected] = React.useState<OutfitContext | null>(
    initialContext ?? null,
  );
  const [stage, setStage] = React.useState<Stage>("select");
  const [result, setResult] = React.useState<ReturnType<typeof resultsFor>>();

  function generate(context: OutfitContext) {
    setStage("generating");
    // Real generation is an LLM round trip of a few seconds.
    window.setTimeout(() => {
      setResult(resultsFor(context));
      setStage("result");
    }, 2600);
  }

  return (
    <div className="mx-auto max-w-[1200px] py-2xl">
      <AnimatePresence mode="wait">
        {stage !== "result" ? (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-h1 text-text-primary text-balance">{heading}</h2>
            <p className="mt-sm text-body-lg text-text-secondary">
              {subheading}
            </p>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className={
                rich
                  ? "mt-3xl grid grid-cols-2 gap-lg md:grid-cols-3 lg:grid-cols-4"
                  : "mt-3xl grid grid-cols-2 gap-lg sm:grid-cols-3"
              }
            >
              {contexts.map((value) => (
                <motion.div key={value} variants={{ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }}>
                  <ContextCard
                    meta={OCCASIONS[value]}
                    selected={selected === value}
                    onSelect={() => setSelected(value)}
                    rich={rich}
                  />
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-3xl">
              {stage === "generating" ? (
                <GeneratingState />
              ) : (
                <div className="flex flex-wrap items-center gap-md">
                  <Button
                    disabled={!selected}
                    onClick={() => selected && generate(selected)}
                    iconLeft={<Sparkles className="size-4" />}
                  >
                    Generate outfit
                  </Button>
                  {!selected && (
                    <p className="text-caption text-text-muted">
                      Pick an occasion to continue.
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-wrap items-end justify-between gap-lg">
                <div>
                  <p className="text-eyebrow uppercase text-primary-500">
                    {CONTEXT_LABELS[result.primary.context]}
                  </p>
                  <h2 className="mt-1 text-h1 text-text-primary text-balance">
                    Here&apos;s your outfit
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStage("select");
                    setResult(undefined);
                  }}
                >
                  Start over
                </Button>
              </div>

              {/* Primary result */}
              <div className="mt-2xl overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
                <div className="grid sm:grid-cols-[minmax(0,1fr)_1.1fr]">
                  <OutfitImage
                    items={result.primary.items}
                    variant="hero"
                    className="h-56 w-full sm:h-full sm:min-h-[320px]"
                  />
                  <div className="flex flex-col p-2xl">
                    <h3 className="text-h3 text-text-primary">
                      {result.primary.items.length} pieces from your closet
                    </h3>
                    <ul className="mt-lg flex flex-col gap-sm">
                      {result.primary.items.map((item) => (
                        <li key={item.id}>
                          <Link
                            href={`/dashboard/closet/${item.id}`}
                            className="group flex items-center gap-md rounded-sm p-1.5 transition-colors hover:bg-[color:var(--color-overlay-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                          >
                            <GarmentImage
                              item={item}
                              size="sm"
                              className="size-10 shrink-0 rounded-sm border border-border"
                            />
                            <span className="min-w-0 flex-1 truncate text-body-medium text-text-primary">
                              {item.category}
                            </span>
                            <span className="shrink-0 text-caption text-text-muted">
                              {item.color}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-xl">
                      <div className="flex flex-wrap gap-md">
                        <SaveToggle
                          initialSaved={false}
                          label={`This ${CONTEXT_LABELS[result.primary.context].toLowerCase()} outfit`}
                        />
                        <Button
                          variant="secondary"
                          iconLeft={<RefreshCw className="size-4" />}
                          onClick={() => generate(result.primary.context)}
                        >
                          Regenerate
                        </Button>
                      </div>
                      <Link
                        href={`/dashboard/outfits/${result.primary.id}`}
                        className="mt-lg inline-flex items-center gap-1.5 rounded-sm text-body-semibold text-primary-500 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                      >
                        See full detail
                        <ArrowRight aria-hidden className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <CalloutCard
                icon={<Lightbulb />}
                title="Why this outfit"
                className="mt-xl"
              >
                {result.primary.explanation}
              </CalloutCard>

              {/* Alternatives */}
              <section className="mt-3xl">
                <h3 className="text-h3 text-text-primary">Other options</h3>
                <p className="mt-1 text-body text-text-secondary">
                  Same occasion, different combinations from your closet.
                </p>
                <motion.ul
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="mt-xl grid gap-lg sm:grid-cols-3"
                >
                  {result.alternatives.map((outfit) => (
                    <OutfitGridCard key={outfit.id} outfit={outfit} />
                  ))}
                </motion.ul>
              </section>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
