import { useTRPC } from "@/server/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useTeams() {
  const [teamErrors, setTeamErrors] = useState<Record<string, string[]>>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createTeam = useMutation(
    trpc.teams.createTeam.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.teams.pathKey(),
        });
        setTeamErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setTeamErrors(parsed.fieldErrors);
        } catch {
          setTeamErrors({ global: [error.message] });
        }
      },
    })
  );

  const updateTeam = useMutation(
    trpc.teams.updateTeam.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.teams.pathKey(),
        });
        setTeamErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setTeamErrors(parsed.fieldErrors);
        } catch {
          setTeamErrors({ global: [error.message] });
        }
      },
    })
  );

  const deleteTeam = useMutation(
    trpc.teams.deleteTeam.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.teams.pathKey(),
        });
        setTeamErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setTeamErrors(parsed.fieldErrors);
        } catch {
          setTeamErrors({ global: [error.message] });
        }
      },
    })
  );

  return {
    createTeam: createTeam.mutateAsync,
    isCreatingTeam: createTeam.isPending,
    updateTeam: updateTeam.mutateAsync,
    isUpdatingTeam: updateTeam.isPending,
    deleteTeam: deleteTeam.mutateAsync,
    isDeletingTeam: deleteTeam.isPending,
    teamErrors,
    clearTeamErrors: () => setTeamErrors({}),
  };
}
