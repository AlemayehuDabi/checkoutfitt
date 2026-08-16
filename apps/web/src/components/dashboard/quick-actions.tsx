"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Shirt, Sparkles } from "lucide-react";
import { SHADOW_LG, SHADOW_PRIMARY } from "@/lib/motion";

/**
 * Two shortcuts, deliberately unequal: Generate is filled in primary so the
 * action we want people to take is the one that reads first.
 */
export function QuickActions({ itemCount }: { itemCount: number }) {
  const reduce = useReducedMotion();

  return (
    <div className="grid gap-lg sm:grid-cols-2">
      <motion.div
        whileHover={reduce ? undefined : { y: -3, boxShadow: SHADOW_LG }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="rounded-xl border border-border bg-surface shadow-md transition-colors duration-200 hover:border-border-strong"
      >
        <Link
          href="/dashboard/closet"
          className="group flex h-full items-center gap-lg rounded-xl p-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-500">
            <Shirt aria-hidden className="size-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-body-semibold text-text-primary">
              My Closet
            </span>
            <span className="block text-sm text-text-secondary tabular-nums">
              {itemCount} {itemCount === 1 ? "piece" : "pieces"} catalogued
            </span>
          </span>
          <ArrowRight
            aria-hidden
            className="size-5 shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </motion.div>

      <motion.div
        whileHover={reduce ? undefined : { y: -3, boxShadow: SHADOW_PRIMARY }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="rounded-xl bg-primary-500 shadow-primary"
      >
        <Link
          href="/dashboard/generate"
          className="group flex h-full items-center gap-lg rounded-xl p-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-md bg-white/15 text-white">
            <Sparkles aria-hidden className="size-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-body-semibold text-white">
              Generate an outfit
            </span>
            <span className="block text-sm text-white/75">
              Pick an occasion, get a look
            </span>
          </span>
          <ArrowRight
            aria-hidden
            className="size-5 shrink-0 text-white/80 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </motion.div>
    </div>
  );
}
