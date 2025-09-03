import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

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
          <Skeleton className="size-18" />
          <div className="flex flex-col gap-5">
            <Skeleton className="w-6/8 h-5" />
            <div className="flex flex-col gap-2 h-[4rem]">
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-full h-3" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <Skeleton className="w-1/4 h-3" />
              <Skeleton className="w-full h-3" />
            </div>
            <div className="flex flex-col items-end gap-3 text-[16px]">
              <Skeleton className="w-4/5 h-3" />
              <Skeleton className="w-2/5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function CommentsSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex gap-4 w-full h-fit"
        >
          <Skeleton className="size-10 rounded-full shrink-0" />
          <div className="flex flex-col w-full mt-1 gap-1">
            <Skeleton className="w-1/4 h-3" />
            <Skeleton className="w-3/4 h-3" />
          </div>
        </div>
      ))}
    </>
  );
}

export function TeamTableSkeleton() {
  return (
    <>
      {Array.from({ length: 7 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell className="flex gap-4 pl-3 py-3">
            <Skeleton className="size-10 rounded-full shrink-0" />
            <div className="flex flex-col w-full gap-1 justify-center">
              <Skeleton className="w-2/5 h-4" />
              <Skeleton className="w-3/4 h-4" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="w-2/4 h-1 px-3 py-3" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-2/4 h-1 px-3 py-3" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-2/4 h-1 px-3 py-3" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="bg-card overflow-hidden rounded-lg border p-6"
        >
          <div className="flex items-center">
            <div className="shrink-0">
              <Skeleton className="size-10 bg-accent rounded-lg" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl className="flex flex-col gap-3">
                <Skeleton className="w-3/4 h-3 mb-2" />
                <Skeleton className="w-1/4 h-3" />
              </dl>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
