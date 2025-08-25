"use client";

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
import { faker } from "@faker-js/faker";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { KanbanColumns } from "../../../../types";
import { useFetch } from "../../../../use/hooks/use-fetch";
import { useKanbanColumns } from "../../../../use/hooks/use-kanban-columns";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const columns = [
  { id: faker.string.uuid(), name: "Planned", color: "#6B7280" },
  { id: faker.string.uuid(), name: "In Progress", color: "#F59E0B" },
  { id: faker.string.uuid(), name: "Done", color: "#10B981" },
];

const users = Array.from({ length: 4 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    image: faker.image.avatar(),
  }));

const exampleFeatures = Array.from({ length: 20 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: capitalize(faker.company.buzzPhrase()),
    startAt: faker.date.past({ years: 0.5, refDate: new Date() }),
    endAt: faker.date.future({ years: 0.5, refDate: new Date() }),
    column: faker.helpers.arrayElement(columns).id,
    owner: faker.helpers.arrayElement(users),
  }));

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
  const params = useParams();
  const searchParams = useSearchParams();

  const teamId = params.teamId!.toString();
  const projectId = params.projectId!.toString();

  const kanbanColumnHooks = useKanbanColumns();
  const { data: project } = fetch.projects.useGetMyCurrentProject(
    projectId,
    teamId
  );

  const board =
    searchParams.get("board")?.toString() ?? project[0].defaultBoardId ?? "";

  const { data: kanbanBoard } = fetch.kanbanBoards.useGetMyKanbanBoards({
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

  const [features, setFeatures] = useState(exampleFeatures);

  return (
    <KanbanProvider
      columns={columns}
      data={features}
      onDataChange={setFeatures}
      onColumnReorder={handleColumnReorder}
      className="h-[calc(100vh-14rem)] w-full overflow-x-auto pb-3 scroll: "
    >
      {(column) => (
        <KanbanBoard
          id={column.id}
          key={column.id}
          isColumnDraggable
        >
          <KanbanHeader
            className="p-4"
            columnId={column.id}
            isColumnDraggable
          >
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: column.color }}
              />
              <span>{column.name}</span>
            </div>
          </KanbanHeader>
          <KanbanCards id={column.id}>
            {(feature: (typeof features)[number]) => (
              <KanbanCard
                column={column.id}
                id={feature.id}
                key={feature.id}
                name={feature.name}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="m-0 flex-1 font-medium text-sm">
                      {feature.name}
                    </p>
                  </div>
                  {feature.owner && (
                    <Avatar className="h-4 w-4 shrink-0">
                      <AvatarImage src={feature.owner.image} />
                      <AvatarFallback>
                        {feature.owner.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <p className="m-0 text-muted-foreground text-xs">
                  {shortDateFormatter.format(feature.startAt)} -{" "}
                  {dateFormatter.format(feature.endAt)}
                </p>
              </KanbanCard>
            )}
          </KanbanCards>
        </KanbanBoard>
      )}
    </KanbanProvider>
  );
}
