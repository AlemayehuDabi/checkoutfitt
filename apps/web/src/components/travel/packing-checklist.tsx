"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { closetItemById, type MockPackingItem } from "@/lib/mock-data";
import { GarmentImage } from "@/components/garment-image";
import { Badge } from "@/components/ui/badge";

function ChecklistRow({
  item,
  checked,
  onToggle,
}: {
  item: MockPackingItem;
  checked: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  const closetItem = closetItemById(item.closetItemId);

  return (
    <li>
      {/* The whole row is the control — a 52px target beats a 22px box. */}
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onToggle}
        className={cn(
          "flex w-full cursor-pointer items-center gap-md rounded-md border bg-surface px-md py-2 text-left transition-colors duration-200",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
          checked
            ? "border-border bg-surface-secondary"
            : "border-border hover:border-border-strong",
        )}
      >
        <span
          aria-hidden
          className="shrink-0 cursor-grab text-text-muted active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </span>

        <motion.span
          aria-hidden
          animate={{ scale: checked ? 1 : 0.92 }}
          transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className={cn(
            "inline-flex size-[22px] shrink-0 items-center justify-center rounded-[6px] border-[1.5px] transition-colors duration-200",
            checked
              ? "border-primary-500 bg-primary-500 text-white"
              : "border-border bg-surface text-transparent",
          )}
        >
          <motion.span
            initial={false}
            animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Check className="size-3.5" strokeWidth={3} />
          </motion.span>
        </motion.span>

        {closetItem && (
          <GarmentImage
            item={closetItem}
            size="sm"
            className={cn(
              "size-10 shrink-0 rounded-sm border border-border transition-opacity duration-200",
              checked && "opacity-55",
            )}
          />
        )}

        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "relative block truncate text-body-medium transition-colors duration-200",
              checked ? "text-text-muted" : "text-text-primary",
            )}
          >
            {item.name}
            {/* Strikethrough wipes across rather than snapping on. */}
            <motion.span
              aria-hidden
              initial={false}
              animate={{ scaleX: checked && !reduce ? 1 : checked ? 1 : 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              style={{ originX: 0 }}
              className="absolute top-1/2 left-0 h-px w-full bg-text-muted"
            />
          </span>
        </span>

        {item.essential && !checked && (
          <Badge tone="primary" className="shrink-0">
            Essential
          </Badge>
        )}
      </button>
    </li>
  );
}

export function PackingChecklist({ items }: { items: MockPackingItem[] }) {
  const [packed, setPacked] = React.useState<Set<string>>(new Set());

  function toggle(id: string) {
    setPacked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const done = packed.size;
  const total = items.length;
  const pct = total === 0 ? 0 : (done / total) * 100;

  return (
    <div>
      <div className="mb-lg">
        <div className="flex items-baseline justify-between gap-lg">
          <p className="text-body-medium text-text-primary tabular-nums">
            {done} of {total} packed
          </p>
          {done === total && total > 0 && (
            <p className="text-caption font-[600] text-success">All packed</p>
          )}
        </div>
        <div className="mt-sm h-1.5 w-full overflow-hidden rounded-full bg-surface-tertiary">
          <motion.div
            className="h-full rounded-full bg-primary-500"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      <ul className="flex flex-col gap-sm">
        {items.map((item) => (
          <ChecklistRow
            key={item.closetItemId}
            item={item}
            checked={packed.has(item.closetItemId)}
            onToggle={() => toggle(item.closetItemId)}
          />
        ))}
      </ul>
    </div>
  );
}
