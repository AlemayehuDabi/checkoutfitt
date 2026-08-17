import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Droplet,
  Palette,
  Settings,
  Shirt,
} from "lucide-react";
import {
  mockClosetItems,
  mockColorAnalysis,
  mockMemberSince,
  mockSavedOutfits,
  mockStyleAnalysis,
  mockUser,
} from "@/lib/mock-data";
import { ButtonLink } from "@/components/ui/button";
import { Tag } from "@/components/ui/chip";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { AvatarEditor } from "@/components/profile/avatar-editor";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your account, style profile, and wardrobe at a glance.",
};

export default function ProfilePage() {
  const memberSince = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(mockMemberSince));

  return (
    <div className="mx-auto max-w-[1200px] py-4xl">
      {/* Identity */}
      <div className="flex flex-col gap-2xl sm:flex-row sm:items-center">
        <AvatarEditor name={mockUser.name} />

        <div className="min-w-0 flex-1">
          <h2 className="text-h1 text-text-primary text-balance">
            {mockUser.name}
          </h2>
          <p className="mt-1 text-body text-text-secondary">{mockUser.email}</p>
          <p className="mt-sm flex items-center gap-sm text-caption text-text-muted">
            <CalendarDays aria-hidden className="size-3.5" />
            Member since {memberSince}
          </p>

          <div className="mt-lg flex flex-wrap gap-md">
            <ButtonLink href="/dashboard/settings" variant="secondary" size="sm">
                Edit profile
              </ButtonLink>
            <ButtonLink href="/dashboard/settings" variant="outline" size="sm" iconLeft={<Settings className="size-4" />}>
                Settings
              </ButtonLink>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3xl grid gap-2xl sm:grid-cols-3">
        <StatCard
          value={mockClosetItems.filter((i) => !i.archived).length}
          label="Items in closet"
          icon={<Shirt />}
        />
        <StatCard
          value={mockSavedOutfits.length}
          label="Saved outfits"
          icon={<Bookmark />}
        />
        <StatCard value={memberSince} label="Member since" icon={<CalendarDays />} />
      </div>

      {/* Style summaries */}
      <section className="mt-3xl">
        <SectionHeader
          eyebrow="What we know about you"
          title="Your style profile"
          as="h3"
        />

        <div className="grid gap-2xl sm:grid-cols-2">
          <Link
            href="/dashboard/style-coach"
            className="group rounded-xl border border-border bg-surface p-xl shadow-md transition-all duration-200 hover:-translate-y-[3px] hover:border-border-strong hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-md bg-primary-50 text-primary-500">
              <Palette aria-hidden className="size-5" />
            </span>
            <p className="mt-lg text-eyebrow uppercase text-text-muted">
              Style archetype
            </p>
            <p className="mt-1 text-h3 text-primary-500">
              {mockStyleAnalysis.archetypeLabel}
            </p>
            <ul className="mt-md flex flex-wrap gap-1.5">
              {mockStyleAnalysis.traits.slice(0, 3).map((trait) => (
                <li key={trait}>
                  <Tag>{trait}</Tag>
                </li>
              ))}
            </ul>
            <span className="mt-lg inline-flex items-center gap-1.5 text-body-medium text-primary-500">
              See full analysis
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </Link>

          <Link
            href="/dashboard/color-analysis"
            className="group rounded-xl border border-border bg-surface p-xl shadow-md transition-all duration-200 hover:-translate-y-[3px] hover:border-border-strong hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-md bg-primary-50 text-primary-500">
              <Droplet aria-hidden className="size-5" />
            </span>
            <p className="mt-lg text-eyebrow uppercase text-text-muted">
              Colour season
            </p>
            <p className="mt-1 text-h3 text-primary-500">
              {mockColorAnalysis.season}
            </p>
            <div className="mt-md flex flex-wrap gap-1.5">
              {mockColorAnalysis.bestColors.slice(0, 8).map((hex) => (
                <span
                  key={hex}
                  aria-hidden
                  className="size-6 rounded-full border border-border-strong/40 shadow-xs"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            <span className="mt-lg inline-flex items-center gap-1.5 text-body-medium text-primary-500">
              See your palette
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
