import { Skeleton } from "@/components/ui/skeleton";

export default function TravelLoading() {
  return (
    <div className="mx-auto max-w-[900px] py-2xl">
      <Skeleton className="h-9 w-3/4 rounded-md" />
      <Skeleton className="mt-md h-5 w-full max-w-[560px] rounded-sm" />
      <div className="mt-3xl flex flex-col gap-2xl">
        <Skeleton className="h-[74px] w-full rounded-md" />
        <div className="grid gap-lg sm:grid-cols-2">
          <Skeleton className="h-[74px] rounded-md" />
          <Skeleton className="h-[74px] rounded-md" />
        </div>
        <div className="flex flex-wrap gap-sm">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-full" />
          ))}
        </div>
      </div>
      <Skeleton className="mt-3xl h-13 w-48 rounded-lg" />
    </div>
  );
}
