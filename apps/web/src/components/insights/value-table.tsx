"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { closetItemById, type MockValuedItem } from "@/lib/mock-data";
import { GarmentImage } from "@/components/garment-image";
import {
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
  type SortDirection,
} from "@/components/ui/table";

type Column = "name" | "category" | "value";

/**
 * Top items as a sortable table on desktop, cards below `md`.
 *
 * A table is the right shape here — three comparable columns where the reader
 * is scanning down the value column — but it degrades badly on a phone, so
 * the same rows render as cards there instead of scrolling sideways.
 */
export function ValueTable({
  items,
  currency,
}: {
  items: MockValuedItem[];
  currency: string;
}) {
  const router = useRouter();
  const [column, setColumn] = React.useState<Column>("value");
  const [direction, setDirection] = React.useState<SortDirection>("desc");

  function sortBy(next: Column) {
    if (next === column) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setColumn(next);
      setDirection(next === "value" ? "desc" : "asc");
    }
  }

  const sorted = React.useMemo(() => {
    const factor = direction === "asc" ? 1 : -1;
    return [...items].sort((a, b) => {
      if (column === "value") return (a.estimatedValue - b.estimatedValue) * factor;
      // `type` is what the Category column renders — sort the same field.
      const left = column === "name" ? a.name : a.type;
      const right = column === "name" ? b.name : b.type;
      return left.localeCompare(right) * factor;
    });
  }, [items, column, direction]);

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <THead>
            <TR>
              <TH
                sortable
                active={column === "name"}
                direction={direction}
                onSort={() => sortBy("name")}
              >
                Item
              </TH>
              <TH
                sortable
                active={column === "category"}
                direction={direction}
                onSort={() => sortBy("category")}
              >
                Category
              </TH>
              <TH
                align="right"
                sortable
                active={column === "value"}
                direction={direction}
                onSort={() => sortBy("value")}
              >
                Value
              </TH>
              <TH className="w-12">
                <span className="sr-only">Open</span>
              </TH>
            </TR>
          </THead>
          <TBody>
            {sorted.map((item) => {
              const closetItem = closetItemById(item.closetItemId);
              const href = `/dashboard/closet/${item.closetItemId}`;
              return (
                <TR key={item.closetItemId} interactive onClick={() => router.push(href)}>
                  <TD>
                    <span className="flex items-center gap-md">
                      {closetItem && (
                        <GarmentImage
                          item={closetItem}
                          size="sm"
                          className="size-10 shrink-0 rounded-sm border border-border"
                        />
                      )}
                      {/* The link keeps the row keyboard-reachable; the row
                          click is a convenience for pointer users. */}
                      <Link
                        href={href}
                        className="rounded-sm text-body-medium text-text-primary transition-colors hover:text-primary-500 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                      >
                        {item.name}
                      </Link>
                    </span>
                  </TD>
                  <TD className="capitalize">{item.type}</TD>
                  <TD align="right" className="font-[600] text-text-primary tabular-nums">
                    {formatCurrency(item.estimatedValue, currency)}
                  </TD>
                  <TD align="right">
                    <ChevronRight aria-hidden className="inline size-4 text-text-muted" />
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      </div>

      {/* Card fallback below md */}
      <ul className="flex flex-col gap-sm md:hidden">
        {sorted.map((item) => {
          const closetItem = closetItemById(item.closetItemId);
          return (
            <li key={item.closetItemId}>
              <Link
                href={`/dashboard/closet/${item.closetItemId}`}
                className="group flex items-center gap-lg rounded-md border border-border bg-surface p-md transition-colors duration-200 hover:bg-[color:var(--color-overlay-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                {closetItem && (
                  <GarmentImage
                    item={closetItem}
                    size="sm"
                    className="size-14 shrink-0 rounded-sm border border-border"
                  />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body-medium text-text-primary">
                    {item.name}
                  </span>
                  <span className="block truncate text-caption text-text-muted capitalize">
                    {item.type}
                  </span>
                </span>
                <span className="shrink-0 text-body-semibold text-text-primary tabular-nums">
                  {formatCurrency(item.estimatedValue, currency)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
