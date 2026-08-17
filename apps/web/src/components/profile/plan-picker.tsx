"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Minus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { PromoBadge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

type Cycle = "monthly" | "yearly";

const FEATURES = [
  { label: "Digital closet & outfit generation", free: true },
  { label: "Daily weather-based outfit", free: true },
  { label: "AI stylist chat", free: true },
  { label: "Outfit calendar", free: true },
  { label: "Unlimited outfit ratings", free: false },
  { label: "Multi-day outfit planning", free: false },
  { label: "Travel packing lists", free: false },
  { label: "Capsule wardrobe builder", free: false },
  { label: "Inspiration matching", free: false },
];

const PRICES: Record<Cycle, { pro: string; suffix: string; note: string }> = {
  monthly: { pro: "$9.99", suffix: "/month", note: "Billed monthly" },
  yearly: { pro: "$7.99", suffix: "/month", note: "$95.88 billed yearly" },
};

function FeatureRow({
  label,
  included,
  tone,
}: {
  label: string;
  included: boolean;
  tone: "free" | "pro";
}) {
  return (
    <li className="flex items-start gap-md">
      <span
        aria-hidden
        className={cn(
          "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full",
          !included
            ? "bg-surface-tertiary text-text-muted"
            : tone === "pro"
              ? "bg-primary-500 text-white"
              : "bg-surface-secondary text-text-muted",
        )}
      >
        {included ? (
          <Check className="size-3" strokeWidth={3} />
        ) : (
          <Minus className="size-3" strokeWidth={3} />
        )}
      </span>
      <span
        className={cn(
          "text-body",
          included ? "text-text-secondary" : "text-text-muted line-through decoration-text-muted/40",
        )}
      >
        {label}
      </span>
      <span className="sr-only">{included ? "included" : "not included"}</span>
    </li>
  );
}

export interface PlanPickerProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  /** Marketing overrides the in-app CTAs with sign-up links. */
  freeAction?: React.ReactNode;
  proAction?: React.ReactNode;
  className?: string;
}

export function PlanPicker({
  eyebrow = "Subscription",
  heading = "Choose your plan",
  description = "Everything you need to dress well from what you own is free. Pro adds the planning tools.",
  freeAction,
  proAction,
  className,
}: PlanPickerProps = {}) {
  const { toast } = useToast();
  const reduce = useReducedMotion();
  const [cycle, setCycle] = React.useState<Cycle>("yearly");
  const price = PRICES[cycle];

  return (
    <div className={cn("mx-auto max-w-[900px] py-4xl", className)}>
      <div className="text-center">
        <p className="text-eyebrow uppercase text-text-muted">{eyebrow}</p>
        <h2 className="mt-sm text-display text-text-primary text-balance">
          {heading}
        </h2>
        <p className="mx-auto mt-md max-w-[52ch] text-body-lg text-text-secondary">
          {description}
        </p>
      </div>

      {/* Billing cycle — the shared segmented control rather than a
          one-off pill row, so it behaves like every other 2-option choice. */}
      <div className="mt-2xl flex justify-center">
        <SegmentedControl
          label="Billing cycle"
          value={cycle}
          onChange={setCycle}
          options={[
            { value: "monthly", label: "Monthly" },
            {
              value: "yearly",
              label: (
                <span className="flex items-center gap-sm">
                  Yearly
                  <span className="rounded-sm bg-success-light px-1.5 py-0.5 text-[10px] font-[700] tracking-[0.06em] text-success uppercase">
                    Save 20%
                  </span>
                </span>
              ),
            },
          ]}
        />
      </div>

      {/* Plans — Pro is intentionally taller and heavier so it reads first. */}
      <div className="mt-3xl grid items-start gap-2xl sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-2xl shadow-md">
          <p className="text-h3 text-text-primary">Free</p>
          <p className="mt-sm flex items-baseline gap-1">
            <span className="text-display text-text-primary">$0</span>
            <span className="text-body text-text-muted">/month</span>
          </p>
          <p className="mt-1 text-caption text-text-muted">
            Everything essential, forever
          </p>

          <ul className="mt-2xl flex flex-col gap-md">
            {FEATURES.map((feature) => (
              <FeatureRow
                key={feature.label}
                label={feature.label}
                included={feature.free}
                tone="free"
              />
            ))}
          </ul>

          <div className="mt-2xl">
            {freeAction ?? (
              <Button variant="secondary" fullWidth disabled>
                Current plan
              </Button>
            )}
          </div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="relative rounded-xl border-[1.5px] border-primary-500 bg-surface p-2xl shadow-xl sm:-mt-4 sm:pb-3xl"
        >
          {/* Badge straddles the top border. */}
          <span className="absolute -top-3 left-1/2 -translate-x-1/2">
            <PromoBadge>Most popular</PromoBadge>
          </span>

          <p className="text-h3 text-primary-500">Pro</p>
          <p className="mt-sm flex items-baseline gap-1">
            <span className="text-display text-text-primary tabular-nums">
              {price.pro}
            </span>
            <span className="text-body text-text-muted">{price.suffix}</span>
          </p>
          <p className="mt-1 text-caption text-text-muted">{price.note}</p>

          <ul className="mt-2xl flex flex-col gap-md">
            {FEATURES.map((feature) => (
              <FeatureRow key={feature.label} label={feature.label} included tone="pro" />
            ))}
          </ul>

          <div className="mt-2xl">
            {proAction ?? (
              <Button
                fullWidth
                size="lg"
                iconLeft={<Sparkles className="size-4" />}
                onClick={() =>
                  toast({
                    kind: "info",
                    title: "Checkout isn't wired up yet",
                    description: "Billing arrives with the payments integration.",
                  })
                }
              >
                Start 7-day free trial
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      <p className="mt-2xl text-center text-caption text-text-muted">
        Cancel anytime. No commitment.
      </p>
    </div>
  );
}
