import { Skeleton } from "../../ui/skeleton";

export function RecentProjectsSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-6">
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
    </div>
  );
}
