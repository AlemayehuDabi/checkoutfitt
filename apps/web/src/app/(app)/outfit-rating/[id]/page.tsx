import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Star } from "lucide-react";
import { CONTEXT_LABELS, mockRatings, ratingById } from "@/lib/mock-data";
import { ButtonLink } from "@/components/ui/button";
import { PersonPhoto } from "@/components/rating/person-photo";
import { ScorePanel } from "@/components/rating/score-panel";

export async function generateMetadata(
  props: PageProps<"/outfit-rating/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const rating = ratingById(id);
  return {
    title: rating ? `Rating ${rating.overallScore.toFixed(1)}` : "Rating",
  };
}

export function generateStaticParams() {
  return mockRatings.map((rating) => ({ id: rating.id }));
}

/** Finite mock set — unknown ids are a real 404. */
export const dynamicParams = false;

export default async function RatingDetailPage(
  props: PageProps<"/outfit-rating/[id]">,
) {
  const { id } = await props.params;
  const rating = ratingById(id);
  if (!rating) notFound();

  const date = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(rating.createdAt));

  return (
    <div className="mx-auto max-w-[900px] py-2xl">
      <nav aria-label="Breadcrumb" className="mb-xl">
        <ol className="flex items-center gap-1.5 text-sm text-text-muted">
          <li>
            <Link
              href="/outfit-rating/history"
              className="inline-flex items-center gap-sm rounded-sm transition-colors hover:text-text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <ArrowLeft aria-hidden className="size-4" />
              Rating history
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5" />
          </li>
          <li className="font-[500] text-text-primary">{date}</li>
        </ol>
      </nav>

      <div className="grid gap-3xl lg:grid-cols-[40%_1fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <PersonPhoto
            seed={rating.id}
            className="aspect-[3/4] w-full rounded-xl border border-border shadow-md"
            iconClassName="size-20"
          />
        </div>

        <div>
          <p className="text-eyebrow uppercase text-primary-500">
            {rating.occasion ? CONTEXT_LABELS[rating.occasion] : "Everyday"}
          </p>
          <h2 className="mt-1 mb-2xl text-h1 text-text-primary text-balance">
            Rated on {date}
          </h2>

          <ScorePanel rating={rating} />

          <div className="mt-3xl">
            <ButtonLink href="/outfit-rating" variant="secondary" iconLeft={<Star className="size-4" />}>
                Rate another outfit
              </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
