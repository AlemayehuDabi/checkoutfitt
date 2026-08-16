"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Palette, Sparkles } from "lucide-react";
import { mockStyleAnalysis, type MockStyleAnalysis } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { StyleResults } from "./style-results";
import { StyleWheel } from "./style-wheel";

type Stage = "idle" | "analyzing" | "result";

const WHAT_IT_DOES = [
  "Reads every piece in your closet as one collection, not item by item",
  "Names the archetype your wardrobe actually expresses",
  "Gives you tips that build on what you own, rather than what to buy",
];

/**
 * Starts unanalyzed so the intro, the analysis animation and the reveal are
 * all reachable in this build. With the API wired, seed the stage from
 * `profile.styleAnalyzedAt` and skip straight to the result when it's set.
 */
export function StyleCoachView() {
  const [stage, setStage] = React.useState<Stage>("idle");
  const [analysis, setAnalysis] = React.useState<MockStyleAnalysis | null>(null);

  function analyze() {
    setStage("analyzing");
    window.setTimeout(() => {
      setAnalysis(mockStyleAnalysis);
      setStage("result");
    }, 4200);
  }

  return (
    <AnimatePresence mode="wait">
      {stage === "idle" && (
        <motion.div
          key="idle"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mx-auto max-w-[900px] py-4xl"
        >
          <div className="rounded-xl border border-border bg-surface p-2xl shadow-lg">
            <span className="inline-flex size-12 items-center justify-center rounded-md bg-primary-50 text-primary-500">
              <Palette aria-hidden className="size-6" />
            </span>
            <h2 className="mt-xl text-h1 text-text-primary text-balance">
              What does your wardrobe say about you?
            </h2>
            <p className="mt-md text-body-lg text-text-secondary">
              We&apos;ll look at everything you own together and name the style
              it adds up to — then tell you how to lean into it.
            </p>

            <ul className="mt-2xl flex flex-col gap-md">
              {WHAT_IT_DOES.map((line) => (
                <li key={line} className="flex items-start gap-md">
                  <span
                    aria-hidden
                    className="mt-1 inline-flex size-1.5 shrink-0 rounded-full bg-primary-500"
                  />
                  <span className="text-body text-text-secondary">{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-2xl">
              <Button
                onClick={analyze}
                iconLeft={<Sparkles className="size-4" />}
              >
                Analyze my style
              </Button>
              <p className="mt-md text-caption text-text-muted">
                Takes a few seconds. You can re-run it any time your closet
                changes.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {stage === "analyzing" && (
        <motion.div
          key="analyzing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StyleWheel />
        </motion.div>
      )}

      {stage === "result" && analysis && (
        <motion.div
          key="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <StyleResults analysis={analysis} onReanalyze={analyze} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
