import type { Metadata } from "next";
import Link from "next/link";
import { Lightbulb, Shirt, Sparkles } from "lucide-react";
import {
  CONTEXT_LABELS,
  mockClosetItems,
  mockOutfits,
  mockTodaysOutfit,
  mockUser,
  mockWeather,
} from "@/lib/mock-data";
import { ButtonLink } from "@/components/ui/button";
import { CalloutCard } from "@/components/ui/callout-card";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StateView } from "@/components/ui/state-view";
import { OutfitImage } from "@/components/outfit-image";
import { Greeting } from "@/components/dashboard/greeting";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TodaysOutfitCard } from "@/components/dashboard/todays-outfit-card";
import { WeatherStrip } from "@/components/dashboard/weather-strip";

export const metadata: Metadata = {
  title: "Home",
  description: "Today's outfit, the weather, and your closet at a glance.",
};

export default function HomePage() {
  const todaysOutfit = mockTodaysOutfit;
  const recent = mockOutfits.slice(1, 5);
  const itemCount = mockClosetItems.filter((i) => !i.archived).length;

  return (
    <div className="mx-auto max-w-[1200px] py-2xl">
      <Greeting name={mockUser.name} />

      {/* Primary column carries the hero; the rail holds shortcuts and
          secondary content so the page fills the width instead of running as
          one long stack. Collapses to a single column below xl. */}
      <div className="mt-3xl grid items-start gap-2xl xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] xl:gap-4xl">
        <div className="flex min-w-0 flex-col gap-2xl">
          <WeatherStrip weather={mockWeather} />

          {todaysOutfit ? (
            <TodaysOutfitCard outfit={todaysOutfit} />
          ) : (
            <Card>
              <StateView
                icon={<Sparkles />}
                title="No outfit for today yet"
                description="Set your location and add a few pieces, and we'll have a look ready each morning."
                action={
                  <ButtonLink
                    href="/dashboard/generate"
                    iconLeft={<Sparkles className="size-4" />}
                  >
                    Generate one now
                  </ButtonLink>
                }
              />
            </Card>
          )}

          <section>
            <SectionHeader
              eyebrow="Lately"
              title="Recent outfits"
              action={
                <Link
                  href="/dashboard/outfits/saved"
                  className="rounded-sm text-body-medium text-text-accent transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  View saved
                </Link>
              }
            />

            {recent.length === 0 ? (
              <Card>
                <StateView
                  icon={<Shirt />}
                  title="Nothing here yet"
                  description="Outfits you generate will collect here so you can find them again."
                />
              </Card>
            ) : (
              <ul className="grid grid-cols-2 gap-lg sm:grid-cols-4">
                {recent.map((outfit) => (
                  <li key={outfit.id}>
                    <Link
                      href={`/dashboard/outfits/${outfit.id}`}
                      className="group block h-full overflow-hidden rounded-xl border border-border bg-surface shadow-md transition-all duration-200 hover:-translate-y-[3px] hover:border-border-strong hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    >
                      <div className="overflow-hidden">
                        <OutfitImage
                          items={outfit.items}
                          className="aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-lg">
                        <p className="truncate text-body-semibold text-text-primary">
                          {CONTEXT_LABELS[outfit.context]}
                        </p>
                        <p className="mt-0.5 text-caption text-text-muted tabular-nums">
                          {outfit.items.length} pieces
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Secondary rail */}
        <aside className="flex min-w-0 flex-col gap-2xl">
          <QuickActions itemCount={itemCount} />
          <CalloutCard icon={<Lightbulb />} title="Style tip">
            You wear your camel pieces with navy almost every time. Try camel
            with charcoal instead — it keeps the warmth but reads sharper for
            the office.
          </CalloutCard>
        </aside>
      </div>
    </div>
  );
}
