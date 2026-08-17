import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors the dashboard's two-column rhythm so nothing jumps on load. */
export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-[1200px] py-4xl">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-40 rounded-sm" />
        <Skeleton className="h-8 w-72 rounded-md" />
      </div>

      <div className="mt-3xl grid items-start gap-2xl xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] xl:gap-4xl">
        <div className="flex flex-col gap-2xl">
          <Skeleton className="h-[92px] w-full rounded-lg" />
          <Skeleton className="h-[380px] w-full rounded-xl" />
          <div>
            <Skeleton className="mb-xl h-6 w-44 rounded-md" />
            <div className="grid grid-cols-2 gap-2xl sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[260px] rounded-xl" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2xl">
          <Skeleton className="h-[104px] rounded-xl" />
          <Skeleton className="h-[104px] rounded-xl" />
          <Skeleton className="h-[140px] rounded-md" />
        </div>
      </div>
    </div>
  );
}
