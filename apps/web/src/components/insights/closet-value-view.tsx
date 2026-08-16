"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight, DollarSign, Layers, Shirt } from "lucide-react";
import { staggerContainer, listItem } from "@/lib/motion";
import { formatCurrency } from "@/lib/utils";
import {
  closetItemById,
  type MockClosetValue,
} from "@/lib/mock-data";
import { AnimatedNumber } from "@/components/animated-number";
import { GarmentImage } from "@/components/garment-image";
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
    <div className="mx-auto max-w-[820px] py-2xl">
      {/* Hero */}
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
      <div className="mt-2xl grid gap-lg sm:grid-cols-2">
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

      {/* Breakdown */}
      <section className="mt-4xl">
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
      <section className="mt-4xl">
        <SectionHeader
          eyebrow="Most valuable"
          title="Top items by value"
          as="h3"
        />
        <motion.ul
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-sm"
        >
          {value.topItems.map((item) => {
            const closetItem = closetItemById(item.closetItemId);
            return (
              <motion.li key={item.closetItemId} variants={listItem}>
                <Link
                  href={`/dashboard/closet/${item.closetItemId}`}
                  className="group flex items-center gap-lg rounded-md border border-border bg-surface p-md transition-colors duration-200 hover:bg-[color:var(--color-overlay-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  {closetItem && (
                    <GarmentImage
                      item={closetItem}
                      size="sm"
                      className="size-14 shrink-0 rounded-sm border border-border"
                    />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-body-medium text-text-primary">
                      {item.name}
                    </span>
                    <span className="block truncate text-caption text-text-muted capitalize">
                      {item.type}
                    </span>
                  </span>
                  <span className="shrink-0 text-body-semibold text-text-primary tabular-nums">
                    {formatCurrency(item.estimatedValue, value.currency)}
                  </span>
                  <ChevronRight
                    aria-hidden
                    className="size-4 shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </section>

      <p className="mt-3xl text-caption text-text-muted">
        Estimates are indicative, not an appraisal. Condition and provenance
        move real resale prices more than anything a photo can show.
      </p>
    </div>
  );
}
