import * as React from "react";
import { Star } from "lucide-react";

/** Understated single strip — deliberately quiet so the hero keeps the weight. */
export function SocialProof() {
  return (
    <section className="border-y border-border bg-surface-secondary">
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-center gap-lg px-lg py-xl text-center sm:gap-3xl sm:px-3xl">
        <p className="text-body-medium text-text-secondary">
          Trusted by{" "}
          <span className="font-[600] text-text-primary tabular-nums">24,000+</span>{" "}
          style-conscious people
        </p>

        <span aria-hidden className="hidden h-4 w-px bg-border-strong sm:block" />

        <p className="flex items-center gap-sm text-body-medium text-text-secondary">
          <span aria-hidden className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-4 fill-primary-500 text-primary-500" />
            ))}
          </span>
          <span className="font-[600] text-text-primary tabular-nums">4.8</span>
          <span className="text-text-muted">from 1,900 reviews</span>
        </p>

        <span aria-hidden className="hidden h-4 w-px bg-border-strong sm:block" />

        <p className="text-body-medium text-text-secondary">
          <span className="font-[600] text-text-primary tabular-nums">1.2M</span>{" "}
          outfits generated
        </p>
      </div>
    </section>
  );
}
