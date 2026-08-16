import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function ClosetLoading() {
  return (
    <div className="py-2xl">
      <div className="mb-xl flex flex-wrap items-end justify-between gap-lg">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-28 rounded-sm" />
          <Skeleton className="h-7 w-40 rounded-md" />
        </div>
        <div className="flex gap-md">
          <Skeleton className="h-10 w-[84px] rounded-md" />
          <Skeleton className="h-11 w-[124px] rounded-lg" />
        </div>
      </div>

      <div className="mb-2xl flex flex-col gap-lg">
        <div className="flex flex-wrap gap-md">
          <Skeleton className="h-11 min-w-[220px] flex-1 rounded-md" />
          <Skeleton className="h-11 w-[180px] rounded-md" />
        </div>
        <div className="flex gap-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-lg sm:gap-2xl lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
