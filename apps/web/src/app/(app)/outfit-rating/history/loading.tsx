import { Skeleton } from "@/components/ui/skeleton";

export default function RatingHistoryLoading() {
  return (
    <div className="py-2xl">
      <Skeleton className="mb-xl h-4 w-36 rounded-sm" />
      <div className="mb-2xl flex flex-col gap-2">
        <Skeleton className="h-3 w-28 rounded-sm" />
        <Skeleton className="h-7 w-40 rounded-md" />
      </div>
      <div className="grid grid-cols-2 gap-lg sm:gap-2xl lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[320px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
