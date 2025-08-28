"use client";

import { useTRPC } from "@/server/trpc/client";
import { useDebounce } from "@/src/hooks/use-debounce";
import type { KanbanBoardFilters, ProjectFiltersInput } from "@/src/types";
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
      useGetUsersBySearchWithinTeamMembers: (
        query: string,
        teamId: string,
        limit?: number
      ) => {
        const debounced = useDebounce(query, 300);
        return useQuery(
          trpc.users.getUserBySearchWithinTeamMembers.queryOptions(
            { query: debounced, teamId, limit },
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
      useGetMyCurrentProject: (projectId: string, teamId: string) => {
        return useSuspenseQuery(
          trpc.projects.getMyCurrentProject.queryOptions({ projectId, teamId })
        );
      },
      useGetMyRecentProjects: (teamId: string) => {
        return useSuspenseQuery(
          trpc.projects.getMyRecentProjects.queryOptions({ teamId })
        );
      },
      useGetProjectsByFilters: (projectFilters: ProjectFiltersInput) => {
        return useQuery(
          trpc.projects.getProjectsByFilters.queryOptions(projectFilters)
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
    kanbanBoards: {
      useGetMyKanbanBoards: (id: string) => {
        return useSuspenseQuery(
          trpc.kanbanBoards.getKanbanBoardsByProjectId.queryOptions(id)
        );
      },
      useGetMyKanbanBoardByFilter: (kanbanBoardFilters: KanbanBoardFilters) => {
        return useSuspenseQuery(
          trpc.kanbanBoards.getKanbanBoardByFilters.queryOptions(
            kanbanBoardFilters
          )
        );
      },
    },
    projectTeams: {
      useGetProjectTeamsByProjectIdWithTeamMembers: (
        projectId: string,
        teamId: string
      ) => {
        return useSuspenseQuery(
          trpc.projectTeams.getProjectTeamsByProjectIdWithTeamMembers.queryOptions(
            { projectId, teamId }
          )
        );
      },
    },
  };

  return useFetch;
}
