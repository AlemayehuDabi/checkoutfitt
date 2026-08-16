import { Skeleton } from "@/components/ui/skeleton";

export default function CapsuleLoading() {
  return (
    <div className="mx-auto max-w-[900px] py-2xl">
      <Skeleton className="h-9 w-3/4 rounded-md" />
      <Skeleton className="mt-md h-5 w-full max-w-[520px] rounded-sm" />
      <div className="mt-3xl flex flex-col gap-3xl">
        <Skeleton className="h-24 w-full max-w-[320px] rounded-md" />
        <div className="flex flex-wrap gap-sm">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        <div className="flex flex-wrap gap-sm">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>
      </div>
      <Skeleton className="mt-3xl h-13 w-52 rounded-lg" />
    </div>
  );
}
