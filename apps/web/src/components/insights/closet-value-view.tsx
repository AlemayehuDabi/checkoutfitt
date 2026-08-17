"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DollarSign, Layers, Shirt } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { MockClosetValue } from "@/lib/mock-data";
import { AnimatedNumber } from "@/components/animated-number";
import { ValueTable } from "./value-table";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { StateView } from "@/components/ui/state-view";

export function ClosetValueView({ value }: { value: MockClosetValue }) {
  const reduce = useReducedMotion();

  if (value.totalItems === 0) {
    return (
      <StateView
        icon={<DollarSign />}
        title="Nothing to value yet"
        description="Add pieces to your closet and we'll estimate what the whole wardrobe is worth."
      />
    );
  }

  const largest = Math.max(...value.categories.map((c) => c.totalValue));

  return (
    <div className="mx-auto max-w-[1200px] py-4xl">
      {/* Hero and stats share a row so the figure isn't alone on a wide page. */}
      <div className="grid items-start gap-2xl lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-4xl">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <p className="text-eyebrow uppercase text-text-muted">
          Estimated wardrobe value
        </p>
        <p className="mt-sm text-display text-primary-500 tabular-nums">
          <AnimatedNumber
            value={value.totalValue}
            format={(n) => formatCurrency(n, value.currency)}
          />
        </p>
        <p className="mt-sm text-body text-text-muted">
          Based on current second-hand market prices
        </p>
      </motion.div>

      {/* Stats */}
      <div className="mt-2xl grid gap-2xl sm:grid-cols-2 lg:mt-0 lg:grid-cols-1 lg:content-start">
        <StatCard
          value={value.totalItems}
          label="Items valued"
          icon={<Shirt />}
        />
        <StatCard
          value={value.categoryCount}
          label="Categories"
          icon={<Layers />}
        />
      </div>

      </div>

      {/* Breakdown */}
      <section className="mt-3xl">
        <SectionHeader
          eyebrow="Where the value sits"
          title="By category"
          as="h3"
        />
        <ul className="flex flex-col gap-lg">
          {value.categories.map((category, index) => (
            <li key={category.name}>
              <div className="flex items-baseline justify-between gap-lg">
                <p className="text-body-medium text-text-primary">
                  {category.name}{" "}
                  <span className="text-caption text-text-muted tabular-nums">
                    · {category.itemCount}
                  </span>
                </p>
                <p className="text-body-medium text-text-primary tabular-nums">
                  {formatCurrency(category.totalValue, value.currency)}
                </p>
              </div>
              {/* Bar length is relative to the largest category, not the
                  total — otherwise every bar reads as a sliver. */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-tertiary">
                <motion.div
                  className="h-full rounded-full bg-primary-500"
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: `${(category.totalValue / largest) * 100}%` }}
                  transition={{
                    duration: 0.9,
                    delay: 0.15 + index * 0.07,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Top items */}
      <section className="mt-3xl">
        <SectionHeader
          eyebrow="Most valuable"
          title="Top items by value"
          description="Sort by any column. Click a row to open the piece."
          as="h3"
        />
        <ValueTable items={value.topItems} currency={value.currency} />
      </section>

      <p className="mt-3xl text-caption text-text-muted">
        Estimates are indicative, not an appraisal. Condition and provenance
        move real resale prices more than anything a photo can show.
      </p>
    </div>
  );
}
