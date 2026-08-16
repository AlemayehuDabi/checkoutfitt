"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link2, Plus, RefreshCw, ShoppingBag, Sparkles } from "lucide-react";
import { staggerContainer, listItem } from "@/lib/motion";
import {
  closetItemById,
  mockShoppingEvaluation,
  type MockShoppingEvaluation,
} from "@/lib/mock-data";
import { AnimatedNumber } from "@/components/animated-number";
import { GarmentImage } from "@/components/garment-image";
import { DropPrompt, PhotoDropzone, type PickedPhoto } from "@/components/photo-dropzone";
import { Button } from "@/components/ui/button";
import { CalloutCard } from "@/components/ui/callout-card";
import { Divider } from "@/components/ui/divider";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag } from "@/components/ui/chip";
import { useToast } from "@/components/ui/toast";
import { VerdictBadge, VerdictChip } from "./verdict-badge";

type Stage = "input" | "evaluating" | "result";

export function ShoppingView() {
  const { toast } = useToast();
  const reduce = useReducedMotion();
  const [stage, setStage] = React.useState<Stage>("input");
  const [photo, setPhoto] = React.useState<PickedPhoto | null>(null);
  const [url, setUrl] = React.useState("");
  const [result, setResult] = React.useState<MockShoppingEvaluation | null>(null);

  React.useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo.preview);
    };
  }, [photo]);

  const canEvaluate = Boolean(photo) || url.trim().length > 0;

  function pick(file: File) {
    setPhoto({ name: file.name, preview: URL.createObjectURL(file) });
    setUrl("");
  }

  function clear() {
    if (photo) URL.revokeObjectURL(photo.preview);
    setPhoto(null);
  }

  function evaluate() {
    setStage("evaluating");
    window.setTimeout(() => {
      setResult(mockShoppingEvaluation);
      setStage("result");
    }, 2400);
  }

  function reset() {
    clear();
    setUrl("");
    setResult(null);
    setStage("input");
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
              Thinking of buying something?
            </h2>
            <p className="mt-sm text-body-lg text-text-secondary">
              We&apos;ll check it against what you already own and tell you
              honestly whether it earns its place.
            </p>

            <div className="mt-3xl">
              <PhotoDropzone
                photo={photo}
                onPick={pick}
                onClear={clear}
                prompt={<DropPrompt what="a product photo" />}
                hint="JPG, PNG, WEBP or HEIC · up to 10MB"
                previewClassName="aspect-square w-64 rounded-xl"
              />
            </div>

            <Divider label="or paste a link" className="my-2xl" />

            <Input
              label="Product URL"
              type="url"
              inputMode="url"
              placeholder="https://…"
              icon={<Link2 />}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (e.target.value) clear();
              }}
              hint="We'll pull the product image from the page."
            />

            {stage === "evaluating" ? (
              <div className="mt-3xl">
                <div className="mb-lg flex items-center gap-md">
                  <Sparkles aria-hidden className="size-5 animate-pulse text-primary-500" />
                  <p aria-live="polite" className="text-body-medium text-text-secondary">
                    Comparing it against your closet…
                  </p>
                </div>
                <div className="grid gap-3xl lg:grid-cols-[40%_1fr]">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <div className="flex flex-col gap-lg">
                    <Skeleton className="h-11 w-48 rounded-md" />
                    <Skeleton className="h-4 w-full rounded-sm" />
                    <Skeleton className="h-4 w-5/6 rounded-sm" />
                    <Skeleton className="h-16 w-full rounded-md" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3xl flex flex-wrap items-center gap-md">
                <Button
                  size="lg"
                  disabled={!canEvaluate}
                  onClick={evaluate}
                  iconLeft={<ShoppingBag className="size-4" />}
                >
                  Evaluate this item
                </Button>
                {!canEvaluate && (
                  <p className="text-caption text-text-muted">
                    Add a photo or a link to continue.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid gap-3xl lg:grid-cols-[40%_1fr] lg:items-start">
                {/* Product */}
                <div className="lg:sticky lg:top-24">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo.preview}
                      alt={result.product.category}
                      className="aspect-square w-full rounded-xl border border-border object-cover shadow-md"
                    />
                  ) : (
                    <GarmentImage
                      item={result.product}
                      size="lg"
                      className="aspect-square w-full overflow-hidden rounded-xl border border-border shadow-md"
                    />
                  )}
                  <div className="mt-lg">
                    <p className="text-body-semibold text-text-primary">
                      {result.product.color} {result.product.category}
                    </p>
                    <p className="mt-1 text-caption text-text-muted">
                      {result.product.style}
                    </p>
                  </div>
                </div>

                {/* Verdict */}
                <div>
                  <p className="text-eyebrow uppercase text-text-muted">
                    Our verdict
                  </p>
                  <div className="mt-md">
                    <VerdictBadge verdict={result.verdict} />
                  </div>

                  <p className="mt-lg text-body-lg text-text-secondary">
                    {result.verdictReason}
                  </p>

                  <div className="mt-xl flex flex-wrap gap-sm">
                    {result.gapFill && (
                      <VerdictChip verdict="worth_it">Fills a gap</VerdictChip>
                    )}
                    {result.duplicateRisk && (
                      <VerdictChip verdict="maybe">
                        Similar to something you own
                      </VerdictChip>
                    )}
                  </div>

                  {/* Headline stat */}
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-2xl flex items-center gap-lg rounded-md bg-surface-secondary px-xl py-lg"
                  >
                    <span
                      aria-hidden
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-500"
                    >
                      <Sparkles className="size-5" />
                    </span>
                    <p className="text-body text-text-secondary">
                      <span className="text-h2 text-text-primary tabular-nums">
                        <AnimatedNumber value={result.newOutfitCount} />
                      </span>{" "}
                      new outfit combinations unlocked
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Suggested outfits */}
              <section className="mt-4xl">
                <SectionHeader
                  eyebrow="How you'd wear it"
                  title="Suggested outfits"
                  description="Pairing the new piece with things already in your closet."
                  as="h3"
                />
                <motion.ul
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid gap-lg sm:grid-cols-3"
                >
                  {result.suggestedOutfits.map((outfit) => (
                    <motion.li
                      key={outfit.name}
                      variants={listItem}
                      className="overflow-hidden rounded-xl border border-border bg-surface p-lg shadow-md"
                    >
                      <p className="text-body-semibold text-text-primary">
                        {outfit.name}
                      </p>
                      <ul className="mt-md flex flex-col gap-sm">
                        {outfit.items.map((item) => {
                          const closetItem = closetItemById(item.closetItemId);
                          return (
                            <li key={item.closetItemId}>
                              <Link
                                href={`/dashboard/closet/${item.closetItemId}`}
                                className="group flex items-center gap-md rounded-sm p-1 transition-colors hover:bg-[color:var(--color-overlay-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                              >
                                {closetItem && (
                                  <GarmentImage
                                    item={closetItem}
                                    size="sm"
                                    className="size-9 shrink-0 rounded-sm border border-border"
                                  />
                                )}
                                <span className="min-w-0 flex-1 truncate text-sm text-text-primary">
                                  {item.category}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                      <Tag className="mt-md">+ {result.product.category}</Tag>
                    </motion.li>
                  ))}
                </motion.ul>
              </section>

              <CalloutCard icon={<Sparkles />} className="mt-2xl">
                Adding this to your closet lets it appear in generated outfits
                straight away — you don&apos;t have to own it yet.
              </CalloutCard>

              <div className="mt-3xl flex flex-wrap gap-md">
                <Button
                  iconLeft={<Plus className="size-4" />}
                  onClick={() =>
                    toast({
                      kind: "success",
                      title: "Added to your closet",
                      description: `${result.product.category} is ready to style.`,
                    })
                  }
                >
                  Add to closet
                </Button>
                <Button
                  variant="secondary"
                  onClick={reset}
                  iconLeft={<RefreshCw className="size-4" />}
                >
                  Try a different item
                </Button>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
