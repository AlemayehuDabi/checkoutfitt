import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors the dashboard's rhythm so nothing jumps when content arrives. */
export default function HomeLoading() {
  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-3xl py-2xl">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-40 rounded-sm" />
        <Skeleton className="h-8 w-72 rounded-md" />
      </div>

      <Skeleton className="h-[86px] w-full rounded-md" />

      <Skeleton className="h-[300px] w-full rounded-xl" />

      <div className="grid gap-lg sm:grid-cols-2">
        <Skeleton className="h-[88px] rounded-xl" />
        <Skeleton className="h-[88px] rounded-xl" />
      </div>

      <div>
        <Skeleton className="mb-xl h-6 w-44 rounded-md" />
        <div className="grid gap-lg sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[230px] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
