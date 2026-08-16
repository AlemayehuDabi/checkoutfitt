"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface ScoreCircleProps {
  /** 0–10. */
  score: number;
  label?: string;
  size?: number;
  className?: string;
}

/**
 * SVG ring that fills while the number counts up from zero.
 *
 * Both animations are driven from one motion value so the ring and the digits
 * can never disagree mid-flight. With reduced motion the final state renders
 * immediately.
 */
export function ScoreCircle({
  score,
  label,
  size = 80,
  className,
}: ScoreCircleProps) {
  const reduce = useReducedMotion();
  const clamped = Math.min(10, Math.max(0, score));

  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useMotionValue(reduce ? clamped : 0);
  const dashoffset = useTransform(
    progress,
    (v) => circumference - (v / 10) * circumference,
  );
  // Rendered straight from the motion value, so the digits and the ring are
  // driven by the same source and no React state re-renders per frame.
  const display = useTransform(progress, (v) => v.toFixed(1));

  React.useEffect(() => {
    if (reduce) {
      progress.set(clamped);
      return;
    }
    const controls = animate(progress, clamped, {
      duration: 1.2,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [clamped, progress, reduce]);

  return (
    <div className={cn("inline-flex flex-col items-center gap-sm", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="img"
          aria-label={`${clamped.toFixed(1)} out of 10${label ? ` — ${label}` : ""}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-primary-200)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-primary-500)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: dashoffset }}
          />
        </svg>
        <motion.span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center text-score text-primary-500 tabular-nums"
        >
          {display}
        </motion.span>
      </div>
      {label && <span className="text-caption text-text-muted">{label}</span>}
    </div>
  );
}

/** Compact inline score pill, tinted by band. */
export function ScoreBadge({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const tone =
    score >= 8
      ? "bg-success-light text-success"
      : score >= 6
        ? "bg-primary-50 text-primary-500"
        : "bg-warning-light text-warning-strong";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-tag font-[600] tabular-nums",
        tone,
        className,
      )}
    >
      {score.toFixed(1)}
    </span>
  );
}
