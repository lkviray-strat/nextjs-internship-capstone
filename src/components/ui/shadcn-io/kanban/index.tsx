"use client";

import { Card } from "@/src/components/ui/card";
import { ScrollArea, ScrollBar } from "@/src/components/ui/scroll-area";
import { cn } from "@/src/lib/utils";
import type {
  Announcements,
  DndContextProps,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import tunnel from "tunnel-rat";
import { Button } from "../../button";

const t = tunnel();

export type { DragEndEvent } from "@dnd-kit/core";

type KanbanItemProps = {
  id: string;
  name: string;
  column: string;
} & Record<string, unknown>;

type KanbanColumnProps = {
  id: string;
  name: string;
  order: number;
} & Record<string, unknown>;

type KanbanContextProps<
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps,
> = {
  columns: C[];
  data: T[];
  activeCardId: string | null;
  activeColumnId: string | null;
};

const KanbanContext = createContext<KanbanContextProps>({
  columns: [],
  data: [],
  activeCardId: null,
  activeColumnId: null,
});

export type KanbanBoardProps = {
  id: string;
  children: ReactNode;
  className?: string;
  isColumnDraggable?: boolean;
};

export const KanbanBoard = ({
  id,
  children,
  className,
  isColumnDraggable = false,
}: KanbanBoardProps) => {
  const { setNodeRef, transition, transform, isDragging } = useSortable({
    id,
    disabled: !isColumnDraggable,
  });

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const ref = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    setDroppableRef(node);
  };

  return (
    <div
      className={cn(
        "flex h-full min-w-[300px] flex-col divide-y overflow-hidden rounded-md border-2 text-xs shadow-sm ring-2 transition-all",
        isOver ? "ring-primary" : "ring-transparent",
        isDragging && "opacity-50",
        className
      )}
      ref={ref}
      style={style}
      // REMOVE the drag attributes from here
    >
      {children}
    </div>
  );
};
export type KanbanCardProps<T extends KanbanItemProps = KanbanItemProps> = T & {
  children?: ReactNode;
  className?: string;
};

export const KanbanCard = <T extends KanbanItemProps = KanbanItemProps>({
  id,
  name,
  children,
  className,
}: KanbanCardProps<T>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id,
  });
  const { activeCardId } = useContext(KanbanContext) as KanbanContextProps;

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <div
        style={style}
        {...listeners}
        {...attributes}
        ref={setNodeRef}
      >
        <Card
          className={cn(
            "cursor-grab gap-4 rounded-md p-3 shadow-sm",
            isDragging && "pointer-events-none cursor-grabbing opacity-30",
            className
          )}
        >
          {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
        </Card>
      </div>
      {activeCardId === id && (
        <t.In>
          <Card
            className={cn(
              "cursor-grab gap-4 rounded-md p-3 shadow-sm ring-2 ring-primary",
              isDragging && "cursor-grabbing",
              className
            )}
          >
            {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
          </Card>
        </t.In>
      )}
    </>
  );
};

export type KanbanCardsProps<T extends KanbanItemProps = KanbanItemProps> =
  Omit<HTMLAttributes<HTMLDivElement>, "children" | "id"> & {
    children: (item: T) => ReactNode;
    id: string;
  };

