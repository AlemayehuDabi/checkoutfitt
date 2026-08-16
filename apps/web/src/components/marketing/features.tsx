"use client";

import * as React from "react";
import { Camera, MessageCircle, ShoppingBag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import {
  ChatVisual,
  ClosetVisual,
  OutfitVisual,
  ShoppingVisual,
} from "./feature-visuals";

const FEATURES = [
  {
    eyebrow: "Digital closet",
    icon: Camera,
    title: "Snap, upload, done",
    body: "Photograph each piece once. We identify the garment, colour, fabric and cut automatically — no forms, no tagging, no spreadsheet.",
    points: ["Automatic garment detection", "Background removal built in", "Bulk upload up to 20 at once"],
    Visual: ClosetVisual,
  },
  {
    eyebrow: "Daily outfits",
    icon: Sparkles,
    title: "What to wear, solved",
    body: "Every morning you get a look built from clothes you already own, matched to the forecast where you are and whatever the day holds.",
    points: ["Weather-aware every morning", "Ten occasion presets", "Explains why it works"],
    Visual: OutfitVisual,
  },
  {
    eyebrow: "AI stylist",
    icon: MessageCircle,
    title: "Your stylist, always on",
    body: "Ask the way you'd ask a friend who dresses well. It knows your wardrobe, so the answer is always something you can actually wear tonight.",
    points: ["Knows every piece you own", "Sends back real outfits", "Photo feedback on request"],
    Visual: ChatVisual,
  },
  {
    eyebrow: "Smart shopping",
    icon: ShoppingBag,
    title: "Buy smarter, not more",
    body: "Before you spend anything, check it against your closet. We'll tell you how many new outfits it unlocks — or that you already own something close.",
    points: ["Worth it / maybe / skip verdict", "Flags near-duplicates", "Shows outfits it would create"],
    Visual: ShoppingVisual,
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-6xl">
      <div className="mx-auto w-full max-w-[1200px] px-lg sm:px-3xl">
        <Reveal className="mx-auto max-w-[62ch] text-center">
          <p className="text-eyebrow uppercase text-primary-500">
            What you get
          </p>
          <h2 className="mt-md text-display text-text-primary text-balance">
            Everything you own, finally usable
          </h2>
          <p className="mt-lg text-body-lg text-text-secondary">
            Most people wear a fraction of their wardrobe because they can&apos;t
            see it all at once. CheckoutFitt fixes that.
          </p>
        </Reveal>

        <div className="mt-6xl flex flex-col gap-6xl">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            const Visual = feature.Visual;
            // Alternate sides so the eye zig-zags down the page.
            const flip = index % 2 === 1;

            return (
              <div
                key={feature.title}
                className="grid items-center gap-4xl lg:grid-cols-2 lg:gap-6xl"
              >
                <Reveal className={cn(flip && "lg:order-2")}>
                  <span
                    aria-hidden
                    className="inline-flex size-12 items-center justify-center rounded-md bg-primary-50 text-primary-500"
                  >
                    <Icon className="size-6" />
                  </span>
                  <p className="mt-lg text-eyebrow uppercase text-text-muted">
                    {feature.eyebrow}
                  </p>
                  <h3 className="mt-sm text-h1 text-text-primary text-balance">
                    {feature.title}
                  </h3>
                  <p className="mt-lg max-w-[52ch] text-body-lg text-text-secondary">
                    {feature.body}
                  </p>
                  <ul className="mt-xl flex flex-col gap-md">
                    {feature.points.map((point) => (
                      <li key={point} className="flex items-center gap-md">
                        <span
                          aria-hidden
                          className="size-1.5 shrink-0 rounded-full bg-primary-500"
                        />
                        <span className="text-body text-text-secondary">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                <Reveal delay={0.1} className={cn(flip && "lg:order-1")}>
                  <Visual />
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
