import { useTRPC } from "@/server/trpc/client";
import type { KanbanColumns } from "@/src/types";
import type { KanbanEvent } from "@/src/types/websocket";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useSubscription, type inferOutput } from "@trpc/tanstack-react-query";
import { useMemo, useState } from "react";

export function useKanbanSubscription(teamId: string, projectId: string) {
  const [kanbanColumnError, setKanbanColumnError] =
    useState<Record<string, string[]>>();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const subscriptionOptions = useMemo(() => {
    return trpc.kanbanColumns.subscribeKanbanColumn.subscriptionOptions(
      { teamId, projectId },
      {
        enabled: !!teamId && !!projectId,
        onData: (data) => handleKanbanEvent(data, queryClient, trpc),
        onError: (err) => console.error("Subscription error", err),
        onStarted: () => console.log("Kanban subscription started"),
        onConnectionStateChange: (state) =>
          console.log("Connection state changed:", state),
      }
    );
  }, [teamId, projectId, queryClient, trpc]);

  const kanbanColumnSub = useSubscription(subscriptionOptions);

  return {
    status: kanbanColumnSub.status,
    data: kanbanColumnSub.data,
    error: kanbanColumnSub.error,
    reset: kanbanColumnSub.reset,
    isConnected: kanbanColumnSub.status === "pending",
    isConnecting: kanbanColumnSub.status === "connecting",
    isError: kanbanColumnSub.status === "error",
    kanbanColumnError,
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
        (old) =>
          old
            ? {
                ...old,
                columns: old.columns.some(
                  (c) => c.id === event.payload.kanbanColumn.id
                )
                  ? old.columns.map((c) =>
                      c.id === event.payload.kanbanColumn.id
                        ? (event.payload.kanbanColumn as KanbanColumns)
                        : c
                    )
                  : [
                      ...old.columns,
                      event.payload.kanbanColumn as KanbanColumns,
                    ],
              }
            : old
      );
      break;
    }

    case "kanban_column_updated":
      queryClient.setQueryData<KanbanBoardFilterOutput>(
        trpc.kanbanBoards.getKanbanBoardByFilters.queryKey({
          projectId: event.payload.projectId,
          board: event.payload.kanbanColumn.boardId as string,
        }),
        (old) =>
          old
            ? {
                ...old,
                columns: old.columns.some(
                  (c) => c.id === event.payload.kanbanColumn.id
                )
                  ? old.columns.map((c) =>
                      c.id === event.payload.kanbanColumn.id
                        ? (event.payload.kanbanColumn as KanbanColumns)
                        : c
                    )
                  : [
                      ...old.columns,
                      event.payload.kanbanColumn as KanbanColumns,
                    ],
              }
            : old
      );
      break;

    case "kanban_column_deleted": {
      queryClient.setQueryData<KanbanBoardFilterOutput>(
        trpc.kanbanBoards.getKanbanBoardByFilters.queryKey({
          projectId: event.payload.projectId,
          board: event.payload.id,
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
