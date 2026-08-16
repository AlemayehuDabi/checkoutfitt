"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Camera, Shirt, Sparkles } from "lucide-react";
import { Reveal } from "./reveal";

const STEPS = [
  {
    icon: Camera,
    title: "Upload your wardrobe",
    body: "Photograph your pieces. We identify each one and build your digital closet.",
  },
  {
    icon: Sparkles,
    title: "Tell us your style",
    body: "A two-minute quiz on how you dress, your sizes, and where you live.",
  },
  {
    icon: Shirt,
    title: "Get dressed with confidence",
    body: "Open the app each morning and wear what it tells you. That's it.",
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-border bg-surface-secondary py-6xl"
    >
      <div className="mx-auto w-full max-w-[1200px] px-lg sm:px-3xl">
        <Reveal className="mx-auto max-w-[56ch] text-center">
          <p className="text-eyebrow uppercase text-primary-500">How it works</p>
          <h2 className="mt-md text-display text-text-primary text-balance">
            Three steps, then you&apos;re done thinking about it
          </h2>
        </Reveal>

        <div className="relative mt-6xl">
          {/* Connector — draws itself as the section scrolls into view. */}
          <motion.div
            aria-hidden
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            style={{ originX: 0 }}
            className="absolute top-8 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 md:block"
          />

          <ol className="relative grid gap-4xl md:grid-cols-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal
                  key={step.title}
                  delay={0.15 + index * 0.15}
                  className="text-center"
                >
                  <li className="flex flex-col items-center">
                    <span className="relative inline-flex size-16 items-center justify-center rounded-full border border-border bg-surface text-primary-500 shadow-md">
                      <Icon aria-hidden className="size-7" />
                      <span className="absolute -top-1.5 -right-1.5 inline-flex size-6 items-center justify-center rounded-full bg-primary-500 text-[11px] font-[700] text-text-on-primary tabular-nums">
                        {index + 1}
                      </span>
                    </span>
                    <h3 className="mt-xl text-h3 text-text-primary text-balance">
                      {step.title}
                    </h3>
                    <p className="mx-auto mt-sm max-w-[34ch] text-body text-text-secondary">
                      {step.body}
                    </p>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
