"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { CLOSET_TYPE_LABELS, type ClosetItemType } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const TYPE_OPTIONS = (Object.keys(CLOSET_TYPE_LABELS) as ClosetItemType[]).map(
  (value) => ({ value, label: CLOSET_TYPE_LABELS[value] }),
);

const COLOR_OPTIONS = [
  "White", "Ivory", "Sand", "Camel", "Tan", "Chestnut", "Rust", "Gold",
  "Olive", "Navy", "Mid blue", "Indigo", "Charcoal", "Black",
].map((c) => ({ value: c, label: c }));

export interface ItemFormValues {
  type: ClosetItemType;
  category: string;
  color: string;
  tags: string[];
}

/**
 * Shared by the post-upload confirm screen and the edit page — the fields are
 * identical, only the surrounding copy and submit label differ.
 */
export function ItemForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  submitting = false,
}: {
  initial: ItemFormValues;
  submitLabel: string;
  onSubmit: (values: ItemFormValues) => void;
  onCancel?: () => void;
  submitting?: boolean;
}) {
  const [values, setValues] = React.useState<ItemFormValues>(initial);
  const [tagDraft, setTagDraft] = React.useState("");

  function addTag() {
    const tag = tagDraft.trim().toLowerCase();
    if (!tag || values.tags.includes(tag)) {
      setTagDraft("");
      return;
    }
    setValues((v) => ({ ...v, tags: [...v.tags, tag] }));
    setTagDraft("");
  }

  function removeTag(tag: string) {
    setValues((v) => ({ ...v, tags: v.tags.filter((t) => t !== tag) }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="flex flex-col gap-lg"
    >
      <Select
        label="Type"
        options={TYPE_OPTIONS}
        value={values.type}
        onChange={(v) => setValues((s) => ({ ...s, type: v as ClosetItemType }))}
      />

      <Input
        label="Category"
        value={values.category}
        onChange={(e) => setValues((s) => ({ ...s, category: e.target.value }))}
        placeholder="e.g. Oxford shirt"
        maxLength={100}
        required
      />

      <Select
        label="Colour"
        options={COLOR_OPTIONS}
        value={values.color}
        onChange={(v) => setValues((s) => ({ ...s, color: v }))}
        placeholder="Pick a colour"
      />

      <div>
        <span className="mb-1.5 block text-sm font-[500] text-text-secondary">
          Tags
        </span>
        <div className="flex flex-wrap gap-sm">
          {values.tags.map((tag) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface pr-1.5 pl-lg text-tag text-text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag ${tag}`}
                className="inline-flex size-6 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <X aria-hidden className="size-3.5" />
              </button>
            </motion.span>
          ))}
        </div>

        <div className="mt-md flex gap-sm">
          <Input
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={(e) => {
              // Enter adds a tag without submitting the whole form.
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag…"
            aria-label="Add a tag"
            maxLength={30}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addTag}
            iconLeft={<Plus className="size-4" />}
          >
            Add
          </Button>
        </div>
      </div>

      <div className="mt-lg flex flex-wrap gap-md">
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
