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
import { useCallback, useMemo } from "react";
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

  const columns = useMemo(() => {
    if (!kanbanBoard?.columns) return [];

    return kanbanBoard.columns
      .sort((a, b) => a.order - b.order)
      .map((column) => ({
        ...column,
        color: column.color || "#6B7280",
      }));
  }, [kanbanBoard?.columns]);

  const tasks = useMemo(() => {
    if (!kanbanBoard?.columns) return [];

    return kanbanBoard.columns.flatMap((column) =>
      column.tasks
        .sort((a, b) => a.order - b.order)
        .map((task) => ({
          ...task,
        }))
    );
  }, [kanbanBoard?.columns]);

  const handleColumnReorder = useCallback(
    (reorderedColumns: KanbanColumns[]) => {
      const updatedColumns = reorderedColumns.map((column, index) => ({
        ...column,
        order: index,
      }));

      updatedColumns.forEach((column) => {
        const current = { id: column.id, teamId, projectId };
        kanbanColumnHooks.updateKanbanColumn({
          ...current,
          order: column.order,
        });
      });
    },
    [kanbanColumnHooks, projectId, teamId]
  );

  const handleTaskReorder = useCallback(
    (updatedTasks: Tasks[]) => {
      const originalTasksMap = new Map(tasks.map((task) => [task.id, task]));

      updatedTasks.forEach((task, newIndex) => {
        const originalTask = originalTasksMap.get(task.id);

        if (!originalTask) return;

        const movedBetweenColumns =
          originalTask.kanbanColumnId !== task.kanbanColumnId;
        const movedWithinColumn = originalTask.order !== newIndex;

        if (movedBetweenColumns || movedWithinColumn) {
          tasksHooks.updateTask({
            id: Number(task.id),
            order: newIndex,
            kanbanColumnId: task.kanbanColumnId,
            teamId,
            projectId,
          });
        }
      });
    },
    [tasksHooks, projectId, teamId, tasks]
  );

  if (kanbanBoard?.columns.length === 0) return <KanbanColumnsEmpty />;
  return (
    <KanbanProvider
      columns={columns}
      data={tasks}
      onDataChange={handleTaskReorder}
      onColumnReorder={handleColumnReorder}
      className="h-[calc(100vh-15rem)] w-full overflow-x-auto pb-3  px-4 sm:px-6 lg:px-8"
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
                  style={{ backgroundColor: column.color }}
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
                    {shortDateFormatter.format(task.startDate)} -{" "}
                    {dateFormatter.format(task.endDate)}
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
