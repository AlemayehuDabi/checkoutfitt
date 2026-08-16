"use client";

import * as React from "react";
import {
  CheckCircle2,
  CloudSun,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { closetItemById, mockOutfits } from "@/lib/mock-data";
import { GarmentImage } from "@/components/garment-image";
import { OutfitImage } from "@/components/outfit-image";

/**
 * Each feature is illustrated with the real component it describes rather
 * than a generic icon — the closet visual is an actual garment grid, the
 * chat visual uses real bubble geometry. It stays honest as the product moves.
 */

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-xl shadow-lg">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(70% 60% at 20% 0%, #fff5f0 0%, rgba(255,245,240,0) 70%)",
        }}
      />
      {children}
    </div>
  );
}

export function ClosetVisual() {
  const items = ["ci_01", "ci_05", "ci_09", "ci_12", "ci_02", "ci_16"]
    .map(closetItemById)
    .filter((i): i is NonNullable<typeof i> => Boolean(i));

  return (
    <Frame>
      <div className="mb-lg flex items-center gap-md rounded-md border-2 border-dashed border-primary-300 bg-primary-50 px-lg py-md">
        <UploadCloud aria-hidden className="size-5 text-primary-500" />
        <p className="text-sm text-text-secondary">6 photos analyzed</p>
        <CheckCircle2 aria-hidden className="ml-auto size-5 text-success" />
      </div>
      <ul className="grid grid-cols-3 gap-md">
        {items.map((item) => (
          <li key={item.id}>
            <GarmentImage
              item={item}
              size="sm"
              className="aspect-square w-full rounded-md border border-border"
            />
            <p className="mt-1.5 truncate text-caption text-text-muted">
              {item.category}
            </p>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function OutfitVisual() {
  const outfit = mockOutfits[0];
  return (
    <Frame>
      <div className="mb-lg flex items-center gap-md rounded-md bg-surface-secondary px-lg py-md">
        <CloudSun aria-hidden className="size-6 text-primary-500" />
        <p className="text-body-medium text-text-primary tabular-nums">21°</p>
        <p className="text-caption text-text-muted">partly cloudy · Lisbon</p>
      </div>
      <OutfitImage
        items={outfit.items}
        variant="hero"
        className="h-44 w-full overflow-hidden rounded-md border border-border"
      />
      <p className="mt-lg flex items-center gap-sm text-eyebrow uppercase text-primary-500">
        <Sparkles aria-hidden className="size-3.5" />
        Picked for the office
      </p>
      <p className="mt-sm line-clamp-2 text-body text-text-secondary">
        {outfit.explanation}
      </p>
    </Frame>
  );
}

export function ChatVisual() {
  return (
    <Frame>
      <ul className="flex flex-col gap-md">
        <li className="flex justify-end">
          <span className="max-w-[75%] rounded-[16px_16px_4px_16px] bg-primary-500 px-lg py-md text-body text-text-on-primary">
            I&apos;ve got a client meeting Thursday. What should I wear?
          </span>
        </li>
        <li className="flex gap-md">
          <span
            aria-hidden
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-500"
          >
            <Sparkles className="size-4" />
          </span>
          <span className="max-w-[80%] rounded-[16px_16px_16px_4px] border border-border bg-bg px-lg py-md text-body text-text-secondary">
            Structured but not stiff. Your silk blouse with the charcoal
            trousers and the loafers — polished without trying too hard.
          </span>
        </li>
        <li className="flex justify-end">
          <span className="rounded-[16px_16px_4px_16px] bg-primary-500 px-lg py-md text-body text-text-on-primary">
            Is the belt necessary?
          </span>
        </li>
      </ul>
    </Frame>
  );
}

export function ShoppingVisual() {
  return (
    <Frame>
      <div className="flex items-start gap-lg">
        <GarmentImage
          item={{ type: "OUTERWEAR", color: "Camel", category: "Trench coat" }}
          className="size-24 shrink-0 rounded-md border border-border"
        />
        <div className="min-w-0">
          <p className="text-caption text-text-muted">Camel trench coat</p>
          <p className="mt-1 flex items-center gap-sm text-h2 text-success">
            <CheckCircle2 aria-hidden className="size-6" />
            Worth it
          </p>
        </div>
      </div>
      <p className="mt-lg text-body text-text-secondary">
        Fills the gap between your one warm layer and your light jacket — and
        camel already sits inside the palette you wear.
      </p>
      <div className="mt-lg flex items-center gap-lg rounded-md bg-surface-secondary px-lg py-md">
        <Sparkles aria-hidden className="size-5 shrink-0 text-primary-500" />
        <p className="text-body text-text-secondary">
          <span className="text-h3 text-text-primary tabular-nums">12</span> new
          outfits unlocked
        </p>
      </div>
    </Frame>
  );
}
