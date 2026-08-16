import { Skeleton } from "@/components/ui/skeleton";

export default function WardrobeGapsLoading() {
  return (
    <div className="mx-auto max-w-[820px] py-2xl">
      <div className="rounded-xl border border-border bg-surface p-2xl shadow-lg">
        <div className="flex gap-lg">
          <Skeleton className="size-12 shrink-0 rounded-md" />
          <div className="flex-1 flex-col">
            <Skeleton className="h-3 w-40 rounded-sm" />
            <Skeleton className="mt-2 h-8 w-3/4 rounded-md" />
          </div>
        </div>
        <Skeleton className="mt-xl h-2 w-full rounded-full" />
        <Skeleton className="mt-xl h-5 w-full rounded-sm" />
      </div>
      <div className="mt-4xl flex flex-col gap-md">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[168px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
