import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Bookmark, Lightbulb, RefreshCw, Sparkles } from "lucide-react";
import {
  CONTEXT_LABELS,
  mockTodaysOutfit,
  mockWeather,
} from "@/lib/mock-data";
import { Button, ButtonLink } from "@/components/ui/button";
import { CalloutCard } from "@/components/ui/callout-card";
import { Tag } from "@/components/ui/chip";
import { OutfitImage } from "@/components/outfit-image";
import { GarmentImage } from "@/components/garment-image";
import { WeatherStrip } from "@/components/dashboard/weather-strip";

export const metadata: Metadata = {
  title: "Today's outfit",
  description: "The look picked for you today, and why.",
};

export default function TodayPage() {
  const outfit = mockTodaysOutfit;

  return (
    <div className="py-2xl">
      <Link
        href="/"
        className="mb-xl inline-flex items-center gap-sm rounded-sm text-sm text-text-muted transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to home
      </Link>

      {/* Detail layout: sticky image left, scrolling content right. */}
      <div className="grid gap-3xl lg:grid-cols-[45%_1fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <OutfitImage
            items={outfit.items}
            variant="hero"
            className="aspect-[4/5] w-full overflow-hidden rounded-xl shadow-md"
          />
        </div>

        <div>
          <p className="flex items-center gap-sm text-eyebrow uppercase text-primary-500">
            <Sparkles aria-hidden className="size-3.5" />
            Today&apos;s outfit
          </p>
          <h2 className="mt-md text-h1 text-text-primary text-balance">
            Made for {CONTEXT_LABELS[outfit.context].toLowerCase()}
          </h2>

          <div className="mt-xl">
            <WeatherStrip weather={mockWeather} />
          </div>

          <CalloutCard
            icon={<Lightbulb />}
            title="Why this outfit"
            className="mt-xl"
          >
            {outfit.explanation}
          </CalloutCard>

          <section className="mt-3xl">
            <h3 className="text-h3 text-text-primary">
              Pieces{" "}
              <span className="text-body text-text-muted tabular-nums">
                ({outfit.items.length})
              </span>
            </h3>

            <ul className="mt-lg flex flex-col gap-sm">
              {outfit.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/closet/${item.id}`}
                    className="group flex items-center gap-lg rounded-md border border-border bg-surface p-md transition-colors duration-200 hover:bg-[color:var(--color-overlay-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                  >
                    <GarmentImage
                      item={item}
                      size="sm"
                      className="size-14 shrink-0 rounded-sm border border-border"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body-medium text-text-primary">
                        {item.category}
                      </span>
                      <span className="block truncate text-caption text-text-muted">
                        {item.color}
                      </span>
                    </span>
                    <Tag className="hidden sm:inline-flex">
                      {item.type?.toLowerCase()}
                    </Tag>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-3xl flex flex-wrap gap-md">
            <Button iconLeft={<Bookmark className="size-4" />}>
              {outfit.saved ? "Saved" : "Save this outfit"}
            </Button>
            <ButtonLink href="/generate" variant="secondary" iconLeft={<RefreshCw className="size-4" />}>
                Try another
              </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
