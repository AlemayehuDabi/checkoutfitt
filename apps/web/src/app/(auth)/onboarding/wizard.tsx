"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import {
  BOTTOM_SIZES,
  GENDER_PRESENTATIONS,
  INITIAL_QUIZ,
  SHOE_SIZES,
  STEPS,
  STYLE_PREFERENCES,
  TOP_SIZES,
  type QuizState,
} from "./steps";

function SizeRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-md text-eyebrow uppercase text-text-muted">{label}</p>
      <div className="flex flex-wrap gap-sm">
        {options.map((option) => (
          <Chip
            key={option}
            selected={value === option}
            onClick={() => onChange(option)}
          >
            {option}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export function OnboardingWizard() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [step, setStep] = React.useState(0);
  const [quiz, setQuiz] = React.useState<QuizState>(INITIAL_QUIZ);
  const [finishing, setFinishing] = React.useState(false);

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  // Each step gates "Next" on its own requirement; sizes are optional.
  const canAdvance =
    step === 0
      ? quiz.genderPresentation !== null
      : step === 1
        ? quiz.stylePreferences.length > 0
        : true;

  function toggleStyle(value: string) {
    setQuiz((q) => ({
      ...q,
      stylePreferences: q.stylePreferences.includes(value)
        ? q.stylePreferences.filter((s) => s !== value)
        : [...q.stylePreferences, value],
    }));
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    setFinishing(true);
    window.setTimeout(() => router.push("/"), 800);
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Progress */}
      <header className="sticky top-0 z-10 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[760px] items-center justify-between px-lg">
          <span className="text-body-semibold tracking-[-0.2px] text-primary-500">
            CheckoutFitt
          </span>
          <span className="text-caption text-text-muted tabular-nums">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
        <div className="h-1 w-full bg-primary-200">
          <motion.div
            className="h-full bg-primary-500"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[760px] flex-1 flex-col px-lg py-5xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={reduce ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1"
          >
            <h1 className="text-h1 text-text-primary text-balance">
              {current.title}
            </h1>
            <p className="mt-sm text-body-lg text-text-secondary">
              {current.subtitle}
            </p>

            <div className="mt-3xl">
              {/* ---- Step 1: gender presentation ---- */}
              {current.id === "gender" && (
                <div className="grid gap-md sm:grid-cols-2">
                  {GENDER_PRESENTATIONS.map((option) => {
                    const selected = quiz.genderPresentation === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setQuiz((q) => ({
                            ...q,
                            genderPresentation: option.value,
                          }))
                        }
                        className={cn(
                          "relative cursor-pointer rounded-xl border p-xl text-left transition-all duration-200",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
                          selected
                            ? "border-[1.5px] border-primary-500 bg-primary-50"
                            : "border-border bg-surface hover:border-border-strong hover:bg-surface-secondary",
                        )}
                      >
                        {selected && (
                          <span className="absolute top-lg right-lg inline-flex size-5 items-center justify-center rounded-full bg-primary-500 text-white">
                            <Check aria-hidden className="size-3" strokeWidth={3} />
                          </span>
                        )}
                        <p
                          className={cn(
                            "text-body-semibold",
                            selected ? "text-primary-500" : "text-text-primary",
                          )}
                        >
                          {option.label}
                        </p>
                        <p className="mt-1 text-sm text-text-secondary">
                          {option.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ---- Step 2: style preferences ---- */}
              {current.id === "style" && (
                <div className="grid gap-md sm:grid-cols-2">
                  {STYLE_PREFERENCES.map((option) => {
                    const selected = quiz.stylePreferences.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleStyle(option.value)}
                        className={cn(
                          "relative flex cursor-pointer items-center gap-lg rounded-xl border p-lg text-left transition-all duration-200",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
                          selected
                            ? "border-[1.5px] border-primary-500 bg-primary-50"
                            : "border-border bg-surface hover:border-border-strong hover:bg-surface-secondary",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "inline-flex size-5 shrink-0 items-center justify-center rounded-sm border transition-colors",
                            selected
                              ? "border-primary-500 bg-primary-500 text-white"
                              : "border-border-strong bg-surface text-transparent",
                          )}
                        >
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                        <span className="min-w-0">
                          <span
                            className={cn(
                              "block text-body-semibold",
                              selected ? "text-primary-500" : "text-text-primary",
                            )}
                          >
                            {option.label}
                          </span>
                          <span className="block text-sm text-text-secondary">
                            {option.hint}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ---- Step 3: sizes ---- */}
              {current.id === "sizes" && (
                <div className="flex flex-col gap-2xl">
                  <SizeRow
                    label="Tops"
                    options={TOP_SIZES}
                    value={quiz.sizeTop}
                    onChange={(v) => setQuiz((q) => ({ ...q, sizeTop: v }))}
                  />
                  <SizeRow
                    label="Bottoms"
                    options={BOTTOM_SIZES}
                    value={quiz.sizeBottom}
                    onChange={(v) => setQuiz((q) => ({ ...q, sizeBottom: v }))}
                  />
                  <SizeRow
                    label="Shoes (EU)"
                    options={SHOE_SIZES}
                    value={quiz.sizeShoe}
                    onChange={(v) => setQuiz((q) => ({ ...q, sizeShoe: v }))}
                  />
                  <p className="text-caption text-text-muted">
                    Optional — you can skip this and add sizes later.
                  </p>
                </div>
              )}

              {/* ---- Step 4: summary ---- */}
              {current.id === "summary" && (
                <div className="rounded-xl border border-border bg-surface p-2xl shadow-md">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                    <Sparkles aria-hidden className="size-6" />
                  </span>
                  <p className="mt-lg text-h3 text-text-primary">
                    Your starting profile
                  </p>
                  <dl className="mt-xl flex flex-col divide-y divide-border">
                    <div className="flex items-start justify-between gap-lg py-md">
                      <dt className="text-sm text-text-muted">Dresses</dt>
                      <dd className="text-body-medium text-text-primary">
                        {GENDER_PRESENTATIONS.find(
                          (g) => g.value === quiz.genderPresentation,
                        )?.label ?? "—"}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-lg py-md">
                      <dt className="text-sm text-text-muted">Style</dt>
                      <dd className="flex max-w-[60%] flex-wrap justify-end gap-1.5">
                        {quiz.stylePreferences.length === 0 ? (
                          <span className="text-body-medium text-text-primary">—</span>
                        ) : (
                          quiz.stylePreferences.map((s) => (
                            <span
                              key={s}
                              className="inline-flex h-7 items-center rounded-sm bg-surface-secondary px-2.5 text-tag text-text-secondary"
                            >
                              {STYLE_PREFERENCES.find((o) => o.value === s)?.label}
                            </span>
                          ))
                        )}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-lg py-md">
                      <dt className="text-sm text-text-muted">Sizes</dt>
                      <dd className="text-body-medium text-text-primary">
                        {[quiz.sizeTop, quiz.sizeBottom, quiz.sizeShoe]
                          .filter(Boolean)
                          .join(" · ") || "Not set"}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-xl text-body text-text-secondary">
                    Next: add a few pieces to your closet and we&apos;ll start
                    building outfits from what you actually own.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-4xl flex items-center justify-between gap-lg">
          {step > 0 ? (
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              iconLeft={<ArrowLeft className="size-4" />}
            >
              Back
            </Button>
          ) : (
            <ButtonLink href="/sign-up" variant="ghost" iconLeft={<ArrowLeft className="size-4" />}>
                Back
              </ButtonLink>
          )}

          <div className="flex items-center gap-md">
            {step === 2 && (
              <Button variant="ghost" onClick={next}>
                Skip
              </Button>
            )}
            <Button
              size="lg"
              onClick={next}
              disabled={!canAdvance}
              loading={finishing}
              iconRight={
                step === STEPS.length - 1 ? undefined : (
                  <ArrowRight className="size-4" />
                )
              }
            >
              {step === STEPS.length - 1 ? "Start using CheckoutFitt" : "Continue"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
