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
      onMutate: async (updatedTask) => {
        const queryKey = trpc.kanbanBoards.getKanbanBoardByFilters.queryKey({
          projectId: updatedTask.projectId,
          board: updatedTask.boardId,
        });

        // Cancel any outgoing refetches to avoid overwriting
        await queryClient.cancelQueries({ queryKey });

        const previousData =
          queryClient.getQueryData<KanbanBoardFilterOutput>(queryKey);

        if (previousData) {
          queryClient.setQueryData<KanbanBoardFilterOutput>(queryKey, (old) => {
            if (!old) return old;

            return {
              ...old,
              columns: old.columns.map((column) => {
                // If this is the target column for a move operation
                if (updatedTask.kanbanColumnId === column.id) {
                  const existingTask = column.tasks.find(
                    (t) => t.id === updatedTask.id
                  );

                  // Task already exists in this column (update)
                  if (existingTask) {
                    return {
                      ...column,
                      tasks: column.tasks
                        .map((task) =>
                          task.id === updatedTask.id
                            ? {
                                ...task,
                                ...updatedTask,
                                // Preserve assignee if not provided in update
                                assignee: updatedTask.assigneeId
                                  ? task.assignee // Keep existing assignee object
                                  : task.assignee,
                              }
                            : task
                        )
                        .sort((a, b) => a.order - b.order),
                    };
                  }

                  // Task is being moved to this column (add)
                  return {
                    ...column,
                    tasks: [
                      ...column.tasks,
                      {
                        ...updatedTask,
                        // Create a minimal assignee object if assigneeId is provided
                        assignee: updatedTask.assigneeId
                          ? { id: updatedTask.assigneeId } // Minimal assignee object
                          : null,
                      },
                    ].sort((a, b) => a.order - b.order),
                  };
                }

                // Remove task from old column if it's being moved
                if (updatedTask.kanbanColumnId) {
                  return {
                    ...column,
                    tasks: column.tasks.filter(
                      (task) => task.id !== updatedTask.id
                    ),
                  };
                }

                // Regular update within same column
                return {
                  ...column,
                  tasks: column.tasks
                    .map((task) =>
                      task.id === updatedTask.id
                        ? {
                            ...task,
                            ...updatedTask,
                            assignee: updatedTask.assigneeId
                              ? task.assignee // Keep existing assignee object
                              : task.assignee,
                          }
                        : task
                    )
                    .sort((a, b) => a.order - b.order),
                };
              }),
            };
          });
        }

        return { previousData, queryKey };
      },

      onSuccess: async () => {
        setTaskErrors({});
      },
      onError: (error, _task, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(context.queryKey, context.previousData);
        }
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setTaskErrors(parsed.fieldErrors);
        } catch {
          setTaskErrors({ global: [error.message] });
        }
      },
      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries({
          queryKey: trpc.kanbanBoards.getKanbanBoardByFilters.queryKey({
            projectId: variables.projectId,
            board: variables.boardId,
          }),
        });
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
