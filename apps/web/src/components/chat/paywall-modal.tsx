"use client";

import * as React from "react";
import { Check, Minus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PromoBadge } from "@/components/ui/badge";

const FEATURES: { label: string; free: boolean; pro: boolean }[] = [
  { label: "Digital closet & outfit generation", free: true, pro: true },
  { label: "Daily weather-based outfit", free: true, pro: true },
  { label: "AI stylist chat", free: true, pro: true },
  { label: "Multi-day outfit planning", free: false, pro: true },
  { label: "Travel packing lists", free: false, pro: true },
  { label: "Capsule wardrobe builder", free: false, pro: true },
  { label: "Unlimited outfit ratings", free: false, pro: true },
];

function Mark({ on }: { on: boolean }) {
  return on ? (
    <Check aria-label="Included" className="mx-auto size-4 text-success" />
  ) : (
    <Minus aria-label="Not included" className="mx-auto size-4 text-text-muted" />
  );
}

/** Feature comparison paywall. CTAs are intentionally inert in this build. */
export function PaywallModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Plan a whole week with Pro"
      description="Multi-day planning, packing lists and capsule building are part of CheckoutFitt Pro."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Not now
          </Button>
          <Button iconLeft={<Sparkles className="size-4" />} onClick={onClose}>
            Upgrade to Pro
          </Button>
        </>
      }
    >
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-secondary">
              <th className="px-lg py-md text-caption uppercase tracking-[0.06em] text-text-muted">
                Feature
              </th>
              <th className="w-20 px-lg py-md text-center text-caption uppercase tracking-[0.06em] text-text-muted">
                Free
              </th>
              <th className="w-24 px-lg py-md text-center">
                <PromoBadge>Pro</PromoBadge>
              </th>
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((feature, index) => (
              <tr
                key={feature.label}
                className={index > 0 ? "border-t border-border" : undefined}
              >
                <td className="px-lg py-md text-body text-text-primary">
                  {feature.label}
                </td>
                <td className="px-lg py-md">
                  <Mark on={feature.free} />
                </td>
                <td className="bg-primary-50 px-lg py-md">
                  <Mark on={feature.pro} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-lg text-center text-caption text-text-muted">
        Cancel any time. Your closet stays yours either way.
      </p>
    </Modal>
  );
}
