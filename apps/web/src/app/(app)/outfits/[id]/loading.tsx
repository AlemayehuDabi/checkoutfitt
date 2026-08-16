import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function OutfitDetailLoading() {
  return (
    <div className="py-2xl">
      <Skeleton className="mb-xl h-4 w-40 rounded-sm" />
      <div className="grid gap-3xl lg:grid-cols-[45%_1fr] lg:items-start">
        <Skeleton className="aspect-[4/5] w-full rounded-xl" />
        <div className="flex flex-col gap-xl">
          <Skeleton className="h-3 w-24 rounded-sm" />
          <Skeleton className="h-9 w-3/4 rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
          <div className="flex flex-col gap-sm">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[76px] w-full rounded-md" />
            ))}
          </div>
          <SkeletonText lines={2} className="max-w-[360px]" />
        </div>
      </div>
    </div>
  );
}
