import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useKanbanColumns() {
  const [kanbanColumnErrors, setKanbanColumnErrors] =
    useState<Record<string, string[]>>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createKanbanColumn = useMutation(
    trpc.kanbanColumns.createKanbanColumn.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.kanbanColumns.pathKey(),
        });
        setKanbanColumnErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setKanbanColumnErrors(parsed.fieldErrors);
        } catch {
          setKanbanColumnErrors({ global: [error.message] });
        }
      },
    })
  );

  const updateKanbanColumn = useMutation(
    trpc.kanbanColumns.updateKanbanColumn.mutationOptions({
      onSuccess: async () => {
        queryClient.invalidateQueries({
          queryKey: trpc.kanbanColumns.pathKey(),
        });
        setKanbanColumnErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setKanbanColumnErrors(parsed.fieldErrors);
        } catch {
          setKanbanColumnErrors({ global: [error.message] });
        }
      },
    })
  );

  const deleteKanbanColumn = useMutation(
    trpc.kanbanColumns.deleteKanbanColumn.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.kanbanColumns.pathKey(),
        });
        setKanbanColumnErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setKanbanColumnErrors(parsed.fieldErrors);
        } catch {
          setKanbanColumnErrors({ global: [error.message] });
        }
      },
    })
  );

  return {
    createKanbanColumn: createKanbanColumn.mutateAsync,
    isCreatingKanbanColumn: createKanbanColumn.isPending,
    updateKanbanColumn: updateKanbanColumn.mutateAsync,
    isUpdatingKanbanColumn: updateKanbanColumn.isPending,
    deleteKanbanColumn: deleteKanbanColumn.mutateAsync,
    isDeletingKanbanColumn: deleteKanbanColumn.isPending,
    kanbanColumnErrors,
    clearKanbanColumnErrors: () => setKanbanColumnErrors({}),
  };
}
