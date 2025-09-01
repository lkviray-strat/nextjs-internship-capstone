import { useTRPC } from "@/server/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { inferOutput } from "@trpc/tanstack-react-query";
import { useState } from "react";

export function useTasks() {
  const [taskErrors, setTaskErrors] = useState<Record<string, string[]>>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  type KanbanBoardFilterOutput = inferOutput<
    typeof trpc.kanbanBoards.getKanbanBoardByFilters
  >;

  const createTask = useMutation(
    trpc.tasks.createTask.mutationOptions({
      onSuccess: () => {
        setTaskErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setTaskErrors(parsed.fieldErrors);
        } catch {
          setTaskErrors({ global: [error.message] });
        }
      },
    })
  );

  const updateTask = useMutation(
    trpc.tasks.updateTask.mutationOptions({
      // Optimistic update implementation
      onMutate: async (updatedTask) => {
        const queryKey = trpc.kanbanBoards.getKanbanBoardByFilters.queryKey({
          projectId: updatedTask.projectId,
          board: updatedTask.boardId,
        });
        await queryClient.cancelQueries({ queryKey });

        // Snapshot the previous value
        const previousBoard = queryClient.getQueryData<KanbanBoardFilterOutput>(
          ["kanbanBoard", updatedTask.projectId, updatedTask.boardId]
        );

        // Optimistically update to the new value
        if (previousBoard) {
          const updatedBoard = {
            ...previousBoard,
            columns: previousBoard.columns.map((column) => ({
              ...column,
              tasks: column.tasks.map((task) =>
                task.id === updatedTask.id ? { ...task, ...updatedTask } : task
              ),
            })),
          };

          queryClient.setQueryData(queryKey, updatedBoard);
        }

        // Return context with the snapshotted value
        return { previousBoard, queryKey };
      },
      // If the mutation fails, use the context we returned above
      onError: (err, updatedTask, context) => {
        if (context?.previousBoard) {
          queryClient.setQueryData(context.queryKey, context.previousBoard);
        }
        // Error handling (keep your existing error handling)
        try {
          const parsed = JSON.parse(err.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setTaskErrors(parsed.fieldErrors);
        } catch {
          setTaskErrors({ global: [err.message] });
        }
      },
      // Always refetch after error or success to ensure sync with server
      onSettled: (updatedTask, error, data) => {
        const queryKey = trpc.kanbanBoards.getKanbanBoardByFilters.queryKey({
          projectId: data.projectId,
          board: data.boardId,
        });
        if (updatedTask) {
          queryClient.invalidateQueries({ queryKey });
        }
      },
    })
  );

  const deleteTask = useMutation(
    trpc.tasks.deleteTask.mutationOptions({
      onSuccess: () => {
        setTaskErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setTaskErrors(parsed.fieldErrors);
        } catch {
          setTaskErrors({ global: [error.message] });
        }
      },
    })
  );

  return {
    createTask: createTask.mutateAsync,
    isCreatingTask: createTask.isPending,
    updateTask: updateTask.mutateAsync,
    isUpdatingTask: updateTask.isPending,
    deleteTask: deleteTask.mutateAsync,
    isDeletingTask: deleteTask.isPending,
    taskErrors,
    clearTaskErrors: () => setTaskErrors({}),
  };
}
