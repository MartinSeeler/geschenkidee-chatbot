import { Skeleton } from "@/components/ui/skeleton";

interface AmazonSearchResultsSkeletonProps {
  query: string;
}

const SkeletonItem = () => {
  return (
    <div className="w-full rounded-lg shadow-base border-2 border-black bg-white">
      <div className="aspect-square items-center content-center flex border-b-2 border-black">
        <Skeleton className="h-12 w-12 rounded-full border-2 border-black mx-auto" />
      </div>
      <div className="space-y-1 py-2 px-2">
        <Skeleton className="h-3 sm:w-3/4 border-2 border-black w-[100px]" />
        <Skeleton className="h-3 sm:w-1/3 border-2 border-black w-[100px]" />
      </div>
    </div>
  );
};

export const AmazonSearchResultsSkeleton = ({
  query,
}: AmazonSearchResultsSkeletonProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
    </div>
  );
};
