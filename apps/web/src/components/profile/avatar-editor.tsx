"use client";

import * as React from "react";
import { Camera } from "lucide-react";
import { initials } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

/** Large avatar with a hover/focus upload overlay. */
export function AvatarEditor({ name }: { name: string }) {
  const { toast } = useToast();
  const [photo, setPhoto] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo);
    };
  }, [photo]);

  return (
    <div className="shrink-0">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="Change profile photo"
        className="group relative inline-flex size-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-border bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="size-full object-cover" />
        ) : (
          <span aria-hidden className="text-[28px] font-[600] text-primary-500">
            {initials(name)}
          </span>
        )}
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-[color:var(--color-overlay)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <Camera className="size-6 text-white" />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setPhoto(URL.createObjectURL(file));
            toast({ kind: "success", title: "Photo updated" });
          }
          e.target.value = "";
        }}
      />
    </div>
  );
}
