"use client";

import { useDebounce } from "@/src/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export function useFetch() {
  const trpc = useTRPC();

  const useFetch = {
    users: {
      useGetUserById: (userId: string) => {
        return useSuspenseQuery(trpc.users.getUserById.queryOptions(userId));
      },
      useGetUsersBySearch: (query: string, limit?: number) => {
        const debounced = useDebounce(query, 500);
        return useQuery(
          trpc.users.getUsersBySearch.queryOptions(
            { query: debounced, limit },
            {
              enabled: debounced.length > 0,
            }
          )
        );
      },
    },
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
    roles: {
      useGetRoleByDescLimitOffset: (limit?: number, offset?: number) => {
        return useSuspenseQuery(
          trpc.roles.getRoleByDescLimitOffset.queryOptions({ limit, offset })
        );
      },
    },
  };

  return useFetch;
}
