"use client";

import { KanbanColumnsEmpty } from "@/src/components/states/empty-states";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/src/components/ui/shadcn-io/kanban";
import { useUIStore } from "@/src/stores/ui-store";
import { useKanbanSubscription } from "@/src/use/hooks/use-subscribe";
import { useTasks } from "@/src/use/hooks/use-tasks";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { KanbanColumns, Tasks } from "../../../../types";
import { useFetch } from "../../../../use/hooks/use-fetch";
import { useKanbanColumns } from "../../../../use/hooks/use-kanban-columns";
import { KanbanColumnDropdown } from "./column-dropdown";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function Kanban() {
  const fetch = useFetch();
  const searchParams = useSearchParams();
  const { isEditingMode } = useUIStore();
  const { teamId, projectId } = useParams<{
    teamId: string;
    projectId: string;
  }>();

  useKanbanSubscription(teamId, projectId);
  const kanbanColumnHooks = useKanbanColumns();
  const tasksHooks = useTasks();
  const { data: project } = fetch.projects.useGetMyCurrentProject(
    projectId,
    teamId
  );

  const board =
    searchParams.get("board")?.toString() ?? project[0].defaultBoardId ?? "";

  const { data: kanbanBoard } = fetch.kanbanBoards.useGetMyKanbanBoardByFilter({
    projectId,
    board,
  });

  // Local state for optimistic updates
  const [optimisticColumns, setOptimisticColumns] = useState<KanbanColumns[]>(
    []
  );
  const [optimisticTasks, setOptimisticTasks] = useState<Tasks[]>([]);

  // Sync optimistic state with query data when it changes
  useEffect(() => {
    if (kanbanBoard?.columns) {
      const sortedColumns = kanbanBoard.columns
        .sort((a, b) => a.order - b.order)
        .map((column) => ({
          ...column,
          color: column.color || "#6B7280",
        }));

      const allTasks = kanbanBoard.columns.flatMap((column) =>
        column.tasks.sort((a, b) => a.order - b.order)
      );

      setOptimisticColumns(sortedColumns);
      setOptimisticTasks(allTasks);
    }
  }, [kanbanBoard]); // Sync when query data changes

  const columns = useMemo(() => {
    if (!kanbanBoard?.columns) return [];
    return optimisticColumns.length > 0
      ? optimisticColumns
      : kanbanBoard.columns
          .sort((a, b) => a.order - b.order)
          .map((column) => ({
            ...column,
            color: column.color || "#6B7280",
          }));
  }, [kanbanBoard?.columns, optimisticColumns]);

  const tasks = useMemo(() => {
    if (!kanbanBoard?.columns) return [];
    return optimisticTasks.length > 0
      ? optimisticTasks
      : kanbanBoard.columns.flatMap((column) =>
          column.tasks
            .sort((a, b) => a.order - b.order)
            .map((task) => ({
              ...task,
            }))
        );
  }, [kanbanBoard?.columns, optimisticTasks]);

  const handleColumnReorder = useCallback(
    async (reorderedColumns: KanbanColumns[]) => {
      // Optimistic update
      setOptimisticColumns(reorderedColumns);

      try {
        const updatedColumns = reorderedColumns.map((column, index) => ({
          ...column,
          order: index,
        }));

        for (const column of updatedColumns) {
          const current = { id: column.id, teamId, projectId };
          await kanbanColumnHooks.updateKanbanColumn({
            ...current,
            order: column.order,
          });
        }
      } catch (error) {
        // Revert optimistic update on error
        setOptimisticColumns(kanbanBoard?.columns || []);
        console.error("Failed to update column order:", error);
      }
    },
    [kanbanColumnHooks, projectId, teamId, kanbanBoard?.columns]
  );

  const handleTaskReorder = useCallback(
    async (updatedTasks: Tasks[]) => {
      // Optimistic update
      setOptimisticTasks(updatedTasks);

      try {
        const originalTasksMap = new Map(tasks.map((task) => [task.id, task]));

        for (const task of updatedTasks) {
          const originalTask = originalTasksMap.get(task.id);
          if (!originalTask) continue;

          const movedBetweenColumns =
            originalTask.kanbanColumnId !== task.kanbanColumnId;
          const movedWithinColumn =
            originalTask.order !==
            updatedTasks.findIndex((t) => t.id === task.id);

          if (movedBetweenColumns || movedWithinColumn) {
            await tasksHooks.updateTask({
              id: Number(task.id),
              order: updatedTasks.findIndex((t) => t.id === task.id),
              kanbanColumnId: task.kanbanColumnId,
              teamId,
              projectId,
              boardId: board,
            });
          }
        }
      } catch (error) {
        // Revert optimistic update on error
        setOptimisticTasks(tasks);
        toast.error("Failed to update task");
        console.log("Failed to update task order:", error);
      }
    },
    [tasks, tasksHooks, teamId, projectId, board]
  );

  if (kanbanBoard?.columns.length === 0) return <KanbanColumnsEmpty />;

  return (
    <KanbanProvider
      columns={columns}
      data={tasks}
      onDataChange={handleTaskReorder}
      onColumnReorder={handleColumnReorder}
      className="h-[calc(100vh-15rem)] w-full overflow-x-auto pb-3 px-4 sm:px-6 lg:px-8"
    >
      {(column) => (
        <KanbanBoard
          id={column.id}
          key={column.id}
          isColumnDraggable={isEditingMode}
        >
          <KanbanHeader
            className="p-2 px-3"
            columnId={column.id}
            isColumnDraggable={isEditingMode}
          >
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex text-[15px] py-2 items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: column.color || "transparent" }}
                />
                <span>{column.name}</span>
              </div>
              {!isEditingMode && <KanbanColumnDropdown column={column} />}
            </div>
          </KanbanHeader>
          <KanbanCards id={column.id}>
            {(task) => (
              <KanbanCard
                id={task.id}
                key={task.id}
                title={task.title}
                kanbanColumnId={column.id}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="m-0 flex-1 font-medium text-sm">
                      {task.title}
                    </p>
                  </div>
                  {task.assignee && (
                    <Avatar
                      className="h-4 w-4 shrink-0"
                      content={`${task.assignee.firstName} ${task.assignee.lastName}`}
                    >
                      <AvatarImage
                        src={task.assignee.profileImageUrl as string}
                      />
                      <AvatarFallback>
                        {`${task.assignee.firstName}${task.assignee.lastName}`}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                {task.startDate && task.endDate && (
                  <p className="m-0 text-muted-foreground text-xs">
                    {shortDateFormatter.format(new Date(task.startDate))} -{" "}
                    {dateFormatter.format(new Date(task.endDate))}
                  </p>
                )}
              </KanbanCard>
            )}
          </KanbanCards>
        </KanbanBoard>
      )}
    </KanbanProvider>
  );
}
