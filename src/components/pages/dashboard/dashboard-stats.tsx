"use client";

import { useFetch } from "@/src/use/hooks/use-fetch";
import { CheckCircle, Clock, TrendingUp, Users } from "lucide-react";
import { useParams } from "next/navigation";

export function DashboardStats() {
  const fetch = useFetch();
  const { teamId } = useParams<{ teamId: string }>();
  const { data: activeProjects } = fetch.projects.useGetActiveProjects(teamId);
  const { data: teamMembers } = fetch.teamMembers.useGetMyTeamMembers(teamId);
  const { data: completedTasks } = fetch.tasks.useGetCompletedTasks();
  const { data: pendingTasks } = fetch.tasks.useGetPendingTasks();

  const activeProjectsCount = activeProjects ?? 0;
  const teamMembersCount = teamMembers ? teamMembers.length : 0;
  const completedTasksCount = completedTasks ? completedTasks.length : 0;
  const pendingTasksCount = pendingTasks ? pendingTasks.length : 0;

  return (
    <>
      {[
        {
          name: "Active Projects",
          value: activeProjectsCount,
          icon: TrendingUp,
        },
        { name: "Team Members", value: teamMembersCount, icon: Users },
        {
          name: "Completed Tasks",
          value: completedTasksCount,
          icon: CheckCircle,
        },
        {
          name: "Pending Tasks",
          value: pendingTasksCount,
          icon: Clock,
        },
      ].map((stat) => (
        <div
          key={stat.name}
          className="bg-card overflow-hidden rounded-lg border p-6"
        >
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="size-10 bg-accent rounded-lg flex items-center justify-center">
                <stat.icon size={30} />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400 truncate">
                  {stat.name}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-outer_space-500 dark:text-platinum-500">
                    {stat.value}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
