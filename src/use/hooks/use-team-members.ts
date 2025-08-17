import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useTeamMembers() {
  const [teamMemberErrors, setTeamMemberErrors] =
    useState<Record<string, string[]>>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createTeamMember = useMutation(
    trpc.teamMembers.createTeamMembers.mutationOptions({
      onSuccess: () => {
        const mutationKey = trpc.teamMembers.createTeamMembers.mutationKey();
        queryClient.invalidateQueries({ queryKey: mutationKey });
        setTeamMemberErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setTeamMemberErrors(parsed.fieldErrors);
        } catch {
          setTeamMemberErrors({ global: [error.message] });
        }
      },
    })
  );

  const updateTeamMember = useMutation(
    trpc.teamMembers.updateTeamMembers.mutationOptions({
      onSuccess: () => {
        const mutationKey = trpc.teamMembers.updateTeamMembers.mutationKey();
        queryClient.invalidateQueries({ queryKey: mutationKey });
        setTeamMemberErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setTeamMemberErrors(parsed.fieldErrors);
        } catch {
          setTeamMemberErrors({ global: [error.message] });
        }
      },
    })
  );

  const deleteTeamMember = useMutation(
    trpc.teamMembers.deleteTeamMembers.mutationOptions({
      onSuccess: () => {
        const mutationKey = trpc.teamMembers.deleteTeamMembers.mutationKey();
        queryClient.invalidateQueries({ queryKey: mutationKey });
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setTeamMemberErrors(parsed.fieldErrors);
        } catch {
          setTeamMemberErrors({ global: [error.message] });
        }
      },
    })
  );

  return {
    createTeamMember: createTeamMember.mutateAsync,
    isCreatingTeamMember: createTeamMember.isPending,
    updateTeamMember: updateTeamMember.mutateAsync,
    isUpdatingTeamMember: updateTeamMember.isPending,
    deleteTeamMember: deleteTeamMember.mutateAsync,
    isDeletingTeamMember: deleteTeamMember.isPending,
    teamMemberErrors,
    clearTeamMemberErrors: () => setTeamMemberErrors({}),
  };
}
