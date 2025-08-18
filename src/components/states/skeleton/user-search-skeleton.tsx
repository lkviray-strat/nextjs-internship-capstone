import { Skeleton } from "../../ui/skeleton";

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
