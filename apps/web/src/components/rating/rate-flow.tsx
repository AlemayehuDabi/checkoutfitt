"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, Sparkles, Star } from "lucide-react";
import {
  CONTEXT_LABELS,
  OUTFIT_CONTEXTS,
  meanScore,
  mockUser,
  type MockOutfitRating,
  type OutfitContext,
} from "@/lib/mock-data";
import { DropPrompt, PhotoDropzone } from "@/components/photo-dropzone";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { ScorePanel } from "./score-panel";

type Stage = "upload" | "rating" | "result";

/** What the vision call would return for the uploaded selfie. */
const SCORED = {
  colorHarmonyScore: 8.5,
  fitScore: 7.5,
  occasionMatchScore: 9.0,
  suggestions: [
    "Swap the longer earrings for small studs — nothing should compete with your face.",
    "The blazer sleeve sits slightly long; half an inch shorter would show a cleaner wrist.",
    "A solid blouse instead of the layered tops would keep the silhouette simple.",
  ],
};

export function RateFlow() {
  const { toast } = useToast();
  const [stage, setStage] = React.useState<Stage>("upload");
  const [photo, setPhoto] = React.useState<{ name: string; preview: string } | null>(
    null,
  );
  const [occasion, setOccasion] = React.useState<OutfitContext | null>(null);
  const [result, setResult] = React.useState<MockOutfitRating | null>(null);

  React.useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo.preview);
    };
  }, [photo]);

  function rate() {
    setStage("rating");
    window.setTimeout(() => {
      setResult({
        id: "or_new",
        ownerId: mockUser.id,
        imageAttachmentId: "att_new",
        ...SCORED,
        overallScore: meanScore(
          SCORED.colorHarmonyScore,
          SCORED.fitScore,
          SCORED.occasionMatchScore,
        ),
        occasion,
        createdAt: new Date().toISOString(),
      });
      setStage("result");
    }, 2400);
  }

  function retake() {
    if (photo) URL.revokeObjectURL(photo.preview);
    setPhoto(null);
    setResult(null);
    setStage("upload");
  }

  return (
    <div className="mx-auto max-w-[1200px] py-4xl">
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
              How does this look?
            </h2>
            <p className="mt-sm text-body-lg text-text-secondary">
              Upload a photo of what you&apos;re wearing and get an honest read on
              colour, fit, and whether it suits the occasion.
            </p>

            {/* Photo */}
            <div className="mt-3xl">
              <PhotoDropzone
                photo={photo}
                onPick={(file) =>
                  setPhoto({ name: file.name, preview: URL.createObjectURL(file) })
                }
                onClear={retake}
                prompt={<DropPrompt what="a full-length photo" />}
                hint="One photo · JPG, PNG, WEBP or HEIC"
              />
            </div>

            {/* Occasion */}
            <div className="mt-2xl">
              <p className="mb-md text-eyebrow uppercase text-text-muted">
                Occasion <span className="normal-case">(optional)</span>
              </p>
              <div className="no-scrollbar -mx-lg overflow-x-auto px-lg sm:mx-0 sm:overflow-x-visible sm:px-0">
                <div className="flex w-max items-center gap-sm sm:w-auto sm:flex-wrap">
                  {OUTFIT_CONTEXTS.map((context) => (
                    <Chip
                      key={context}
                      selected={occasion === context}
                      onClick={() =>
                        setOccasion((c) => (c === context ? null : context))
                      }
                    >
                      {CONTEXT_LABELS[context]}
                    </Chip>
                  ))}
                </div>
              </div>
              <p className="mt-md text-caption text-text-muted">
                Without one, we judge it for general everyday wear.
              </p>
            </div>

            {stage === "rating" ? (
              <div className="mt-3xl">
                <div className="mb-lg flex items-center gap-md">
                  <Sparkles
                    aria-hidden
                    className="size-5 animate-pulse text-primary-500"
                  />
                  <p aria-live="polite" className="text-body-medium text-text-secondary">
                    Reading colour, fit and proportion…
                  </p>
                </div>
                {/* Shaped like the result it becomes. */}
                <div className="grid gap-3xl lg:grid-cols-[40%_1fr]">
                  <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                  <div className="flex flex-col gap-xl">
                    <Skeleton className="h-3 w-28 rounded-sm" />
                    <Skeleton className="h-11 w-40 rounded-md" />
                    <div className="grid grid-cols-3 gap-lg">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-[148px] rounded-md" />
                      ))}
                    </div>
                    <Skeleton className="h-28 w-full rounded-md" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3xl flex flex-wrap items-center gap-md">
                <Button
                  disabled={!photo}
                  onClick={rate}
                  iconLeft={<Star className="size-4" />}
                >
                  Rate my outfit
                </Button>
                {!photo && (
                  <p className="text-caption text-text-muted">
                    Add a photo to continue.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-eyebrow uppercase text-primary-500">
                Your rating
              </p>
              <h2 className="mt-1 text-h1 text-text-primary text-balance">
                Here&apos;s how it reads
              </h2>

              <div className="mt-2xl grid gap-3xl lg:grid-cols-[40%_1fr] lg:items-start">
                <div className="lg:sticky lg:top-24">
                  {photo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo.preview}
                      alt="Your outfit"
                      className="aspect-[3/4] w-full rounded-xl border border-border object-cover shadow-md"
                    />
                  )}
                </div>

                <div>
                  <ScorePanel rating={result} />

                  <div className="mt-3xl flex flex-wrap gap-md">
                    <Button
                      onClick={() =>
                        toast({
                          kind: "success",
                          title: "Rating saved",
                          description: "Find it in your rating history.",
                        })
                      }
                      iconLeft={<Star className="size-4" />}
                    >
                      Save rating
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={retake}
                      iconLeft={<RefreshCw className="size-4" />}
                    >
                      Retake
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
