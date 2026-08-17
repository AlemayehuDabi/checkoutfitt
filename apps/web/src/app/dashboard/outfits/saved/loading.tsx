import { Skeleton } from "@/components/ui/skeleton";

export default function SavedOutfitsLoading() {
  return (
    <div className="py-4xl">
      <div className="mb-2xl flex flex-wrap items-end justify-between gap-lg">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-28 rounded-sm" />
          <Skeleton className="h-7 w-48 rounded-md" />
        </div>
        <Skeleton className="h-11 w-[180px] rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-2xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[420px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
