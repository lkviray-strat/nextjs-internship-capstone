import { useTRPC } from "@/server/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { inferOutput } from "@trpc/tanstack-react-query";
import { useState } from "react";

export function useKanbanColumns() {
  const [kanbanColumnErrors, setKanbanColumnErrors] =
    useState<Record<string, string[]>>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  type KanbanBoardFilterOutput = inferOutput<
    typeof trpc.kanbanBoards.getKanbanBoardByFilters
  >;

  const createKanbanColumn = useMutation(
    trpc.kanbanColumns.createKanbanColumn.mutationOptions({
      onSuccess: () => {
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
      onMutate: async (updatedColumn) => {
        const queryKey = trpc.kanbanBoards.getKanbanBoardByFilters.queryKey({
          projectId: updatedColumn.projectId,
          board: updatedColumn.boardId,
        });

        await queryClient.cancelQueries({
          queryKey,
        });

        const previousBoard =
          queryClient.getQueryData<KanbanBoardFilterOutput>(queryKey);

        if (previousBoard) {
          const updatedBoard = {
            ...previousBoard,
            columns: previousBoard.columns.map((column) =>
              column.id === updatedColumn.id
                ? { ...column, ...updatedColumn }
                : column
            ),
          };

          queryClient.setQueryData(queryKey, updatedBoard);
        }

        return { previousBoard, queryKey };
      },
      onError: (err, updatedColumn, context) => {
        if (context?.previousBoard) {
          queryClient.setQueryData(context.queryKey, context.previousBoard);
        }
        // Handle error
      },
      onSettled: (updatedColumn, error, data) => {
        const queryKey = trpc.kanbanBoards.getKanbanBoardByFilters.queryKey({
          projectId: data.projectId,
          board: data.boardId,
        });
        if (updatedColumn) {
          queryClient.invalidateQueries({
            queryKey,
          });
        }
      },
    })
  );

  const deleteKanbanColumn = useMutation(
    trpc.kanbanColumns.deleteKanbanColumn.mutationOptions({
      onSuccess: () => {
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
