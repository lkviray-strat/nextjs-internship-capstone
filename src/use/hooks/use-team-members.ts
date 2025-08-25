import { useTRPC } from "@/server/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useTeamMembers() {
  const [teamMemberErrors, setTeamMemberErrors] =
    useState<Record<string, string[]>>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createTeamMember = useMutation(
    trpc.teamMembers.createTeamMember.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.teamMembers.pathKey(),
        });
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
    trpc.teamMembers.updateTeamMember.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.teamMembers.pathKey(),
        });
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
    trpc.teamMembers.deleteTeamMember.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.teamMembers.pathKey(),
        });
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
