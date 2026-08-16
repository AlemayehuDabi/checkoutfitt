import { Skeleton } from "@/components/ui/skeleton";

/** Alternating bubble widths so the placeholder reads as a conversation. */
export default function ChatLoading() {
  const bubbles = [
    { align: "end", w: "w-[52%]", h: "h-14" },
    { align: "start", w: "w-[68%]", h: "h-24" },
    { align: "end", w: "w-[38%]", h: "h-12" },
    { align: "start", w: "w-[72%]", h: "h-32" },
  ] as const;

  return (
    <div className="-mb-6xl flex h-[calc(100dvh-4rem)] flex-col">
      <div className="flex-1 overflow-hidden py-2xl">
        <div className="mx-auto flex w-full max-w-[800px] flex-col gap-lg">
          {bubbles.map((bubble, i) => (
            <div
              key={i}
              className={`flex gap-md ${bubble.align === "end" ? "justify-end" : "justify-start"}`}
            >
              {bubble.align === "start" && (
                <Skeleton className="size-8 shrink-0 rounded-full" />
              )}
              <Skeleton className={`${bubble.w} ${bubble.h} rounded-lg`} />
            </div>
          ))}
        </div>
      </div>
      <div className="shrink-0 border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-[800px] px-lg py-lg sm:px-2xl">
          <div className="mb-md flex gap-sm">
            {["w-40", "w-48", "w-32"].map((w) => (
              <Skeleton key={w} className={`h-9 ${w} rounded-full`} />
            ))}
          </div>
          <div className="flex items-center gap-sm">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <Skeleton className="h-11 flex-1 rounded-full" />
            <Skeleton className="size-10 shrink-0 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
