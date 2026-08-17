import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function ClosetLoading() {
  return (
    <div className="py-4xl">
      <div className="mb-2xl flex flex-wrap items-end justify-between gap-lg">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-28 rounded-sm" />
          <Skeleton className="h-7 w-40 rounded-md" />
        </div>
        <div className="flex gap-md">
          <Skeleton className="h-10 w-[84px] rounded-md" />
          <Skeleton className="h-11 w-[124px] rounded-lg" />
        </div>
      </div>

      <div className="mb-3xl flex flex-wrap items-center gap-md">
        <Skeleton className="h-11 min-w-[240px] flex-1 rounded-lg" />
        <Skeleton className="h-11 w-[124px] rounded-lg" />
      </div>

      <div className="grid grid-cols-2 gap-2xl lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
