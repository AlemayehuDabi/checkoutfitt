import { Skeleton } from "@/components/ui/skeleton";

export default function OutfitRatingLoading() {
  return (
    <div className="mx-auto max-w-[1200px] py-4xl">
      <Skeleton className="h-9 w-2/3 rounded-md" />
      <Skeleton className="mt-md h-5 w-full max-w-[520px] rounded-sm" />
      <Skeleton className="mt-3xl h-[280px] w-full rounded-xl" />
      <div className="mt-2xl flex gap-sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <Skeleton className="mt-3xl h-13 w-44 rounded-lg" />
    </div>
  );
}
