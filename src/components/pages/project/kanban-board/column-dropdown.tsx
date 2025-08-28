"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import type { KanbanColumns } from "@/src/types";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { CreateTaskModal } from "../../modals/create-task-modal";
import { DeleteKanbanColumnModal } from "../../modals/delete-column-modal";
import { UpdateKanbanColumnModal } from "../../modals/update-column-modal";

type KanbanColumnDropdownProps = {
  column: KanbanColumns;
};

export function KanbanColumnDropdown({ column }: KanbanColumnDropdownProps) {
  const handlePropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="!rounded-full !size-fit p-1.5 hover:bg-muted"
          onClick={handlePropagation}
        >
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
        onClick={handlePropagation}
        className="mt-2"
      >
        <DropdownMenuGroup>
          <CreateTaskModal column={column} />
          <UpdateKanbanColumnModal column={column} />
          <DeleteKanbanColumnModal id={column.id} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
