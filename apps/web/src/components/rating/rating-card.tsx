"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SHADOW_LG, listItem } from "@/lib/motion";
import { CONTEXT_LABELS, type MockOutfitRating } from "@/lib/mock-data";
import { ScoreBadge } from "@/components/ui/score";
import { PersonPhoto } from "./person-photo";

export function RatingCard({ rating }: { rating: MockOutfitRating }) {
  const reduce = useReducedMotion();
  const date = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(new Date(rating.createdAt));

  return (
    <motion.li variants={listItem}>
      <motion.div
        whileHover={reduce ? undefined : { y: -3, boxShadow: SHADOW_LG }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="h-full overflow-hidden rounded-xl border border-border bg-surface shadow-md transition-colors duration-200 hover:border-border-strong"
      >
        <Link
          href={`/outfit-rating/${rating.id}`}
          className="group block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <div className="relative overflow-hidden">
            <PersonPhoto
              seed={rating.id}
              className="aspect-[3/4] w-full transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="absolute top-2 right-2 rounded-sm bg-surface/90 shadow-sm">
              <ScoreBadge score={rating.overallScore} />
            </span>
          </div>
          <div className="p-lg">
            <p className="text-body-medium text-text-primary">
              {rating.occasion ? CONTEXT_LABELS[rating.occasion] : "Everyday"}
            </p>
            <p className="mt-0.5 text-caption text-text-muted">{date}</p>
          </div>
        </Link>
      </motion.div>
    </motion.li>
  );
}
