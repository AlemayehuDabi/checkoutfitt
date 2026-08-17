"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { staggerContainer } from "@/lib/motion";
import { CONTEXT_LABELS, type MockOutfitRating } from "@/lib/mock-data";
import { ScoreBadge } from "@/components/ui/score";
import {
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
  type SortDirection,
} from "@/components/ui/table";
import { PersonPhoto } from "./person-photo";
import { RatingCard } from "./rating-card";

type Column = "date" | "score" | "occasion";

const fullDate = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function occasionLabel(rating: MockOutfitRating): string {
  return rating.occasion ? CONTEXT_LABELS[rating.occasion] : "Everyday";
}

/**
 * History reads as a scannable table on desktop — the columns are comparable
 * and people come here to find a specific past rating — and falls back to the
 * photo grid below `md`, where a four-column table would be unusable.
 */
export function RatingHistoryGrid({
  ratings,
}: {
  ratings: MockOutfitRating[];
}) {
  const router = useRouter();
  const [column, setColumn] = React.useState<Column>("date");
  const [direction, setDirection] = React.useState<SortDirection>("desc");

  function sortBy(next: Column) {
    if (next === column) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setColumn(next);
      setDirection(next === "occasion" ? "asc" : "desc");
    }
  }

  const sorted = React.useMemo(() => {
    const factor = direction === "asc" ? 1 : -1;
    return [...ratings].sort((a, b) => {
      if (column === "score") return (a.overallScore - b.overallScore) * factor;
      if (column === "occasion") {
        return occasionLabel(a).localeCompare(occasionLabel(b)) * factor;
      }
      return (
        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
        factor
      );
    });
  }, [ratings, column, direction]);

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <THead>
            <TR>
              <TH className="w-16">
                <span className="sr-only">Photo</span>
              </TH>
              <TH
                sortable
                active={column === "date"}
                direction={direction}
                onSort={() => sortBy("date")}
              >
                Date
              </TH>
              <TH
                sortable
                active={column === "score"}
                direction={direction}
                onSort={() => sortBy("score")}
              >
                Overall score
              </TH>
              <TH
                sortable
                active={column === "occasion"}
                direction={direction}
                onSort={() => sortBy("occasion")}
              >
                Occasion
              </TH>
              <TH align="right" className="w-12">
                <span className="sr-only">Open</span>
              </TH>
            </TR>
          </THead>
          <TBody>
            {sorted.map((rating) => (
              <TR
                key={rating.id}
                interactive
                onClick={() =>
                  router.push(`/dashboard/outfit-rating/${rating.id}`)
                }
              >
                <TD>
                  <PersonPhoto
                    seed={rating.id}
                    className="size-10 rounded-sm border border-border object-cover"
                  />
                </TD>
                <TD>
                  {/* Keeps the row keyboard-reachable; the row click is a
                      convenience for pointer users. */}
                  <Link
                    href={`/dashboard/outfit-rating/${rating.id}`}
                    className="rounded-sm text-body-medium text-text-primary transition-colors hover:text-primary-500 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                  >
                    {fullDate.format(new Date(rating.createdAt))}
                  </Link>
                </TD>
                <TD>
                  <ScoreBadge score={rating.overallScore} />
                </TD>
                <TD>{occasionLabel(rating)}</TD>
                <TD align="right">
                  <ChevronRight
                    aria-hidden
                    className="inline size-4 text-text-muted"
                  />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>

      {/* Card fallback below md */}
      <motion.ul
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 gap-2xl md:hidden"
      >
        {sorted.map((rating) => (
          <RatingCard key={rating.id} rating={rating} />
        ))}
      </motion.ul>
    </>
  );
}
