import { Skeleton } from "@/components/ui/skeleton";

interface AmazonSearchResultsSkeletonProps {
  query: string;
}

export const AmazonSearchResultsSkeleton = ({
  query,
}: AmazonSearchResultsSkeletonProps) => {
  return (
    <div className="grid gap-2 rounded-2xl border border-zinc-200 bg-white p-2 sm:p-2">
      <div className="grid gap-2 sm:flex sm:flex-row justify-between border-b p-2">
        <div>
          <div className="text-xs text-zinc-600">Vorschau für</div>
          <div className="font-medium capitalize">{query}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Skeleton className="w-full aspect-square rounded-lg" />
        <Skeleton className="w-full aspect-square rounded-lg" />
        <Skeleton className="w-full aspect-square rounded-lg" />
        <Skeleton className="w-full aspect-square rounded-lg" />
      </div>
    </div>
  );
};
