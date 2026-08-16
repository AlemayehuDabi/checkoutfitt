"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "./reveal";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-6xl">
      {/* Deepest use of the palette on the page — the closing note. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(70% 70% at 20% 15%, #d4783c 0%, rgba(212,120,60,0) 60%), radial-gradient(60% 60% at 85% 80%, #8a4119 0%, rgba(138,65,25,0) 60%), linear-gradient(140deg, #c1622d 0%, #a64f21 55%, #7a3714 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 8px), repeating-linear-gradient(-45deg, #fff 0 1px, transparent 1px 8px)",
        }}
      />

      <Reveal className="mx-auto w-full max-w-[760px] px-lg text-center sm:px-3xl">
        <h2 className="text-display text-white text-balance">
          Stop wondering what to wear
        </h2>
        <p className="mx-auto mt-lg max-w-[48ch] text-body-lg text-white/80">
          Your wardrobe already has the answer. CheckoutFitt just shows you
          where it is — every morning, in about ten seconds.
        </p>

        <div className="mt-3xl flex justify-center">
          <ButtonLink
            href="/sign-up"
            size="lg"
            variant="outline"
            iconRight={<ArrowRight className="size-4" />}
            className="border-transparent bg-surface text-primary-500 hover:bg-primary-50 hover:text-primary-600"
          >
            Get started free
          </ButtonLink>
        </div>

        <p className="mt-lg text-caption text-white/70">
          No credit card required
        </p>
      </Reveal>
    </section>
  );
}
