"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PickedPhoto {
  name: string;
  preview: string;
}

/**
 * Single-photo drop zone with click-to-browse and a preview.
 *
 * Shared by every "upload one image and analyze it" flow so the interaction,
 * drag affordance and copy stay identical across rating, colour analysis,
 * shopping and inspiration.
 *
 * Owns no object URLs — the caller creates and revokes them, since it decides
 * how long the preview needs to outlive this component.
 */
export function PhotoDropzone({
  photo,
  onPick,
  onClear,
  prompt,
  hint,
  previewClassName = "aspect-[3/4] w-64 rounded-xl",
}: {
  photo: PickedPhoto | null;
  onPick: (file: File) => void;
  onClear: () => void;
  prompt: React.ReactNode;
  hint: string;
  previewClassName?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  if (photo) {
    return (
      <div className="relative w-fit">
        {/* Local object URL — next/image would try to optimise a blob. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.preview}
          alt={photo.name}
          className={cn("border border-border object-cover shadow-md", previewClassName)}
        />
        <button
          type="button"
          onClick={onClear}
          aria-label="Remove photo"
          className="absolute -top-2 -right-2 inline-flex size-7 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text-secondary shadow-sm transition-colors hover:bg-danger-light hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <X aria-hidden className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <motion.div
      animate={{ scale: dragging ? 1.01 : 1 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onPick(file);
      }}
      className={cn(
        "rounded-xl border-2 border-dashed transition-colors duration-200",
        dragging
          ? "border-primary-500 bg-primary-100"
          : "border-border bg-surface hover:border-primary-300 hover:bg-primary-50",
      )}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full cursor-pointer flex-col items-center gap-md rounded-xl px-lg py-6xl text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      >
        <UploadCloud
          aria-hidden
          className={cn(
            "size-12 stroke-[1.25] transition-colors duration-200",
            dragging ? "text-primary-500" : "text-text-muted",
          )}
        />
        <span className="text-body text-text-secondary">{prompt}</span>
        <span className="text-caption text-text-muted">{hint}</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
          // Reset so re-picking the same file still fires change.
          e.target.value = "";
        }}
      />
    </motion.div>
  );
}

/** Shared "click to browse or drag here" prompt. */
export function DropPrompt({ what }: { what: string }) {
  return (
    <>
      <span className="font-[600] text-primary-500">Click to browse</span> or
      drag {what} here
    </>
  );
}
