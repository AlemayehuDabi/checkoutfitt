"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { ItemForm, type ItemFormValues } from "@/components/closet/item-form";
import type { MockClosetItem } from "@/lib/mock-data";

export function EditItemForm({ item }: { item: MockClosetItem }) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  const initial: ItemFormValues = {
    type: item.type ?? "OTHER",
    category: item.category ?? "",
    color: item.color ?? "",
    tags: item.tags,
  };

  function save(values: ItemFormValues) {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast({
        kind: "success",
        title: "Changes saved",
        description: `${values.category} has been updated.`,
      });
      router.push(`/dashboard/closet/${item.id}`);
    }, 700);
  }

  return (
    <ItemForm
      initial={initial}
      submitLabel="Save changes"
      submitting={saving}
      onSubmit={save}
      onCancel={() => router.push(`/dashboard/closet/${item.id}`)}
    />
  );
}
