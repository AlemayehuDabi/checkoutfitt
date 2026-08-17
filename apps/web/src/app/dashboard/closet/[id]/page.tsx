import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import {
  CLOSET_TYPE_LABELS,
  CONTEXT_LABELS,
  closetItemById,
  mockClosetItems,
  outfitsWithItem,
} from "@/lib/mock-data";
import { GarmentImage } from "@/components/garment-image";
import { OutfitImage } from "@/components/outfit-image";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/ui/chip";
import { SectionHeader } from "@/components/ui/section-header";
import { StateView } from "@/components/ui/state-view";
import { ItemActions } from "@/components/closet/item-actions";

export async function generateMetadata(
  props: PageProps<"/dashboard/closet/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const item = closetItemById(id);
  return { title: item?.category ?? "Closet item" };
}

/** Prerenders a page per mock item; becomes a fetch once the API is wired. */
export function generateStaticParams() {
  return mockClosetItems.map((item) => ({ id: item.id }));
}

/**
 * The mock set is finite, so anything outside it is a genuine 404 rather than
 * a page to render on demand. Without this, an unknown id renders the
 * not-found body but still answers HTTP 200 — a soft 404. Flip to `true` once
 * ids come from the API.
 */
export const dynamicParams = false;

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-lg py-md">
      <dt className="text-sm text-text-muted">{label}</dt>
      <dd className="text-right text-body-medium text-text-primary">{value}</dd>
    </div>
  );
}

export default async function ClosetItemPage(props: PageProps<"/dashboard/closet/[id]">) {
  const { id } = await props.params;
  const item = closetItemById(id);
  if (!item) notFound();

  const relatedOutfits = outfitsWithItem(item.id);
  const addedOn = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(item.createdAt));

  return (
    <div className="py-4xl">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-xl">
        <ol className="flex items-center gap-1.5 text-sm text-text-muted">
          <li>
            <Link
              href="/dashboard/closet"
              className="inline-flex items-center gap-sm rounded-sm transition-colors hover:text-text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <ArrowLeft aria-hidden className="size-4" />
              My Closet
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5" />
          </li>
          <li className="font-[500] text-text-primary">{item.category}</li>
        </ol>
      </nav>

      <div className="grid gap-3xl lg:grid-cols-[45%_1fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <GarmentImage
            item={item}
            size="lg"
            className="aspect-square w-full overflow-hidden rounded-xl border border-border shadow-md"
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-md">
            <h2 className="text-h1 text-text-primary text-balance">
              {item.category}
            </h2>
            {item.status !== "DONE" && (
              <Badge tone={item.status === "FAILED" ? "danger" : "neutral"}>
                {item.status === "FAILED" ? "Detection failed" : "Analyzing"}
              </Badge>
            )}
          </div>
          <p className="mt-sm text-body-lg text-text-secondary">
            {item.color} · {item.type ? CLOSET_TYPE_LABELS[item.type] : "Other"}
          </p>

          <dl className="mt-2xl flex flex-col divide-y divide-border border-y border-border">
            <MetaRow label="Type" value={item.type ? CLOSET_TYPE_LABELS[item.type] : "—"} />
            <MetaRow label="Category" value={item.category ?? "—"} />
            <MetaRow label="Colour" value={item.color ?? "—"} />
            <MetaRow
              label="Tags"
              value={
                item.tags.length > 0 ? (
                  <span className="flex flex-wrap justify-end gap-1.5">
                    {item.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </span>
                ) : (
                  "—"
                )
              }
            />
            <MetaRow label="Added" value={addedOn} />
          </dl>

          <div className="mt-2xl">
            <ItemActions item={item} />
          </div>

          <section className="mt-3xl">
            <SectionHeader
              eyebrow="Worn in"
              title="Outfits with this piece"
              as="h3"
            />
            {relatedOutfits.length === 0 ? (
              <StateView
                icon={<ChevronRight />}
                title="Not used in an outfit yet"
                description="Once this piece appears in a generated outfit, you'll find it here."
                className="py-4xl"
              />
            ) : (
              <ul className="flex flex-col gap-sm">
                {relatedOutfits.map((outfit) => (
                  <li key={outfit.id}>
                    <Link
                      href={`/dashboard/outfits/${outfit.id}`}
                      className="group flex items-center gap-lg rounded-md border border-border bg-surface p-md transition-colors duration-200 hover:bg-[color:var(--color-overlay-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    >
                      <OutfitImage
                        items={outfit.items}
                        className="size-14 shrink-0 overflow-hidden rounded-sm border border-border"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-body-medium text-text-primary">
                          {CONTEXT_LABELS[outfit.context]}
                        </span>
                        <span className="block truncate text-caption text-text-muted tabular-nums">
                          {outfit.items.length} pieces
                        </span>
                      </span>
                      <ChevronRight
                        aria-hidden
                        className="size-4 shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
