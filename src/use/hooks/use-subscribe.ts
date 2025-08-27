import { useTRPC } from "@/server/trpc/client";
import type { KanbanColumns } from "@/src/types";
import type { KanbanEvent } from "@/src/types/websocket";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useSubscription, type inferOutput } from "@trpc/tanstack-react-query";
import { useMemo, useState } from "react";

export function useKanbanSubscription(teamId: string, projectId: string) {
  const [kanbanSubscriptionError, setKanbanSubscriptionError] =
    useState<Record<string, string[]>>();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const kanbanSubscriptionsOptions = useMemo(() => {
    return trpc.kanbanSubscriptions.subscribeKanban.subscriptionOptions(
      { teamId, projectId },
      {
        enabled: !!teamId && !!projectId,
        onData: (data) => handleKanbanEvent(data, queryClient, trpc),
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
    );
  }, [teamId, projectId, queryClient, trpc]);

  const kanbanSubscription = useSubscription(kanbanSubscriptionsOptions);

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

          const existingColumn = old.columns.find(
            (c) => c.id === event.payload.kanbanColumn.id
          );

          // If column already exists, update it but preserve tasks
          if (existingColumn) {
            return {
              ...old,
              columns: old.columns.map((c) =>
                c.id === existingColumn.id
                  ? {
                      ...(event.payload.kanbanColumn as KanbanColumns),
                      tasks: c.tasks, // keep existing tasks
                    }
                  : c
              ),
            };
          }

          // Otherwise, add new column with empty tasks
          return {
            ...old,
            columns: [
              ...old.columns,
              { ...(event.payload.kanbanColumn as KanbanColumns), tasks: [] },
            ],
          };
        }
      );
      break;
    }

    case "kanban_column_updated": {
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
    // case "task_created":
    //   // Add to appropriate column
    //   queryClient.setQueryData(
    //     ["tasks", event.payload.columnId],
    //     (old: any[] = []) => [...old, event.payload]
    //   );
    //   // Invalidate tasks query to ensure fresh data
    //   utils.kanbanTasks.invalidate();
    //   break;

    // case "task_updated":
    //   // Update specific task
    //   queryClient.setQueryData(
    //     ["task", event.payload.id],
    //     event.payload
    //   );
    //   // Also update in the tasks list
    //   queryClient.setQueryData(
    //     ["tasks", event.payload.columnId],
    //     (old: any[] = []) =>
    //       old.map(task => task.id === event.payload.id ? event.payload : task)
    //   );
    //   break;

    // case "task_deleted":
    //   // Remove task from cache
    //   queryClient.removeQueries(["task", event.payload.taskId]);
    //   // Note: Need to know which column the task was in to remove from list
    //   // You might want to include columnId in the delete payload
    //   break;
    default:
      queryClient.invalidateQueries({ queryKey: trpc.kanbanColumns.pathKey() });
      queryClient.invalidateQueries({ queryKey: trpc.kanbanBoards.pathKey() });
  }
}

// // Optional: Specialized hooks for specific event types
// export function useTaskSubscription(teamId: string, projectId?: string, taskId?: string) {
//   const queryClient = useQueryClient();
//   const utils = trpc.useUtils();

//   trpc.kanbanSubscriptions.onTaskEvents.useSubscription(
//     { teamId, projectId, taskId },
//     {
//       onData: (event) => {
//         handleKanbanEvent(event, queryClient, utils);
//       },
//       onError: (err) => {
//         console.error("Task subscription error:", err);
//       }
//     }
//   );
// }

// export function useColumnSubscription(teamId: string, projectId?: string, columnId?: string) {
//   const queryClient = useQueryClient();
//   const utils = trpc.useUtils();

//   trpc.kanbanSubscriptions.onColumnEvents.useSubscription(
//     { teamId, projectId, columnId },
//     {
//       onData: (event) => {
//         handleKanbanEvent(event, queryClient, utils);
//       },
//       onError: (err) => {
//         console.error("Column subscription error:", err);
//       }
//     }
//   );
// }
