"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  LayoutGrid,
  List,
  Plus,
  Search,
  Shirt,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer } from "@/lib/motion";
import {
  CLOSET_TYPE_LABELS,
  type ClosetItemType,
  type MockClosetItem,
} from "@/lib/mock-data";
import { Button, ButtonLink } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
  const [includeArchived, setIncludeArchived] = React.useState(false);

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
      if (item.archived && !includeArchived) return false;
      if (type !== "ALL" && item.type !== type) return false;
      if (color && item.color !== color) return false;
      if (!q) return true;
      return [item.category, item.color, ...item.tags]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q));
    });
  }, [items, type, color, query, includeArchived]);

  const filtersActive =
    type !== "ALL" || color !== "" || query.trim() !== "" || includeArchived;
  // Only the popover's own controls count toward its badge.
  const menuFilterCount = (type !== "ALL" ? 1 : 0) + (color !== "" ? 1 : 0) + (includeArchived ? 1 : 0);

  function clearFilters() {
    setType("ALL");
    setColor("");
    setQuery("");
    setIncludeArchived(false);
  }

  return (
    <div className="py-4xl">
      {/* Header row */}
      <div className="mb-2xl flex flex-wrap items-end justify-between gap-lg">
        <div>
          <p className="text-eyebrow uppercase text-text-muted">Your wardrobe</p>
          <h2 className="mt-sm text-h1 text-text-primary">
            {filtered.length}{" "}
            <span className="text-text-muted">
              {filtered.length === 1 ? "piece" : "pieces"}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-md">
          <SegmentedControl
            label="View mode"
            value={view}
            onChange={setView}
            options={[
              { value: "grid", label: "", icon: <LayoutGrid />, srLabel: "Grid view" },
              { value: "list", label: "", icon: <List />, srLabel: "List view" },
            ]}
          />
          <ButtonLink href="/dashboard/closet/new" iconLeft={<Plus className="size-4" />}>
            Add items
          </ButtonLink>
        </div>
      </div>

      {/* Filter bar — search stays inline because it's typed into constantly;
          the rest lives behind one menu instead of a wrapping chip row. */}
      <div className="mb-3xl flex flex-wrap items-center gap-md">
        <label className="relative min-w-[240px] flex-1">
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
            className="h-11 w-full cursor-text rounded-lg border border-border bg-surface pr-4 pl-11 text-body text-text-primary transition-colors placeholder:text-text-muted hover:border-border-strong focus:border-primary-500 focus:shadow-sm focus:outline-none"
          />
        </label>

        <Popover
          label="Filter your closet"
          className="w-[300px]"
          trigger={
            <span
              className={cn(
                "inline-flex h-11 items-center gap-sm rounded-lg border px-lg text-body-medium transition-colors duration-150",
                menuFilterCount > 0
                  ? "border-primary-500 bg-primary-50 text-primary-500"
                  : "border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-secondary",
              )}
            >
              <SlidersHorizontal aria-hidden className="size-[18px]" />
              Filters
              {menuFilterCount > 0 && (
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary-500 text-[11px] font-[600] text-text-on-primary tabular-nums">
                  {menuFilterCount}
                </span>
              )}
              <ChevronDown aria-hidden className="size-4" />
            </span>
          }
        >
          <div className="flex flex-col gap-xl">
            <div>
              <p className="mb-md text-eyebrow uppercase text-text-muted">
                Category
              </p>
              <ul className="-mx-1 flex flex-col">
                {TYPE_FILTERS.map((filter) => {
                  const active = type === filter.value;
                  return (
                    <li key={filter.value}>
                      <button
                        type="button"
                        onClick={() => setType(filter.value)}
                        className={cn(
                          "flex h-10 w-full cursor-pointer items-center justify-between gap-md rounded-md px-md text-left text-body transition-colors duration-150",
                          "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500",
                          active
                            ? "bg-primary-50 font-[500] text-primary-500"
                            : "text-text-primary hover:bg-surface-secondary",
                        )}
                      >
                        {filter.label}
                        {active && <Check aria-hidden className="size-4 shrink-0" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <p className="mb-md text-eyebrow uppercase text-text-muted">Colour</p>
              <Select
                options={colorOptions}
                value={color}
                onChange={setColor}
                placeholder="Any colour"
              />
            </div>

            <div className="border-t border-border pt-lg">
              <Switch
                checked={includeArchived}
                onCheckedChange={setIncludeArchived}
                label="Include archived"
                description="Pieces you've put away"
              />
            </div>

            {filtersActive && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        </Popover>
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
              <ButtonLink href="/dashboard/closet/new" iconLeft={<Plus className="size-4" />}>
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
                ? "grid grid-cols gap-2xl lg:grid-cols-2 xl:grid-cols-3 "
                : "flex flex-col gap-md",
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
