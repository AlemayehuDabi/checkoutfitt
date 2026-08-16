"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Scroll-triggered reveal used across the marketing sections.
 *
 * `whileInView` with `once` means each block animates the first time it
 * enters the viewport and then stays put — re-animating on every scroll-by
 * is the thing that makes marketing pages feel restless.
 */
export function Reveal({
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
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
