"use client";

import * as React from "react";
import { Quote, Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Reveal } from "./reveal";

const TESTIMONIALS = [
  {
    quote:
      "I stopped buying clothes I already owned in a slightly different colour. The shopping check alone has paid for the year.",
    name: "Maya Okafor",
    role: "Product designer, Lisbon",
  },
  {
    quote:
      "I have the same wardrobe I had six months ago and I get compliments constantly now. It turns out I just couldn't see what I had.",
    name: "Daniel Reyes",
    role: "Architect, Madrid",
  },
  {
    quote:
      "Getting dressed used to eat twenty minutes and most of my patience. Now I look at one card and put it on.",
    name: "Priya Raman",
    role: "Consultant, London",
  },
];

export function Testimonials() {
  return (
    <section className="py-6xl">
      <div className="mx-auto w-full max-w-[1200px] px-lg sm:px-3xl">
        <Reveal className="mx-auto max-w-[56ch] text-center">
          <p className="text-eyebrow uppercase text-primary-500">
            What people say
          </p>
          <h2 className="mt-md text-display text-text-primary text-balance">
            Fewer clothes. Better outfits.
          </h2>
        </Reveal>

        <ul className="mt-5xl grid gap-2xl md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 0.12}>
              <li className="flex h-full flex-col rounded-xl border border-border bg-surface p-xl shadow-md">
                <Quote
                  aria-hidden
                  className="size-7 shrink-0 text-primary-300"
                />
                <blockquote className="mt-lg flex-1 text-body-lg text-text-secondary">
                  {testimonial.quote}
                </blockquote>

                <div className="mt-xl flex items-center gap-md border-t border-border pt-lg">
                  <Avatar name={testimonial.name} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-body-medium text-text-primary">
                      {testimonial.name}
                    </p>
                    <p className="truncate text-caption text-text-muted">
                      {testimonial.role}
                    </p>
                  </div>
                  <span aria-label="5 out of 5" className="ml-auto flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        aria-hidden
                        className="size-3.5 fill-primary-500 text-primary-500"
                      />
                    ))}
                  </span>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
