import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Lightbulb, RefreshCw } from "lucide-react";
import {
  CONTEXT_LABELS,
  mockOutfits,
  outfitById,
} from "@/lib/mock-data";
import { OCCASIONS } from "@/lib/occasions";
import { Button } from "@/components/ui/button";
import { CalloutCard } from "@/components/ui/callout-card";
import { Tag } from "@/components/ui/chip";
import { OutfitImage } from "@/components/outfit-image";
import { GarmentImage } from "@/components/garment-image";
import { SaveToggle } from "@/components/outfit/save-toggle";

export async function generateMetadata(
  props: PageProps<"/outfits/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const outfit = outfitById(id);
  return {
    title: outfit ? `${CONTEXT_LABELS[outfit.context]} outfit` : "Outfit",
  };
}

export function generateStaticParams() {
  return mockOutfits.map((outfit) => ({ id: outfit.id }));
}

export default async function OutfitDetailPage(
  props: PageProps<"/outfits/[id]">,
) {
  const { id } = await props.params;
  const outfit = outfitById(id);
  if (!outfit) notFound();

  const meta = OCCASIONS[outfit.context];
  const Icon = meta.icon;

  return (
    <div className="py-2xl">
      <nav aria-label="Breadcrumb" className="mb-xl">
        <ol className="flex items-center gap-1.5 text-sm text-text-muted">
          <li>
            <Link
              href="/outfits/saved"
              className="inline-flex items-center gap-sm rounded-sm transition-colors hover:text-text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <ArrowLeft aria-hidden className="size-4" />
              Outfits
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5" />
          </li>
          <li className="font-[500] text-text-primary">
            {CONTEXT_LABELS[outfit.context]}
          </li>
        </ol>
      </nav>

      <div className="grid gap-3xl lg:grid-cols-[45%_1fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <OutfitImage
            items={outfit.items}
            variant="hero"
            className="aspect-[4/5] w-full overflow-hidden rounded-xl shadow-md"
          />
        </div>

        <div>
          <p className="flex items-center gap-sm text-eyebrow uppercase text-primary-500">
            <Icon aria-hidden className="size-3.5" />
            {CONTEXT_LABELS[outfit.context]}
          </p>
          <h2 className="mt-md text-h1 text-text-primary text-balance">
            {outfit.items.length} pieces, one look
          </h2>
          <p className="mt-sm text-body-lg text-text-secondary">
            {meta.description}
          </p>

          <CalloutCard
            icon={<Lightbulb />}
            title="Why this outfit"
            className="mt-xl"
          >
            {outfit.explanation}
          </CalloutCard>

          <section className="mt-3xl">
            <h3 className="text-h3 text-text-primary">Pieces</h3>
            <ul className="mt-lg flex flex-col gap-sm">
              {outfit.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/closet/${item.id}`}
                    className="group flex items-center gap-lg rounded-md border border-border bg-surface p-md transition-colors duration-200 hover:bg-[color:var(--color-overlay-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                  >
                    <GarmentImage
                      item={item}
                      size="sm"
                      className="size-14 shrink-0 rounded-sm border border-border"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body-medium text-text-primary">
                        {item.category}
                      </span>
                      <span className="block truncate text-caption text-text-muted">
                        {item.color}
                      </span>
                    </span>
                    <Tag className="hidden sm:inline-flex">
                      {item.type?.toLowerCase()}
                    </Tag>
                    <ChevronRight
                      aria-hidden
                      className="size-4 shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-3xl flex flex-wrap gap-md">
            <SaveToggle
              initialSaved={outfit.saved}
              label={`This ${CONTEXT_LABELS[outfit.context].toLowerCase()} outfit`}
            />
            <Link href="/generate">
              <Button
                variant="secondary"
                iconLeft={<RefreshCw className="size-4" />}
              >
                Generate another
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
