"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { VERDICT_LABELS, type ShoppingVerdict } from "@/lib/mock-data";

/** Semantic colour per verdict — separate from the brand accent. */
const VERDICT_STYLE: Record<
  ShoppingVerdict,
  { text: string; chip: string; icon: React.ElementType }
> = {
  worth_it: {
    text: "text-success",
    chip: "bg-success-light text-success",
    icon: CheckCircle2,
  },
  maybe: {
    text: "text-warning",
    chip: "bg-warning-light text-warning-strong",
    icon: AlertTriangle,
  },
  skip: {
    text: "text-danger",
    chip: "bg-danger-light text-danger",
    icon: XCircle,
  },
};

export function VerdictBadge({ verdict }: { verdict: ShoppingVerdict }) {
  const reduce = useReducedMotion();
  const { text, icon: Icon } = VERDICT_STYLE[verdict];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className="flex items-center gap-md"
    >
      <Icon aria-hidden className={cn("size-9 shrink-0", text)} />
      <p className={cn("text-display", text)}>{VERDICT_LABELS[verdict]}</p>
    </motion.div>
  );
}

export function VerdictChip({
  verdict,
  children,
}: {
  verdict: ShoppingVerdict;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-tag font-[600]",
        VERDICT_STYLE[verdict].chip,
      )}
    >
      {children}
    </span>
  );
}
