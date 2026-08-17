"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CloudSun,
  Shirt,
  Sparkles,
  Wand2,
  type LucideIcon,
} from "lucide-react";

const CAPABILITIES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Shirt,
    title: "Styles from your closet",
    body: "Every suggestion uses pieces you already own — nothing you'd have to go and buy.",
  },
  {
    icon: CloudSun,
    title: "Knows the forecast",
    body: "Ask what to wear today and it factors in the weather where you are.",
  },
  {
    icon: Wand2,
    title: "Reads your whole wardrobe",
    body: "It can analyse what you own as a collection and tell you what's missing.",
  },
];

/**
 * Pre-conversation state. A centered hero that says what the stylist can
 * actually do, rather than an empty scroll area waiting for a first message.
 */
export function ChatWelcome() {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-lg py-5xl text-center">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <span
          aria-hidden
          className="inline-flex size-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-500 shadow-sm ring-1 ring-primary-200"
        >
          <Sparkles className="size-8" />
        </span>
        <h2 className="mt-2xl text-display text-text-primary text-balance">
          What are you dressing for?
        </h2>
        <p className="mx-auto mt-lg max-w-[52ch] text-body-lg text-text-secondary">
          Describe the occasion, the weather, or just the mood — your stylist
          will put together a look from what&apos;s already in your closet.
        </p>
      </motion.div>

      <div className="mt-5xl grid w-full max-w-[840px] gap-2xl sm:grid-cols-3">
        {CAPABILITIES.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.12 + index * 0.07,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="rounded-xl border border-border bg-surface p-2xl text-left shadow-sm"
            >
              <span
                aria-hidden
                className="inline-flex size-10 items-center justify-center rounded-md bg-primary-50 text-primary-500"
              >
                <Icon className="size-5" />
              </span>
              <p className="mt-lg text-body-semibold text-text-primary">
                {item.title}
              </p>
              <p className="mt-sm text-body text-text-secondary">{item.body}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
