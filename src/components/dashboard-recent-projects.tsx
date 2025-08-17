"use client";

import { useParams } from "next/navigation";
import { useFetch } from "../use/hooks/use-fetch";

export function DashboardRecentProjects() {
  const { teamId } = useParams<{ teamId: string }>();
  const { data, isError } = useFetch().projects.useGetMyRecentProjects(teamId);

  if (isError) {
    return (
      <div className="text-red-500 flex items-center justify-center h-full">
        Error loading recent projects, please contact support.
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="text-gray-500 flex items-center justify-center h-full">
        No recent projects found.
      </div>
    );
  }

  return (
    <>
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
    </>
  );
}
