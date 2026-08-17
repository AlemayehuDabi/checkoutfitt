import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[900px] py-4xl">
      <div className="flex flex-col gap-2xl sm:flex-row sm:items-center">
        <Skeleton className="size-24 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-9 w-56 rounded-md" />
          <Skeleton className="h-4 w-64 rounded-sm" />
          <Skeleton className="h-3.5 w-40 rounded-sm" />
        </div>
      </div>
      <div className="mt-3xl grid gap-lg sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[128px] rounded-xl" />
        ))}
      </div>
      <div className="mt-3xl grid gap-lg sm:grid-cols-2">
        <Skeleton className="h-[220px] rounded-xl" />
        <Skeleton className="h-[220px] rounded-xl" />
      </div>
    </div>
  );
}
