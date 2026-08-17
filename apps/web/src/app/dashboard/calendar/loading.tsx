import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarLoading() {
  return (
    <div className="py-4xl">
      <div className="rounded-xl border border-border bg-surface p-lg shadow-md sm:p-2xl">
        <div className="mb-xl flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-44 rounded-md" />
            <Skeleton className="h-3.5 w-28 rounded-sm" />
          </div>
          <div className="flex gap-sm">
            <Skeleton className="h-9 w-16 rounded-lg" />
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="size-10 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-[560px] w-full rounded-md" />
      </div>
    </div>
  );
}
