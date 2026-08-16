import * as React from "react";
import Image from "next/image";
import { cn, initials } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<AvatarSize, { box: string; text: string; px: number }> = {
  xs: { box: "size-7", text: "text-[11px]", px: 28 },
  sm: { box: "size-8", text: "text-[12px]", px: 32 },
  md: { box: "size-10", text: "text-[14px]", px: 40 },
  lg: { box: "size-16", text: "text-[20px]", px: 64 },
  xl: { box: "size-24", text: "text-[28px]", px: 96 },
};

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  className?: string;
}

/** Falls back to initials on a primary-100 disc when there's no image. */
export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const { box, text, px } = SIZES[size];

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-primary-100",
        box,
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={px}
          height={px}
          className="size-full object-cover"
        />
      ) : (
        <span
          aria-hidden
          className={cn("font-[600] text-primary-500", text)}
        >
          {initials(name)}
        </span>
      )}
      {!src && <span className="sr-only">{name}</span>}
    </span>
  );
}
