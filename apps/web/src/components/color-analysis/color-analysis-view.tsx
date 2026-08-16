"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  Droplet,
  RefreshCw,
  Sparkles,
  UploadCloud,
  X,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockColorAnalysis, type MockColorAnalysis } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { CalloutCard } from "@/components/ui/callout-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { PersonPhoto } from "@/components/rating/person-photo";
import { SwatchRow } from "./color-swatch";

type Stage = "idle" | "analyzing" | "result";

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

export function ColorAnalysisView() {
  const [stage, setStage] = React.useState<Stage>("idle");
  const [photo, setPhoto] = React.useState<{ name: string; preview: string } | null>(
    null,
  );
  const [dragging, setDragging] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<MockColorAnalysis | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo.preview);
    };
  }, [photo]);

  function accept(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setPhoto({ name: file.name, preview: URL.createObjectURL(file) });
  }

  function analyze() {
    setStage("analyzing");
    window.setTimeout(() => {
      setAnalysis(mockColorAnalysis);
      setStage("result");
    }, 2600);
  }

  function reset() {
    if (photo) URL.revokeObjectURL(photo.preview);
    setPhoto(null);
    setAnalysis(null);
    setStage("idle");
  }

  return (
    <div className="mx-auto max-w-[820px] py-2xl">
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
              Which colours actually suit you?
            </h2>
            <p className="mt-sm text-body-lg text-text-secondary">
              Upload a clear photo of your face in natural light. We&apos;ll read
              your undertone and contrast, then give you a palette to shop and
              dress by.
            </p>

            <div className="mt-3xl">
              {photo ? (
                <div className="relative w-fit">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.preview}
                    alt={photo.name}
                    className="size-48 rounded-full border-2 border-border object-cover shadow-md"
                  />
                  <button
                    type="button"
                    onClick={reset}
                    aria-label="Remove photo"
                    className="absolute top-1 right-1 inline-flex size-7 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text-secondary shadow-sm transition-colors hover:bg-danger-light hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                  >
                    <X aria-hidden className="size-4" />
                  </button>
                </div>
              ) : (
                <motion.div
                  animate={{ scale: dragging ? 1.01 : 1 }}
                  transition={{ duration: 0.2 }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    accept(e.dataTransfer.files);
                  }}
                  className={cn(
                    "rounded-xl border-2 border-dashed transition-colors duration-200",
                    dragging
                      ? "border-primary-500 bg-primary-100"
                      : "border-border bg-surface hover:border-primary-300 hover:bg-primary-50",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex w-full cursor-pointer flex-col items-center gap-md rounded-xl px-lg py-6xl text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                  >
                    <UploadCloud
                      aria-hidden
                      className={cn(
                        "size-12 stroke-[1.25] transition-colors",
                        dragging ? "text-primary-500" : "text-text-muted",
                      )}
                    />
                    <span className="text-body text-text-secondary">
                      <span className="font-[600] text-primary-500">
                        Click to browse
                      </span>{" "}
                      or drag a face photo here
                    </span>
                    <span className="text-caption text-text-muted">
                      Natural light, no filter, hair back if you can
                    </span>
                  </button>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic"
                    className="sr-only"
                    onChange={(e) => {
                      accept(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </motion.div>
              )}
            </div>

            {stage === "analyzing" ? (
              <div className="mt-3xl">
                <div className="mb-lg flex items-center gap-md">
                  <Droplet
                    aria-hidden
                    className="size-5 animate-pulse text-primary-500"
                  />
                  <p aria-live="polite" className="text-body-medium text-text-secondary">
                    Reading undertone and contrast…
                  </p>
                </div>
                <Skeleton className="h-9 w-56 rounded-md" />
                <Skeleton className="mt-md h-5 w-40 rounded-sm" />
                <div className="mt-2xl flex flex-wrap gap-sm">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <Skeleton key={i} className="size-9 rounded-full" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-3xl flex flex-wrap items-center gap-md">
                <Button
                  size="lg"
                  disabled={!photo}
                  onClick={analyze}
                  iconLeft={<Sparkles className="size-4" />}
                >
                  Analyze my colours
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
          analysis && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Reveal>
                <div className="flex flex-wrap items-center gap-2xl">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo.preview}
                      alt="Your photo"
                      className="size-32 shrink-0 rounded-full border-2 border-border object-cover shadow-md"
                    />
                  ) : (
                    <PersonPhoto
                      seed={analysis.id}
                      className="size-32 shrink-0 rounded-full border-2 border-border shadow-md"
                      iconClassName="size-12"
                    />
                  )}

                  <div className="min-w-0">
                    <p className="text-eyebrow uppercase text-text-muted">
                      Your season
                    </p>
                    <h2 className="mt-1 text-display text-primary-500 text-balance">
                      {analysis.season}
                    </h2>
                    <p className="mt-sm text-body-lg text-text-secondary">
                      {analysis.seasonTraits.join(" · ")}
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <dl className="mt-2xl flex flex-wrap gap-2xl border-y border-border py-lg">
                  <div>
                    <dt className="text-caption uppercase tracking-[0.06em] text-text-muted">
                      Undertone
                    </dt>
                    <dd className="mt-1 text-body-medium text-text-primary">
                      {analysis.undertone}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-caption uppercase tracking-[0.06em] text-text-muted">
                      Contrast
                    </dt>
                    <dd className="mt-1 text-body-medium text-text-primary">
                      {analysis.contrast}
                    </dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={0.16} className="mt-4xl">
                <SectionHeader
                  eyebrow="Wear these"
                  title="Best colours for you"
                  description="Muted and warm — these sit with your colouring rather than against it."
                  as="h3"
                />
                <SwatchRow colors={analysis.bestColors} />
              </Reveal>

              <Reveal delay={0.24} className="mt-4xl">
                <SectionHeader
                  eyebrow="Handle with care"
                  title="Colours to avoid"
                  description="These pull attention away from your face or drain it."
                  as="h3"
                />
                <SwatchRow colors={analysis.worstColors} />
              </Reveal>

              <Reveal delay={0.32}>
                <div className="mt-2xl flex flex-wrap gap-lg">
                  <p className="flex items-center gap-sm text-caption text-text-muted">
                    <Check aria-hidden className="size-4 text-success" />
                    Best near your face
                  </p>
                  <p className="flex items-center gap-sm text-caption text-text-muted">
                    <XCircle aria-hidden className="size-4 text-danger" />
                    Keep away from your face
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <CalloutCard
                  icon={<Sparkles />}
                  title="Pro tip"
                  className="mt-4xl"
                  emphasis="strong"
                >
                  {analysis.proTip}
                </CalloutCard>
              </Reveal>

              <Reveal delay={0.48}>
                <div className="mt-4xl">
                  <Button
                    variant="secondary"
                    onClick={reset}
                    iconLeft={<RefreshCw className="size-4" />}
                  >
                    Re-analyze with a new photo
                  </Button>
                </div>
              </Reveal>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
