"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  Bookmark,
  BookmarkCheck,
  Shirt,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, listItem } from "@/lib/motion";
import {
  CLOSET_TYPE_LABELS,
  type MockGapAnalysis,
  type MockMissingItem,
} from "@/lib/mock-data";
import { AnimatedNumber } from "@/components/animated-number";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { StateView } from "@/components/ui/state-view";
import { useToast } from "@/components/ui/toast";

function MissingItemRow({ item }: { item: MockMissingItem }) {
  const { toast } = useToast();
  const [saved, setSaved] = React.useState(false);

  return (
    <motion.li variants={listItem}>
      <div className="flex items-start gap-lg rounded-xl border border-border bg-surface p-xl shadow-md transition-colors duration-200 hover:border-border-strong">
        <span
          aria-hidden
          className="inline-flex size-14 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-500"
        >
          <Shirt className="size-6" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-body-semibold text-text-primary">{item.name}</p>
          <p className="mt-0.5 text-caption text-text-muted">
            {CLOSET_TYPE_LABELS[item.type]}
          </p>
          <p className="mt-md text-body text-text-secondary">{item.reason}</p>
          <p className="mt-md inline-flex items-center gap-1.5 rounded-sm bg-success-light px-2 py-1 text-tag font-[600] text-success tabular-nums">
            <Sparkles aria-hidden className="size-3.5" />
            Unlocks {item.estimatedNewOutfits}+ new outfit combinations
          </p>
        </div>

        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${item.name} from list` : `Save ${item.name} to list`}
          onClick={() => {
            setSaved((v) => !v);
            toast({
              kind: saved ? "info" : "success",
              title: saved ? "Removed from list" : "Saved to your list",
              description: saved
                ? `${item.name} is no longer on your shopping list.`
                : `${item.name} added to your shopping list.`,
            });
          }}
          className={cn(
            "inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
            saved
              ? "bg-primary-50 text-primary-500"
              : "text-text-muted hover:bg-surface-secondary hover:text-text-primary",
          )}
        >
          {saved ? (
            <BookmarkCheck aria-hidden className="size-5" />
          ) : (
            <Bookmark aria-hidden className="size-5" />
          )}
        </button>
      </div>
    </motion.li>
  );
}

export function GapAnalysisView({ analysis }: { analysis: MockGapAnalysis }) {
  const reduce = useReducedMotion();

  if (!analysis.analyzed || analysis.missingItems.length === 0) {
    return (
      <StateView
        icon={<BarChart3 />}
        title="Not enough to analyze yet"
        description="Add at least three pieces to your closet and we'll work out what's missing."
        action={
          <Link href="/closet/new">
            <Button>Add items</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-[820px] py-2xl">
      {/* Completion banner */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="rounded-xl border border-border bg-surface p-2xl shadow-lg"
      >
        <div className="flex items-start gap-lg">
          <span
            aria-hidden
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-500"
          >
            <BarChart3 className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-eyebrow uppercase text-text-muted">
              Wardrobe completeness
            </p>
            <p className="mt-1 text-h1 text-text-primary">
              Your wardrobe is{" "}
              <span className="text-primary-500 tabular-nums">
                <AnimatedNumber value={analysis.completionPercentage} />%
              </span>{" "}
              complete
            </p>
          </div>
        </div>

        {/* Track fills on load. */}
        <div className="mt-xl h-2 w-full overflow-hidden rounded-full bg-primary-200">
          <motion.div
            className="h-full rounded-full bg-primary-500"
            initial={reduce ? false : { width: 0 }}
            animate={{ width: `${analysis.completionPercentage}%` }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        <p className="mt-xl text-body text-text-secondary">{analysis.summary}</p>
      </motion.div>

      {/* Missing essentials */}
      <section className="mt-4xl">
        <SectionHeader
          eyebrow="Biggest wins first"
          title="Missing essentials"
          description="Ranked by how many new outfits each would unlock."
          as="h3"
        />
        <motion.ul
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-md"
        >
          {analysis.missingItems.map((item) => (
            <MissingItemRow key={item.name} item={item} />
          ))}
        </motion.ul>
      </section>

      <div className="mt-3xl flex flex-wrap items-center gap-lg">
        <Link href="/shopping">
          <Button size="lg" iconLeft={<Sparkles className="size-4" />}>
            See all recommendations
          </Button>
        </Link>
        <p className="text-caption text-text-muted tabular-nums">
          Based on {analysis.itemCount} pieces in your closet
        </p>
      </div>
    </div>
  );
}
