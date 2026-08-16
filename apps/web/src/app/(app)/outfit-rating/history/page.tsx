import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { mockRatings } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { StateView } from "@/components/ui/state-view";
import { RatingHistoryGrid } from "@/components/rating/rating-history-grid";

export const metadata: Metadata = {
  title: "Rating history",
  description: "Every outfit you've had rated.",
};

export default function RatingHistoryPage() {
  const ratings = mockRatings;

  return (
    <div className="py-2xl">
      <Link
        href="/outfit-rating"
        className="mb-xl inline-flex items-center gap-sm rounded-sm text-sm text-text-muted transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Rate an outfit
      </Link>

      <div className="mb-2xl flex flex-wrap items-end justify-between gap-lg">
        <div>
          <p className="text-eyebrow uppercase text-text-muted">Your history</p>
          <h2 className="mt-1 text-h2 text-text-primary">
            {ratings.length}{" "}
            <span className="text-text-muted">
              {ratings.length === 1 ? "rating" : "ratings"}
            </span>
          </h2>
        </div>
      </div>

      {ratings.length === 0 ? (
        <StateView
          icon={<Star />}
          title="No ratings yet"
          description="Upload a photo of an outfit and we'll score it on colour, fit and occasion match."
          action={
            <Link href="/outfit-rating">
              <Button iconLeft={<Star className="size-4" />}>
                Rate your first outfit
              </Button>
            </Link>
          }
        />
      ) : (
        <RatingHistoryGrid ratings={ratings} />
      )}
    </div>
  );
}
