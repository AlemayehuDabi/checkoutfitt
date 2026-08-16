"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { MockClosetItem } from "@/lib/mock-data";

/** Edit / Archive / Delete. Destructive path is gated behind a modal. */
export function ItemActions({ item }: { item: MockClosetItem }) {
  const router = useRouter();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  function onDelete() {
    setDeleting(true);
    window.setTimeout(() => {
      setDeleting(false);
      setConfirmOpen(false);
      toast({
        kind: "success",
        title: "Item deleted",
        description: `${item.category} was removed from your closet.`,
      });
      router.push("/closet");
    }, 600);
  }

  return (
    <>
      <div className="flex flex-wrap gap-md">
        <Link href={`/closet/${item.id}/edit`}>
          <Button variant="secondary" iconLeft={<Pencil className="size-4" />}>
            Edit
          </Button>
        </Link>
        <Button
          variant="outline"
          iconLeft={<Archive className="size-4" />}
          onClick={() =>
            toast({
              kind: "info",
              title: "Item archived",
              description: "Archived pieces stay out of outfit suggestions.",
            })
          }
        >
          Archive
        </Button>
        <Button
          variant="danger"
          iconLeft={<Trash2 className="size-4" />}
          onClick={() => setConfirmOpen(true)}
        >
          Delete
        </Button>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={`Delete ${item.category?.toLowerCase() ?? "this item"}?`}
        description="This removes the piece from your closet for good. Outfits that used it keep their remaining pieces."
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Keep it
            </Button>
            <Button variant="danger" loading={deleting} onClick={onDelete}>
              {deleting ? "Deleting…" : "Delete item"}
            </Button>
          </>
        }
      />
    </>
  );
}
