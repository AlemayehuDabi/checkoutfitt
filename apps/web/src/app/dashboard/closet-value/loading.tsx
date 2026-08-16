import { Skeleton } from "@/components/ui/skeleton";

export default function ClosetValueLoading() {
  return (
    <div className="mx-auto max-w-[1200px] py-2xl">
      <Skeleton className="h-3 w-48 rounded-sm" />
      <Skeleton className="mt-sm h-11 w-56 rounded-md" />
      <Skeleton className="mt-sm h-4 w-64 rounded-sm" />
      <div className="mt-2xl grid gap-lg sm:grid-cols-2">
        <Skeleton className="h-[128px] rounded-xl" />
        <Skeleton className="h-[128px] rounded-xl" />
      </div>
      <div className="mt-3xl flex flex-col gap-lg">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-sm" />
        ))}
      </div>
      <div className="mt-3xl flex flex-col gap-sm">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[76px] rounded-md" />
        ))}
      </div>
    </div>
  );
}
