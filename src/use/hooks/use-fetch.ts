"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useFetch() {
  const trpc = useTRPC();

  const useFetch = {
    teams: {
      useGetMyTeams: () => {
        return useSuspenseQuery(trpc.teams.getMyTeams.queryOptions());
      },
    },
    projects: {
      useGetMyRecentProjects: (teamId: string) => {
        return useSuspenseQuery(
          trpc.projects.getMyRecentProjects.queryOptions({ teamId })
        );
      },
    },
  };

  return useFetch;
}
