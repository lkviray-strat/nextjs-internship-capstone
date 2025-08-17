import { trpc } from "@/trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useTeams() {
  const queryClient = useQueryClient();

  const createTeam = useMutation(
    trpc.teams.createTeams.mutationOptions({
      onSuccess: () => {
        const mutationKey = trpc.teams.createTeams.mutationKey();
        queryClient.invalidateQueries({ queryKey: mutationKey });
      },
    })
  );

  const updateTeam = useMutation(
    trpc.teams.updateTeams.mutationOptions({
      onSuccess: () => {
        const mutationKey = trpc.teams.updateTeams.mutationKey();
        queryClient.invalidateQueries({ queryKey: mutationKey });
      },
    })
  );

  const deleteTeam = useMutation(
    trpc.teams.deleteTeams.mutationOptions({
      onSuccess: () => {
        const mutationKey = trpc.teams.deleteTeams.mutationKey();
        queryClient.invalidateQueries({ queryKey: mutationKey });
      },
    })
  );

  return {
    createTeam: createTeam.mutate,
    isCreating: createTeam.isPending,
    updateTeam: updateTeam.mutate,
    isUpdating: updateTeam.isPending,
    deleteTeam: deleteTeam.mutate,
    isDeleting: deleteTeam.isPending,
  };
}
