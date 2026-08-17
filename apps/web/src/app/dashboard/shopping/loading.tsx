import { Skeleton } from "@/components/ui/skeleton";

export default function ShoppingLoading() {
  return (
    <div className="mx-auto max-w-[900px] py-4xl">
      <Skeleton className="h-9 w-3/4 rounded-md" />
      <Skeleton className="mt-md h-5 w-full max-w-[560px] rounded-sm" />
      <Skeleton className="mt-3xl h-[260px] w-full rounded-xl" />
      <Skeleton className="mt-2xl h-11 w-full rounded-md" />
      <Skeleton className="mt-3xl h-13 w-52 rounded-lg" />
    </div>
  );
}
