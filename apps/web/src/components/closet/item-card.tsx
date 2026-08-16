"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SHADOW_LG } from "@/lib/motion";
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
      <Badge tone="danger" icon={<AlertTriangle />} className="absolute top-2 left-2">
        Failed
      </Badge>
    );
  }
  return (
    <Badge tone="neutral" icon={<Loader2 className="animate-spin" />} className="absolute top-2 left-2">
      Analyzing
    </Badge>
  );
}

export function ClosetItemCard({ item }: { item: MockClosetItem }) {
  const reduce = useReducedMotion();

  return (
    <motion.li variants={listItem}>
      <motion.div
        whileHover={reduce ? undefined : { y: -3, boxShadow: SHADOW_LG }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="h-full overflow-hidden rounded-xl border border-border bg-surface shadow-md transition-colors duration-200 hover:border-border-strong"
      >
        <Link
          href={`/dashboard/closet/${item.id}`}
          className="group block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <div className="relative overflow-hidden">
            <GarmentImage
              item={item}
              className="aspect-square w-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
            />
            <StatusBadge item={item} />
          </div>
          <div className="p-lg">
            <p className="truncate text-body-medium text-text-primary">
              {item.category ?? "Untitled piece"}
            </p>
            <p className="mt-0.5 truncate text-caption text-text-muted">
              {item.color}
            </p>
            <Tag className="mt-md">
              {item.type ? CLOSET_TYPE_LABELS[item.type] : "Other"}
            </Tag>
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
          "group flex items-center gap-lg rounded-md border border-border bg-surface p-md transition-colors duration-200",
          "hover:bg-[color:var(--color-overlay-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
        )}
      >
        <GarmentImage
          item={item}
          size="sm"
          className="size-14 shrink-0 rounded-sm border border-border"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-body-medium text-text-primary">
            {item.category ?? "Untitled piece"}
          </span>
          <span className="block truncate text-caption text-text-muted">
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
