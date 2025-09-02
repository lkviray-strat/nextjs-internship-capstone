"use client";

import { KanbanColumnsEmpty } from "@/src/components/states/empty-states";
import {
  KanbanBoard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/src/components/ui/shadcn-io/kanban";
import { useUIStore } from "@/src/stores/ui-store";
import { useKanbanSubscription } from "@/src/use/hooks/use-subscribe";
import { useTasks } from "@/src/use/hooks/use-tasks";
import { Loader2 } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { KanbanColumns, Tasks } from "../../../../types";
import { useFetch } from "../../../../use/hooks/use-fetch";
import { useKanbanColumns } from "../../../../use/hooks/use-kanban-columns";
import { KanbanColumnDropdown } from "./column-dropdown";
import { TaskCard } from "./task-card";
import { TaskSheet } from "./task-sheet";

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
  const taskId = searchParams.get("task")?.toString() ?? undefined;

  const { data: kanbanBoard } = fetch.kanbanBoards.useGetMyKanbanBoardByFilter({
    projectId,
    board,
  });

  const [selectedTaskId, setSelectedTaskId] = useState(taskId);

  const [optimisticColumns, setOptimisticColumns] = useState<KanbanColumns[]>(
    []
  );
  const [optimisticTasks, setOptimisticTasks] = useState<Tasks[]>([]);

  useEffect(() => {
    setSelectedTaskId(taskId);
  }, [taskId]);

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
  }, [kanbanBoard]);

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
        setOptimisticColumns(kanbanBoard?.columns || []);
        console.error("Failed to update column order:", error);
      }
    },
    [kanbanColumnHooks, projectId, teamId, kanbanBoard?.columns]
  );

  const handleTaskReorder = useCallback(
    async (updatedTasks: Tasks[]) => {
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
        setOptimisticTasks(tasks);
        toast.error("Failed to update task");
        console.log("Failed to update task order:", error);
      }
    },
    [tasks, tasksHooks, teamId, projectId, board]
  );

  if (kanbanBoard?.columns.length === 0) return <KanbanColumnsEmpty />;

  const task = kanbanBoard?.columns
    .map((col) => col.tasks)
    .flat()
    .find((t) => t.id.toString() === selectedTaskId);
  const column = kanbanBoard?.columns.find(
    (col) => col.id === task?.kanbanColumnId
  );

  const isArchived = project?.[0]?.status === "archived";

  return (
    <div className="relative">
      {isArchived && (
        <div className="absolute z-10 inset-0 bg-black/70 flex items-center justify-center cursor-not-allowed text-xl font-semibold text-gray-600 pointer-events-auto"></div>
      )}
      <KanbanProvider
        columns={columns}
        data={tasks}
        onDataChange={handleTaskReorder}
        onColumnReorder={handleColumnReorder}
        className="h-[calc(100vh-15rem)] -z-[10] w-full overflow-x-auto pb-3 px-4 sm:px-6 lg:px-8"
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
                    className="size-3.5 rounded-full border-1 border-black"
                    style={{ backgroundColor: column.color || "#FFFFFF" }}
                  />
                  <span>{column.name}</span>
                </div>
                {!isEditingMode && <KanbanColumnDropdown column={column} />}
              </div>
            </KanbanHeader>
            <KanbanCards id={column.id}>
              {(task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  columnId={column.id}
                />
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
      {task && column && (
        <Suspense fallback={<Loader2 className="absolute inset-0 m-auto" />}>
          <TaskSheet
            task={task}
            column={{ name: column.name, color: column.color || "#FFFFFF" }}
          />
        </Suspense>
      )}
    </div>
  );
}
