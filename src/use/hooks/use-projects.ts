import { useTRPC } from "@/server/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useProjects() {
  const [projectErrors, setProjectErrors] =
    useState<Record<string, string[]>>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createProject = useMutation(
    trpc.projects.createProject.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.projects.pathKey(),
        });
        setProjectErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setProjectErrors(parsed.fieldErrors);
        } catch {
          setProjectErrors({ global: [error.message] });
        }
      },
    })
  );

  const updateProject = useMutation(
    trpc.projects.updateProject.mutationOptions({
      onSuccess: async () => {
        queryClient.invalidateQueries({
          queryKey: trpc.projects.pathKey(),
        });
        setProjectErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setProjectErrors(parsed.fieldErrors);
        } catch {
          setProjectErrors({ global: [error.message] });
        }
      },
    })
  );

  const deleteProject = useMutation(
    trpc.projects.deleteProject.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.projects.pathKey(),
        });
        setProjectErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setProjectErrors(parsed.fieldErrors);
        } catch {
          setProjectErrors({ global: [error.message] });
        }
      },
    })
  );

  return {
    createProject: createProject.mutateAsync,
    isCreatingProject: createProject.isPending,
    updateProject: updateProject.mutateAsync,
    isUpdatingProject: updateProject.isPending,
    deleteProject: deleteProject.mutateAsync,
    isDeletingProject: deleteProject.isPending,
    projectErrors,
    clearProjectErrors: () => setProjectErrors({}),
  };
}
