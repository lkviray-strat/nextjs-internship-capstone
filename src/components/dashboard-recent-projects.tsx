"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function DashboardRecentProjects() {
  const trpc = useTRPC();
  const { isError, data } = useSuspenseQuery(trpc.getProject.queryOptions());

  if (isError) {
    return (
      <div className="bg-card text-red-500 flex items-center justify-center rounded-lg border p-6">
        <p>Error loading recent projects, please contact support.</p>
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="bg-card text-gray-500 flex items-center justify-center rounded-lg border p-6">
        <p>No recent projects found.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
      <div className="space-y-3">
        {data?.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-3 bg-muted rounded-lg"
          >
            <div>
              <div className="font-medium">{project.name}</div>
              <div className="text-sm">Last updated 2 hours ago</div>
            </div>
            <div className="w-12 h-2 bg-accent rounded-full">
              <div className="w-8 h-2 bg-muted-foreground rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
