"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "./hero-visual";
import { scrollToSection } from "./nav-bar";

const STAGGER = 0.09;

export function Hero() {
  const reduce = useReducedMotion();

  const rise = (index: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.55,
      delay: index * STAGGER,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  });

  return (
    <section className="relative overflow-hidden pt-6xl pb-5xl">
      {/* Warm gradient ground — never flat. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(70% 55% at 15% 0%, #fbeee6 0%, rgba(251,238,230,0) 60%), radial-gradient(60% 50% at 85% 10%, #fff5f0 0%, rgba(255,245,240,0) 65%), linear-gradient(180deg, #faf8f5 0%, #faf8f5 70%, #f5f1ea 100%)",
        }}
      />

      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-5xl px-lg pt-4xl sm:px-3xl lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-sm rounded-full border border-primary-200 bg-primary-50 px-md py-1.5 text-tag font-[600] text-primary-500"
          >
            <Star aria-hidden className="size-3.5 fill-current" />
            Your wardrobe, finally working for you
          </motion.p>

          <motion.h1
            {...rise(1)}
            className="mt-xl text-hero text-text-primary text-balance"
          >
            Your closet,{" "}
            <span className="text-primary-500">reimagined</span>
          </motion.h1>

          <motion.p
            {...rise(2)}
            className="mt-xl max-w-[52ch] text-body-lg text-text-secondary"
          >
            CheckoutFitt photographs and understands everything you own, then
            tells you what to wear each morning — matched to the weather, the
            occasion, and the way you actually dress.
          </motion.p>

          <motion.div {...rise(3)} className="mt-3xl flex flex-wrap items-center gap-md">
            <ButtonLink href="/sign-up" size="lg" iconRight={<ArrowRight className="size-4" />}>
              Get started free
            </ButtonLink>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => scrollToSection("features")}
            >
              See how it works
            </Button>
          </motion.div>

          <motion.p {...rise(4)} className="mt-lg text-caption text-text-muted">
            Free forever plan · No credit card required
          </motion.p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="pt-4xl lg:pt-0"
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
