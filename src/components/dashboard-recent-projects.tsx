"use client";

import { useParams } from "next/navigation";
import { PROJECT_STATUS_TW_COLORS } from "../lib/db/enums";
import { getTimeLastUpdated } from "../lib/utils";
import { useFetch } from "../use/hooks/use-fetch";
import { ProjectStatus } from "./project-status";
import { DashboardRecentProjectsEmpty } from "./states/empty-states";
import { DashboardRecentProjectsError } from "./states/error-states";

export function DashboardRecentProjects() {
  const { teamId } = useParams<{ teamId: string }>();
  const { data, isError } = useFetch().projects.useGetMyRecentProjects(teamId);

  if (isError) return <DashboardRecentProjectsError />;
  if (data?.length === 0) return <DashboardRecentProjectsEmpty />;

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
      <div className="space-y-3">
        {data?.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-3 bg-muted rounded-lg"
          >
            <div className="flex flex-col gap-0.5">
              <div className="font-medium">{project.name}</div>
              <div className="text-sm">
                {getTimeLastUpdated(project.updatedAt)}
              </div>
            </div>
            <ProjectStatus
              color={PROJECT_STATUS_TW_COLORS[project.status]}
              status={project.status}
            />
          </div>
        ))}
      </div>
    </>
  );
}
