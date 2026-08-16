"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PendingFile {
  id: string;
  name: string;
  /** Object URL for the local preview; revoked when removed. */
  preview: string;
}

/**
 * Drag-and-drop plus click-to-browse. Web's stand-in for the mobile camera
 * capture, so it accepts several images at once.
 */
export function UploadZone({
  files,
  onAdd,
  onRemove,
}: {
  files: PendingFile[];
  onAdd: (files: FileList) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  return (
    <div>
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
          if (e.dataTransfer.files?.length) onAdd(e.dataTransfer.files);
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
          <span className="text-body text-text-secondary">
            <span className="font-[600] text-primary-500">Click to browse</span>{" "}
            or drag photos here
          </span>
          <span className="text-caption text-text-muted">
            JPG, PNG, WEBP or HEIC · up to 10MB each
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files?.length) onAdd(e.target.files);
            // Reset so picking the same file twice still fires change.
            e.target.value = "";
          }}
        />
      </motion.div>

      {files.length > 0 && (
        <ul className="mt-xl grid grid-cols-3 gap-lg sm:grid-cols-4 lg:grid-cols-5">
          {files.map((file) => (
            <motion.li
              key={file.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="group relative"
            >
              {/* Local object URL, not a remote asset — plain img is correct
                  here; next/image would try to optimise a blob. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={file.preview}
                alt={file.name}
                className="aspect-square w-full rounded-md border border-border object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(file.id)}
                aria-label={`Remove ${file.name}`}
                className="absolute -top-2 -right-2 inline-flex size-6 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text-secondary shadow-sm transition-colors hover:bg-danger-light hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <X aria-hidden className="size-3.5" />
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
