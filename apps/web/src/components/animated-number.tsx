"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

/**
 * Counts a number up on mount.
 *
 * Rendered straight from the motion value — like ScoreCircle — so there's no
 * React state churning once per frame. Reduced motion lands on the final
 * value immediately.
 */
export function AnimatedNumber({
  value,
  format,
  duration = 1.2,
  className,
}: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const progress = useMotionValue(reduce ? value : 0);
  const display = useTransform(progress, (v) =>
    format ? format(v) : Math.round(v).toLocaleString("en-US"),
  );

  React.useEffect(() => {
    if (reduce) {
      progress.set(value);
      return;
    }
    const controls = animate(progress, value, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [value, duration, progress, reduce]);

  return (
    <motion.span className={className} aria-label={String(value)}>
      {display}
    </motion.span>
  );
}
