"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Check,
  ImageIcon,
  Link2,
  RefreshCw,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { staggerContainer, listItem } from "@/lib/motion";
import {
  CLOSET_TYPE_LABELS,
  closetItemById,
  mockInspirationMatch,
  type MockInspirationMatch,
} from "@/lib/mock-data";
import { AnimatedNumber } from "@/components/animated-number";
import { GarmentImage } from "@/components/garment-image";
import { OutfitImage } from "@/components/outfit-image";
import { DropPrompt, PhotoDropzone, type PickedPhoto } from "@/components/photo-dropzone";
import {
  Workbench,
  WorkbenchIdle,
  WorkbenchResult,
} from "@/components/layout/workbench";
import { Button, ButtonLink } from "@/components/ui/button";
import { CalloutCard } from "@/components/ui/callout-card";
import { Divider } from "@/components/ui/divider";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";

type Stage = "input" | "matching" | "result";

export function InspirationView() {
  const { toast } = useToast();
  const reduce = useReducedMotion();
  const [stage, setStage] = React.useState<Stage>("input");
  const [photo, setPhoto] = React.useState<PickedPhoto | null>(null);
  const [url, setUrl] = React.useState("");
  const [result, setResult] = React.useState<MockInspirationMatch | null>(null);

  React.useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo.preview);
    };
  }, [photo]);

  const canMatch = Boolean(photo) || url.trim().length > 0;

  function pick(file: File) {
    setPhoto({ name: file.name, preview: URL.createObjectURL(file) });
    setUrl("");
  }

  function clear() {
    if (photo) URL.revokeObjectURL(photo.preview);
    setPhoto(null);
  }

  function findMatches() {
    setStage("matching");
    window.setTimeout(() => {
      setResult(mockInspirationMatch);
      setStage("result");
    }, 2400);
  }

  function reset() {
    clear();
    setUrl("");
    setResult(null);
    setStage("input");
  }

  const matchedItems =
    result?.matchedPieces
      .map((p) => closetItemById(p.matchedItem.closetItemId))
      .filter((item): item is NonNullable<typeof item> => Boolean(item)) ?? [];

  /* Keeping the source photo beside the match means "try another look" is one
     drop away rather than a trip back through an empty form. */
  const panel = (
    <>
      <h2 className="text-h3 text-text-primary text-balance">
        Recreate a look you&apos;ve saved
      </h2>
      <p className="mt-sm text-sm text-text-secondary">
        Drop in a photo from Pinterest, a magazine, anywhere — we&apos;ll find
        the closest version using clothes you already own.
      </p>

      <div className="mt-xl">
        <PhotoDropzone
          photo={photo}
          onPick={pick}
          onClear={clear}
          prompt={<DropPrompt what="an inspiration photo" />}
          hint="JPG, PNG, WEBP or HEIC · up to 10MB"
          previewClassName="aspect-[3/4] w-full rounded-xl"
        />
      </div>

      <Divider label="or paste an image link" className="my-xl" />

      <Input
        label="Image URL"
        type="url"
        inputMode="url"
        placeholder="https://…"
        icon={<Link2 />}
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          if (e.target.value) clear();
        }}
      />

      <div className="mt-xl flex flex-col gap-md">
        <Button
          className="w-full"
          disabled={!canMatch || stage === "matching"}
          loading={stage === "matching"}
          onClick={findMatches}
          iconLeft={<Search className="size-4" />}
        >
          {stage === "result" ? "Match again" : "Find matches"}
        </Button>
        {!canMatch && (
          <p className="text-caption text-text-muted">
            Add a photo or a link to continue.
          </p>
        )}
        {stage === "result" && (
          <Button
            variant="ghost"
            className="w-full"
            onClick={reset}
            iconLeft={<RefreshCw className="size-4" />}
          >
            See other matches
          </Button>
        )}
      </div>
    </>
  );

  return (
    <Workbench panel={panel}>
      {stage === "input" && (
        <WorkbenchIdle
          icon={<ImageIcon />}
          title="No look to match yet"
          description="Drop an inspiration photo on the left. The side-by-side comparison and the pieces we matched appear here."
        />
      )}

      {stage === "matching" && (
        <div>
          <div className="mb-lg flex items-center gap-md">
            <Sparkles aria-hidden className="size-5 animate-pulse text-primary-500" />
            <p aria-live="polite" className="text-body-medium text-text-secondary">
              Reading the look and searching your closet…
            </p>
          </div>
          <div className="grid gap-lg sm:grid-cols-2">
            <Skeleton className="aspect-[3/4] w-full rounded-xl" />
            <Skeleton className="aspect-[3/4] w-full rounded-xl" />
          </div>
        </div>
      )}

      {stage === "result" && result && (
        <WorkbenchResult>
          {/* Side-by-side comparison */}
          <div className="grid gap-lg sm:grid-cols-2">
            <div>
              <p className="mb-md text-eyebrow uppercase text-text-muted">
                Inspiration
              </p>
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo.preview}
                  alt="Your inspiration"
                  className="aspect-[3/4] w-full rounded-xl border border-border object-cover shadow-md"
                />
              ) : (
                <div className="flex aspect-[3/4] w-full items-center justify-center rounded-xl border border-border bg-surface-secondary shadow-md">
                  <ImageIcon
                    aria-hidden
                    className="size-12 stroke-[1.25] text-text-muted"
                  />
                </div>
              )}
            </div>

            <div>
              <p className="mb-md text-eyebrow uppercase text-text-muted">
                Your closet match
              </p>
              <div className="relative">
                <OutfitImage
                  items={matchedItems}
                  variant="hero"
                  className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-border shadow-md"
                />
                {/* Match badge overlaps the image corner. */}
                <motion.span
                  initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  className="absolute top-md right-md rounded-full bg-primary-500 px-3 py-1.5 text-body-semibold text-text-on-primary shadow-primary tabular-nums"
                >
                  <AnimatedNumber value={result.overallMatchPercentage} />%
                  Match
                </motion.span>
              </div>
            </div>
          </div>

          {/* Matched pieces */}
          <section className="mt-3xl">
            <SectionHeader
              eyebrow="Piece by piece"
              title="What we matched"
              as="h3"
            />
            <motion.ul
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid gap-sm xl:grid-cols-2"
            >
              {result.matchedPieces.map((piece) => {
                const item = closetItemById(piece.matchedItem.closetItemId);
                return (
                  <motion.li key={piece.matchedItem.closetItemId} variants={listItem}>
                    <Link
                      href={`/dashboard/closet/${piece.matchedItem.closetItemId}`}
                      className="group flex h-full items-center gap-lg rounded-md border border-border bg-surface p-md transition-colors duration-200 hover:bg-[color:var(--color-overlay-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    >
                      {item && (
                        <GarmentImage
                          item={item}
                          size="sm"
                          className="size-14 shrink-0 rounded-sm border border-border"
                        />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-body-medium text-text-primary">
                          {item?.category ?? CLOSET_TYPE_LABELS[piece.inspoPiece.type]}
                        </span>
                        <span className="block truncate text-caption text-text-muted">
                          matches {piece.inspoPiece.color.toLowerCase()}{" "}
                          {piece.inspoPiece.style}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-sm bg-primary-50 px-2 py-1 text-tag font-[600] text-primary-500 tabular-nums">
                        {piece.matchScore}%
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </section>

          {/* Reasons */}
          <section className="mt-3xl">
            <SectionHeader eyebrow="Why it works" title="How we matched" as="h3" />
            <div className="rounded-md bg-surface-secondary p-xl">
              <ul className="flex flex-col gap-md">
                {result.matchReasons.map((reason) => (
                  <li key={reason} className="flex items-start gap-md">
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-white"
                    >
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    <span className="max-w-[72ch] text-body text-text-secondary">
                      {reason}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Missing pieces */}
          {result.missingPieces.length > 0 && (
            <section className="mt-3xl">
              <SectionHeader
                eyebrow="To get closer"
                title="Missing pieces"
                description="What would take this from close to exact."
                as="h3"
              />
              <ul className="grid gap-md xl:grid-cols-2">
                {result.missingPieces.map((piece) => (
                  <li
                    key={piece.style}
                    className="flex items-start gap-lg rounded-xl border border-border bg-surface p-xl shadow-md transition-all duration-200 hover:border-border-strong hover:shadow-lg"
                  >
                    <span
                      aria-hidden
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-500"
                    >
                      <ShoppingBag className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-body-semibold text-text-primary">
                        {piece.color} {piece.style}
                      </p>
                      <p className="mt-0.5 text-caption text-text-muted">
                        {CLOSET_TYPE_LABELS[piece.type]}
                      </p>
                      <p className="mt-md text-body text-text-secondary">
                        {piece.suggestion}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-lg flex flex-wrap gap-md">
                <ButtonLink href="/dashboard/shopping" variant="outline" size="sm">
                  Evaluate a purchase
                </ButtonLink>
                <ButtonLink href="/dashboard/wardrobe-gaps" variant="outline" size="sm">
                  See wardrobe gaps
                </ButtonLink>
              </div>
            </section>
          )}

          <CalloutCard icon={<Sparkles />} className="mt-3xl">
            Saved looks become a target — we&apos;ll flag pieces that get you
            closer to it when you next evaluate a purchase.
          </CalloutCard>

          <div className="mt-3xl flex flex-wrap gap-md">
            <Button
              onClick={() =>
                toast({
                  kind: "success",
                  title: "Look saved",
                  description: "Find it with your saved outfits.",
                })
              }
              iconLeft={<Sparkles className="size-4" />}
            >
              Save this look
            </Button>
          </div>
        </WorkbenchResult>
      )}
    </Workbench>
  );
}
