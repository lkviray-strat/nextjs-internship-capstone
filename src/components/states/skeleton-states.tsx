import { Skeleton } from "../ui/skeleton";

export function RecentProjectsSkeleton() {
  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="w-full flex flex-col gap-2 items-start justify-center"
          >
            <Skeleton className="w-2/4 h-4" />
            <Skeleton className="w-3/4 h-4" />
          </div>
        ))}
      </div>
    </>
  );
}

type UserSearchSkeletonProps = {
  count?: number;
};

export function UserSearchSkeleton({ count = 3 }: UserSearchSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="flex flex-row gap-4 p-3"
          key={index}
        >
          <Skeleton className="size-11 rounded-full shrink-0" />

          <div className="flex flex-col gap-3 w-full">
            <Skeleton className="w-1/4 h-3" />
            <Skeleton className="w-2/4 h-3" />
          </div>
        </div>
      ))}
    </>
  );
}

export function ProjectGridSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-card flex flex-col gap-3 rounded-lg border p-6 hover:shadow-lg hover:scale-98 transition-transform"
        >
          <Skeleton className="w-1/3 h-5" />
          <div className="flex flex-col gap-5 py-6">
            <Skeleton className="w-6/8 h-5" />
            <div className="flex flex-col gap-2 h-[4rem]">
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-3/4 h-3" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Skeleton className="w-1/4 h-3" />
            <Skeleton className="w-full h-3" />
          </div>
          <div className="flex items-center justify-end text-[16px]">
            <Skeleton className="w-2/5 h-3" />
          </div>
        </div>
      ))}
    </>
  );
}
