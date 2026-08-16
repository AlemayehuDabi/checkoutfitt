import { Skeleton } from "@/components/ui/skeleton";

export default function ColorAnalysisLoading() {
  return (
    <div className="mx-auto max-w-[820px] py-2xl">
      <Skeleton className="h-9 w-3/4 rounded-md" />
      <Skeleton className="mt-md h-5 w-full max-w-[560px] rounded-sm" />
      <Skeleton className="mt-3xl h-[260px] w-full rounded-xl" />
      <Skeleton className="mt-3xl h-13 w-52 rounded-lg" />
    </div>
  );
}
