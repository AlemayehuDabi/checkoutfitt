"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, List, Plus, Search, Shirt, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer } from "@/lib/motion";
import {
  CLOSET_TYPE_LABELS,
  type ClosetItemType,
  type MockClosetItem,
} from "@/lib/mock-data";
import { Button, ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Select } from "@/components/ui/select";
import { StateView } from "@/components/ui/state-view";
import { ClosetItemCard, ClosetItemRow } from "./item-card";

const TYPE_FILTERS: { value: ClosetItemType | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "TOP", label: CLOSET_TYPE_LABELS.TOP },
  { value: "BOTTOM", label: CLOSET_TYPE_LABELS.BOTTOM },
  { value: "OUTERWEAR", label: CLOSET_TYPE_LABELS.OUTERWEAR },
  { value: "DRESS", label: CLOSET_TYPE_LABELS.DRESS },
  { value: "FOOTWEAR", label: CLOSET_TYPE_LABELS.FOOTWEAR },
  { value: "ACCESSORY", label: CLOSET_TYPE_LABELS.ACCESSORY },
  { value: "BAG", label: CLOSET_TYPE_LABELS.BAG },
];

export function ClosetBrowser({ items }: { items: MockClosetItem[] }) {
  const [type, setType] = React.useState<ClosetItemType | "ALL">("ALL");
  const [color, setColor] = React.useState<string>("");
  const [query, setQuery] = React.useState("");
  const [view, setView] = React.useState<"grid" | "list">("grid");

  const colorOptions = React.useMemo(() => {
    const unique = [...new Set(items.map((i) => i.color).filter(Boolean))].sort();
    return [
      { value: "", label: "Any colour" },
      ...unique.map((c) => ({ value: c as string, label: c as string })),
    ];
  }, [items]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (item.archived) return false;
      if (type !== "ALL" && item.type !== type) return false;
      if (color && item.color !== color) return false;
      if (!q) return true;
      return [item.category, item.color, ...item.tags]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q));
    });
  }, [items, type, color, query]);

  const filtersActive = type !== "ALL" || color !== "" || query.trim() !== "";

  function clearFilters() {
    setType("ALL");
    setColor("");
    setQuery("");
  }

  return (
    <div className="py-2xl">
      {/* Header row */}
      <div className="mb-xl flex flex-wrap items-end justify-between gap-lg">
        <div>
          <p className="text-eyebrow uppercase text-text-muted">Your wardrobe</p>
          <h2 className="mt-1 text-h2 text-text-primary">
            {filtered.length}{" "}
            <span className="text-text-muted">
              {filtered.length === 1 ? "piece" : "pieces"}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-md">
          {/* View toggle */}
          <div
            role="group"
            aria-label="View mode"
            className="flex items-center gap-0.5 rounded-md border border-border bg-surface p-0.5"
          >
            {(
              [
                { mode: "grid" as const, icon: LayoutGrid, label: "Grid view" },
                { mode: "list" as const, icon: List, label: "List view" },
              ]
            ).map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                type="button"
                aria-label={label}
                aria-pressed={view === mode}
                onClick={() => setView(mode)}
                className={cn(
                  "inline-flex size-9 cursor-pointer items-center justify-center rounded-sm transition-colors duration-150",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
                  view === mode
                    ? "bg-primary-50 text-primary-500"
                    : "text-text-muted hover:bg-surface-secondary hover:text-text-primary",
                )}
              >
                <Icon aria-hidden className="size-[18px]" />
              </button>
            ))}
          </div>

          <ButtonLink href="/closet/new" iconLeft={<Plus className="size-4" />}>Add items</ButtonLink>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-2xl flex flex-col gap-lg">
        <div className="flex flex-wrap items-center gap-md">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">Search your closet</span>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-text-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, colour or tag…"
              className="h-11 w-full cursor-text rounded-md border border-border bg-surface pr-4 pl-11 text-body text-text-primary transition-colors placeholder:text-text-muted hover:border-border-strong focus:border-primary-500 focus:shadow-sm focus:outline-none"
            />
          </label>

          <div className="w-[180px]">
            <Select
              options={colorOptions}
              value={color}
              onChange={setColor}
              placeholder="Any colour"
            />
          </div>
        </div>

        {/* Horizontally scrollable on narrow viewports rather than wrapping. */}
        <div className="no-scrollbar -mx-lg overflow-x-auto px-lg sm:mx-0 sm:px-0">
          <div className="flex w-max items-center gap-sm">
            {TYPE_FILTERS.map((filter) => (
              <Chip
                key={filter.value}
                selected={type === filter.value}
                onClick={() => setType(filter.value)}
              >
                {filter.label}
              </Chip>
            ))}
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-sm cursor-pointer rounded-sm text-caption text-text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        filtersActive ? (
          <StateView
            icon={<SlidersHorizontal />}
            title="Nothing matches those filters"
            description="Try a different category or colour, or clear the filters to see everything."
            action={
              <Button variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <StateView
            icon={<Shirt />}
            title="Your closet is empty"
            description="Add a few pieces and we'll identify each one automatically, then start building outfits from them."
            action={
              <ButtonLink href="/closet/new" iconLeft={<Plus className="size-4" />}>
                  Add your first item
                </ButtonLink>
            }
          />
        )
      ) : (
        <AnimatePresence mode="wait">
          <motion.ul
            key={view}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className={cn(
              view === "grid"
                ? "grid grid-cols-2 gap-lg sm:gap-2xl lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-sm",
            )}
          >
            {filtered.map((item) =>
              view === "grid" ? (
                <ClosetItemCard key={item.id} item={item} />
              ) : (
                <ClosetItemRow key={item.id} item={item} />
              ),
            )}
          </motion.ul>
        </AnimatePresence>
      )}
    </div>
  );
}
