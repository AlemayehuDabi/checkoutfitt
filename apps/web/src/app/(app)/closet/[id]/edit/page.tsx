import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { closetItemById, mockClosetItems } from "@/lib/mock-data";
import { GarmentImage } from "@/components/garment-image";
import { EditItemForm } from "./edit-item-form";

export async function generateMetadata(
  props: PageProps<"/closet/[id]/edit">,
): Promise<Metadata> {
  const { id } = await props.params;
  const item = closetItemById(id);
  return { title: item ? `Edit ${item.category}` : "Edit item" };
}

export function generateStaticParams() {
  return mockClosetItems.map((item) => ({ id: item.id }));
}

export default async function EditItemPage(
  props: PageProps<"/closet/[id]/edit">,
) {
  const { id } = await props.params;
  const item = closetItemById(id);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-[720px] py-2xl">
      <Link
        href={`/closet/${item.id}`}
        className="mb-xl inline-flex items-center gap-sm rounded-sm text-sm text-text-muted transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to {item.category?.toLowerCase()}
      </Link>

      <h2 className="text-h1 text-text-primary text-balance">Edit this piece</h2>
      <p className="mt-sm text-body-lg text-text-secondary">
        Corrections here make future outfit suggestions more accurate.
      </p>

      <div className="mt-3xl grid gap-2xl sm:grid-cols-[200px_1fr]">
        <GarmentImage
          item={item}
          className="aspect-square w-full overflow-hidden rounded-xl border border-border"
        />
        <EditItemForm item={item} />
      </div>
    </div>
  );
}
