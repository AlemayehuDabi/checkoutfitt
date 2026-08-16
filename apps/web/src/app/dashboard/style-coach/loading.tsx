import { Skeleton } from "@/components/ui/skeleton";

export default function StyleCoachLoading() {
  return (
    <div className="mx-auto max-w-[900px] py-4xl">
      <div className="rounded-xl border border-border bg-surface p-2xl shadow-lg">
        <Skeleton className="size-12 rounded-md" />
        <Skeleton className="mt-xl h-9 w-4/5 rounded-md" />
        <Skeleton className="mt-md h-5 w-full rounded-sm" />
        <Skeleton className="mt-2 h-5 w-3/4 rounded-sm" />
        <div className="mt-2xl flex flex-col gap-md">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full rounded-sm" />
          ))}
        </div>
        <Skeleton className="mt-2xl h-13 w-48 rounded-lg" />
      </div>
    </div>
  );
}