export const KanbanCards = <T extends KanbanItemProps = KanbanItemProps>({
  children,
  className,
  ...props
}: KanbanCardsProps<T>) => {
  const { data } = useContext(KanbanContext) as KanbanContextProps<T>;
  const filteredData = data.filter((item) => item.column === props.id);
  const items = filteredData.map((item) => item.id);

  return (
    <ScrollArea className="overflow-hidden">
      <SortableContext items={items}>
        <div
          className={cn("flex flex-grow flex-col gap-2 p-2", className)}
          {...props}
        >
          {filteredData.map(children)}
        </div>
      </SortableContext>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export type KanbanHeaderProps = HTMLAttributes<HTMLDivElement> & {
  isColumnDraggable?: boolean;
  columnId?: string;
};

export const KanbanHeader = ({
  className,
  isColumnDraggable = false,
  columnId = "",
  ...props
}: KanbanHeaderProps) => {
  const { attributes, listeners } = useSortable({
    id: columnId,
    disabled: !isColumnDraggable,
  });

  return (
    <div
      className={cn(
        "m-0 flex items-center justify-between p-1 font-semibold text-sm",
        className
      )}
      {...props}
    >
      {props.children}
      {isColumnDraggable && (
        <Button
          {...attributes}
          {...listeners}
          variant="ghost"
          size="icon"
          className="cursor-grab !rounded-full !size-fit p-1.5 hover:bg-muted"
          style={{ touchAction: "none" }} // Prevent scrolling on touch devices
        >
          <GripVertical className="size-5 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
};

export type KanbanProviderProps<
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps,
> = Omit<DndContextProps, "children"> & {
  children: (column: C) => ReactNode;
  className?: string;
  columns: C[];
  data: T[];
  onDataChange?: (data: T[]) => void;
  onColumnReorder?: (columns: C[]) => void;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
};

export const KanbanProvider = <
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps,
>({
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
  onColumnReorder,
  className,
  columns,
  data,
  onDataChange,
  ...props
}: KanbanProviderProps<T, C>) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const card = data.find((item) => item.id === event.active.id);
    const column = columns.find((col) => col.id === event.active.id);

    if (card) {
      setActiveCardId(event.active.id as string);
    } else if (column) {
      setActiveColumnId(event.active.id as string);
    }

    onDragStart?.(event);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    // Handle card dragging over columns
    const activeItem = data.find((item) => item.id === active.id);
    if (activeItem) {
      const activeColumn = activeItem.column;
      const overColumn =
        data.find((item) => item.id === over.id)?.column ||
        columns.find((col) => col.id === over.id)?.id ||
        columns[0]?.id;

      if (activeColumn !== overColumn) {
        let newData = [...data];
        const activeIndex = newData.findIndex((item) => item.id === active.id);
        const overIndex = newData.findIndex((item) => item.id === over.id);

        newData[activeIndex].column = overColumn;
        newData = arrayMove(newData, activeIndex, overIndex);

        onDataChange?.(newData);
      }
    }

    onDragOver?.(event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Handle column reordering
    if (columns.find((col) => col.id === active.id) && over) {
      const activeIndex = columns.findIndex((col) => col.id === active.id);
      const overIndex = columns.findIndex((col) => col.id === over.id);

      if (activeIndex !== overIndex) {
        const newColumns = arrayMove(columns, activeIndex, overIndex);
        onColumnReorder?.(newColumns);
      }
    }
    // Handle card reordering
    else if (over && active.id !== over.id) {
      let newData = [...data];
      const oldIndex = newData.findIndex((item) => item.id === active.id);
      const newIndex = newData.findIndex((item) => item.id === over.id);

      newData = arrayMove(newData, oldIndex, newIndex);
      onDataChange?.(newData);
    }

    setActiveCardId(null);
    setActiveColumnId(null);
    onDragEnd?.(event);
  };

  const announcements: Announcements = {
    onDragStart({ active }) {
      const card = data.find((item) => item.id === active.id);
      const column = columns.find((col) => col.id === active.id);

      if (card) {
        return `Picked up the card "${card.name}" from the "${card.column}" column`;
      } else if (column) {
        return `Picked up the column "${column.name}"`;
      }
      return "";
    },
    onDragOver({ active, over }) {
      const card = data.find((item) => item.id === active.id);
      const column = columns.find((col) => col.id === active.id);

      if (card) {
        const newColumn = columns.find((col) => col.id === over?.id)?.name;
        return `Dragged the card "${card.name}" over the "${newColumn}" column`;
      } else if (column && over) {
        const targetColumn = columns.find((col) => col.id === over.id)?.name;
        return `Dragged the column "${column.name}" over the "${targetColumn}" column`;
      }
      return "";
    },
    onDragEnd({ active, over }) {
      const card = data.find((item) => item.id === active.id);
      const column = columns.find((col) => col.id === active.id);

      if (card && over) {
        const newColumn = columns.find((col) => col.id === over.id)?.name;
        return `Dropped the card "${card.name}" into the "${newColumn}" column`;
      } else if (column && over) {
        const targetColumn = columns.find((col) => col.id === over.id)?.name;
        return `Dropped the column "${column.name}" next to "${targetColumn}"`;
      }
      return "";
    },
    onDragCancel({ active }) {
      const card = data.find((item) => item.id === active.id);
      const column = columns.find((col) => col.id === active.id);

      if (card) {
        return `Cancelled dragging the card "${card.name}"`;
      } else if (column) {
        return `Cancelled dragging the column "${column.name}"`;
      }
      return "";
    },
  };

  const columnIds = columns.map((column) => column.id);

  return (
    <KanbanContext.Provider
      value={{ columns, data, activeCardId, activeColumnId }}
    >
      <DndContext
        accessibility={{ announcements }}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        sensors={sensors}
        {...props}
      >
        <SortableContext
          items={columnIds}
          strategy={verticalListSortingStrategy}
        >
          <div
            className={cn(
              "grid size-full grid-flow-col auto-cols[minmax(300px,1fr)] gap-4",
              className
            )}
          >
            {columns.map((column) => children(column))}
          </div>
        </SortableContext>
        {typeof window !== "undefined" &&
          createPortal(
            <DragOverlay>
              <t.Out />
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </KanbanContext.Provider>
  );
};
