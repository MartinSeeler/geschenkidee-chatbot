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
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
        <div className="flex flex-row items-start sm:items-center gap-2 rounded-xl p-2">
          <div className="grid gap-4 sm:grid-cols-6 items-start sm:gap-6 flex-1">
            <div className="w-full sm:w-18 justify-center aspect-square rounded-lg overflow-hidden">
              <Skeleton className="h-18 w-18 aspect-square" />
            </div>
            <div className="col-span-2 sm:col-span-4">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-5" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              <div className="text-sm text-zinc-600 pt-1">
                <Skeleton className="h-4 w-1/5" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6" />
            </div>
          </div>
        </div>
        <div className="flex flex-row items-start sm:items-center gap-2 rounded-xl p-2">
          <div className="grid gap-4 sm:grid-cols-6 items-start sm:gap-6 flex-1">
            <div className="w-full sm:w-18 justify-center aspect-square rounded-lg overflow-hidden">
              <Skeleton className="h-18 w-18 aspect-square" />
            </div>
            <div className="col-span-2 sm:col-span-4">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              <div className="text-sm text-zinc-600 pt-1">
                <Skeleton className="h-4 w-1/6" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6" />
            </div>
          </div>
        </div>
        <div className="flex flex-row items-start sm:items-center gap-2 rounded-xl p-2">
          <div className="grid gap-4 sm:grid-cols-6 items-start sm:gap-6 flex-1">
            <div className="w-full sm:w-18 justify-center aspect-square rounded-lg overflow-hidden">
              <Skeleton className="h-18 w-18 aspect-square" />
            </div>
            <div className="col-span-2 sm:col-span-4">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-5" />
                <Skeleton className="h-5 w-3/5" />
              </div>
              <div className="text-sm text-zinc-600 pt-1">
                <Skeleton className="h-4 w-1/5" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6" />
            </div>
          </div>
        </div>
        <div className="flex flex-row items-start sm:items-center gap-2 rounded-xl p-2">
          <div className="grid gap-4 sm:grid-cols-6 items-start sm:gap-6 flex-1">
            <div className="w-full sm:w-18 justify-center aspect-square rounded-lg overflow-hidden">
              <Skeleton className="h-18 w-18 aspect-square" />
            </div>
            <div className="col-span-2 sm:col-span-4">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-5" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              <div className="text-sm text-zinc-600 pt-1">
                <Skeleton className="h-4 w-1/5" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
