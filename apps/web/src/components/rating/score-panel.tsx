"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { CONTEXT_LABELS, type MockOutfitRating } from "@/lib/mock-data";
import { ScoreCircle } from "@/components/ui/score";
import { CalloutCard } from "@/components/ui/callout-card";

/**
 * The three axes plus the mean. Shared by the live result and the history
 * detail page so a saved rating looks identical to the one just produced.
 */
export function ScorePanel({ rating }: { rating: MockOutfitRating }) {
  const reduce = useReducedMotion();

  const axes = [
    { label: "Color harmony", value: rating.colorHarmonyScore },
    { label: "Fit", value: rating.fitScore },
    { label: "Occasion match", value: rating.occasionMatchScore },
  ];

  return (
    <div>
      {/* Overall */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        <p className="text-eyebrow uppercase text-text-muted">Overall score</p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-display text-primary-500 tabular-nums">
            {rating.overallScore.toFixed(1)}
          </span>
          <span className="text-h3 text-text-muted">/ 10</span>
        </p>
        <p className="mt-sm text-body text-text-secondary">
          {rating.occasion
            ? `Judged for ${CONTEXT_LABELS[rating.occasion].toLowerCase()}.`
            : "Judged for general everyday wear."}
        </p>
      </motion.div>

      {/* Axes — staggered so the rings fill in sequence. */}
      <div className="mt-3xl grid grid-cols-3 gap-lg">
        {axes.map((axis, index) => (
          <motion.div
            key={axis.label}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.1 + index * 0.12,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="flex flex-col items-center rounded-md bg-surface-secondary p-lg"
          >
            <ScoreCircle score={axis.value} label={axis.label} />
          </motion.div>
        ))}
      </div>

      {rating.suggestions.length > 0 && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.5 }}
        >
          <CalloutCard
            icon={<Lightbulb />}
            title="Stylist suggestion"
            className="mt-3xl"
          >
            <ul className="flex list-disc flex-col gap-sm pl-4">
              {rating.suggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>
          </CalloutCard>
        </motion.div>
      )}
    </div>
  );
}
