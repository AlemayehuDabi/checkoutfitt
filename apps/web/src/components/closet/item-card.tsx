"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SHADOW_XL } from "@/lib/motion";
import { listItem } from "@/lib/motion";
import { CLOSET_TYPE_LABELS, type MockClosetItem } from "@/lib/mock-data";
import { GarmentImage } from "@/components/garment-image";
import { Tag } from "@/components/ui/chip";
import { Badge } from "@/components/ui/badge";

/** Detection still running or failed — surfaced on the tile, not hidden. */
function StatusBadge({ item }: { item: MockClosetItem }) {
  if (item.status === "DONE") return null;
  if (item.status === "FAILED") {
    return (
      <Badge tone="danger" icon={<AlertTriangle />} className="absolute top-md left-md">
        Failed
      </Badge>
    );
  }
  return (
    <Badge
      tone="neutral"
      icon={<Loader2 className="animate-spin" />}
      className="absolute top-md left-md"
    >
      Analyzing
    </Badge>
  );
}

/**
 * Grid tile for a garment.
 *
 * The image is the content, so it gets a 4:5 portrait frame rather than the
 * square a phone grid uses — taller reads as editorial and shows more of the
 * piece. The caption block below is padded like a card, not a list row.
 */
export function ClosetItemCard({ item }: { item: MockClosetItem }) {
  const reduce = useReducedMotion();

  return (
    <motion.li variants={listItem}>
      <motion.div
        whileHover={reduce ? undefined : { y: -6, boxShadow: SHADOW_XL }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="h-full max-h-[35rem] w-full overflow-hidden rounded-xl border border-border bg-surface shadow-md transition-colors duration-200 hover:border-border-strong"
      >
        <Link
          href={`/dashboard/closet/${item.id}`}
          className="group flex h-full flex-col rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <div className="relative overflow-hidden bg-surface-secondary max-h-[35rem]">
            <GarmentImage
              item={item}
              className="aspect-[4/5] w-full h-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.04]"
            />
            <StatusBadge item={item} />
          </div>
          <div className="flex flex-1 flex-col p-xl">
            <p className="truncate text-body-semibold text-text-primary">
              {item.category ?? "Untitled piece"}
            </p>
            <p className="mt-1 truncate text-sm text-text-muted">{item.color}</p>
            <div className="mt-lg">
              <Tag>{item.type ? CLOSET_TYPE_LABELS[item.type] : "Other"}</Tag>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.li>
  );
}

/** Denser row layout for the list view. */
export function ClosetItemRow({ item }: { item: MockClosetItem }) {
  return (
    <motion.li variants={listItem}>
      <Link
        href={`/dashboard/closet/${item.id}`}
        className={cn(
          "group flex items-center gap-xl rounded-lg border border-border bg-surface p-lg transition-all duration-200",
          "hover:border-border-strong hover:bg-[color:var(--color-overlay-light)] hover:shadow-sm",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
        )}
      >
        <div className="overflow-hidden rounded-md border border-border">
          <GarmentImage
            item={item}
            size="sm"
            className="size-16 shrink-0 transition-transform duration-300 group-hover:scale-[1.05]"
          />
        </div>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-body-semibold text-text-primary">
            {item.category ?? "Untitled piece"}
          </span>
          <span className="mt-0.5 block truncate text-sm text-text-muted">
            {item.color}
            {item.tags.length > 0 && ` · ${item.tags.join(", ")}`}
          </span>
        </span>
        <Tag className="hidden shrink-0 sm:inline-flex">
          {item.type ? CLOSET_TYPE_LABELS[item.type] : "Other"}
        </Tag>
      </Link>
    </motion.li>
  );
}
