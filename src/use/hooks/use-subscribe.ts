import { useTRPC } from "@/server/trpc/client";
import type { KanbanColumns, Tasks, User } from "@/src/types";
import type { KanbanEvent } from "@/src/types/websocket";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useSubscription, type inferOutput } from "@trpc/tanstack-react-query";
import { useState } from "react";

export function useKanbanSubscription(teamId: string, projectId: string) {
  const [kanbanSubscriptionError, setKanbanSubscriptionError] =
    useState<Record<string, string[]>>();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const kanbanSubscription = useSubscription(
    trpc.kanbanSubscriptions.subscribeKanban.subscriptionOptions(
      { teamId, projectId },
      {
        enabled: Boolean(teamId && projectId),
        onData: (data) => {
          const { id, data: event } = data;
          handleKanbanEvent(id, event, queryClient, trpc);
        },
        onError: (error) => {
          try {
            const parsed = JSON.parse(error.message) as {
              fieldErrors?: Record<string, string[]>;
            };
            setKanbanSubscriptionError(parsed.fieldErrors);
          } catch {
            setKanbanSubscriptionError({ global: [error.message] });
          }
        },
        onStarted: () => console.log("Kanban subscription started"),
        onConnectionStateChange: (state) =>
          console.log("Connection state changed:", state),
      }
    )
  );

  return {
    status: kanbanSubscription.status,
    data: kanbanSubscription.data,
    error: kanbanSubscription.error,
    reset: kanbanSubscription.reset,
    isConnected: kanbanSubscription.status === "pending",
    isConnecting: kanbanSubscription.status === "connecting",
    isError: kanbanSubscription.status === "error",
    kanbanSubscriptionError,
  };
}

function handleKanbanEvent(
  id: string,
  event: KanbanEvent,
  queryClient: QueryClient,
  trpc: ReturnType<typeof useTRPC>
) {
  type KanbanBoardFilterOutput = inferOutput<
    typeof trpc.kanbanBoards.getKanbanBoardByFilters
  >;

  switch (event.type) {
    case "kanban_column_created": {
      queryClient.setQueryData<KanbanBoardFilterOutput>(
        trpc.kanbanBoards.getKanbanBoardByFilters.queryKey({
          projectId: event.payload.projectId,
          board: event.payload.kanbanColumn.boardId as string,
        }),
        (old) => {
          if (!old) return old;

          const newCol = event.payload.kanbanColumn as KanbanColumns;

          const updatedCols = old.columns.map((c) =>
            c.order >= newCol.order ? { ...c, order: c.order + 1 } : c
          );

          const withNew = [...updatedCols, { ...newCol, tasks: [] }].sort(
            (a, b) => a.order - b.order
          );

          return { ...old, columns: withNew };
        }
      );
      break;
    }

    case "kanban_column_updated": {
      if (event.clientId === id) return;
      queryClient.setQueryData<KanbanBoardFilterOutput>(
        trpc.kanbanBoards.getKanbanBoardByFilters.queryKey({
          projectId: event.payload.projectId,
          board: event.payload.kanbanColumn.boardId as string,
        }),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            columns: old.columns.map((c) =>
              c.id === event.payload.kanbanColumn.id
                ? {
                    ...(event.payload.kanbanColumn as KanbanColumns),
                    tasks: c.tasks, // preserve existing tasks
                  }
                : c
            ),
          };
        }
      );
      break;
    }

    case "kanban_column_deleted": {
      queryClient.setQueryData<KanbanBoardFilterOutput>(
        trpc.kanbanBoards.getKanbanBoardByFilters.queryKey({
          projectId: event.payload.projectId,
          board: event.payload.boardId,
        }),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            columns: old.columns.filter(
              (column) => column.id !== event.payload.id
            ),
          };
        }
      );

      break;
    }

    case "task_created": {
      queryClient.setQueryData<KanbanBoardFilterOutput>(
        trpc.kanbanBoards.getKanbanBoardByFilters.queryKey({
          projectId: event.payload.projectId,
          board: event.payload.boardId,
        }),
        (old) => {
          if (!old) return old;

          const newTask = event.payload.task as Tasks & {
            assignee: User | null;
          };

          return {
            ...old,
            columns: old.columns.map((col) =>
              col.id === newTask.kanbanColumnId
                ? {
                    ...col,
                    tasks: [...col.tasks, newTask].sort(
                      (a, b) => a.order - b.order
                    ),
                  }
                : col
            ),
          };
        }
      );
      break;
    }

    case "task_updated": {
      if (event.clientId === id) return;
      queryClient.setQueryData<KanbanBoardFilterOutput>(
        trpc.kanbanBoards.getKanbanBoardByFilters.queryKey({
          projectId: event.payload.projectId,
          board: event.payload.boardId,
        }),
        (old) => {
          if (!old) return old;

          const updatedTask = event.payload.task as Tasks & {
            assignee: User | null;
          };

          return {
            ...old,
            columns: old.columns.map((col) => {
              if (col.id === updatedTask.kanbanColumnId) {
                const withoutTask = col.tasks.filter(
                  (t) => t.id !== updatedTask.id
                );

                return {
                  ...col,
                  tasks: [...withoutTask, updatedTask].sort(
                    (a, b) => a.order - b.order
                  ),
                };
              }

              return {
                ...col,
                tasks: col.tasks.filter((t) => t.id !== updatedTask.id),
              };
            }),
          };
        }
      );
      break;
    }

    case "task_deleted": {
      queryClient.setQueryData<KanbanBoardFilterOutput>(
        trpc.kanbanBoards.getKanbanBoardByFilters.queryKey({
          projectId: event.payload.projectId,
          board: event.payload.boardId,
        }),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            columns: old.columns.map((col) =>
              col.id === event.payload.kanbanColumnId
                ? {
                    ...col,
                    tasks: col.tasks.filter((t) => t.id !== event.payload.id),
                  }
                : col
            ),
          };
        }
      );
      break;
    }
    default:
      queryClient.invalidateQueries({ queryKey: trpc.kanbanColumns.pathKey() });
      queryClient.invalidateQueries({ queryKey: trpc.kanbanBoards.pathKey() });
  }
}
