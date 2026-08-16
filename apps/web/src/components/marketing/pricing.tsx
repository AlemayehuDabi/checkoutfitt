"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PlanPicker } from "@/components/profile/plan-picker";
import { Reveal } from "./reveal";

/**
 * Reuses the in-app PlanPicker so the plan comparison can't drift between
 * marketing and the product — only the CTAs differ, since a visitor has no
 * account to be "currently on".
 */
export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 py-6xl">
      <div className="mx-auto w-full max-w-[1200px] px-lg sm:px-3xl">
        <Reveal>
          <PlanPicker
            eyebrow="Pricing"
            heading="Start free, upgrade if you need to"
            description="The closet, daily outfits and the stylist chat are free forever. Pro adds planning tools for people who travel and plan ahead."
            className="py-0"
            freeAction={
              <ButtonLink href="/sign-up" variant="secondary" fullWidth>
                Get started free
              </ButtonLink>
            }
            proAction={
              <ButtonLink
                href="/sign-up"
                size="lg"
                fullWidth
                iconLeft={<Sparkles className="size-4" />}
              >
                Start 7-day free trial
              </ButtonLink>
            }
          />
        </Reveal>

        <p className="mt-2xl text-center text-caption text-text-muted">
          Cancel anytime. No commitment.
        </p>
      </div>
    </section>
  );
}
