import type { Metadata } from "next";
import Link from "next/link";
import { mockRatings } from "@/lib/mock-data";
import { SectionHeader } from "@/components/ui/section-header";
import { RateFlow } from "@/components/rating/rate-flow";
import { RatingHistoryGrid } from "@/components/rating/rating-history-grid";

export const metadata: Metadata = {
  title: "Outfit Rating",
  description: "Score a look on colour harmony, fit, and occasion match.",
};

export default function OutfitRatingPage() {
  const recent = mockRatings.slice(0, 4);

  return (
    <>
      <RateFlow />

      {recent.length > 0 && (
        <section className="mx-auto max-w-[1200px] pb-2xl">
          <SectionHeader
            eyebrow="Previously"
            title="Recent ratings"
            action={
              <Link
                href="/dashboard/outfit-rating/history"
                className="rounded-sm text-body-medium text-text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                View all
              </Link>
            }
          />
          <RatingHistoryGrid ratings={recent} />
        </section>
      )}
    </>
  );
}
