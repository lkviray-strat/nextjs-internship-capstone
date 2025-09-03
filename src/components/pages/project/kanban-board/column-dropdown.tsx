"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import type { KanbanColumns } from "@/src/types";
import { MoreHorizontal } from "lucide-react";

import { PermissionGate } from "@/src/components/permission-gate";
import { Button } from "@/src/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { CreateTaskModal } from "../../modals/create-task-modal";
import { DeleteKanbanColumnModal } from "../../modals/delete-column-modal";
import { UpdateKanbanColumnModal } from "../../modals/update-column-modal";

type KanbanColumnDropdownProps = {
  column: KanbanColumns;
};

export function KanbanColumnDropdown({ column }: KanbanColumnDropdownProps) {
  const { user } = useUser();
  const { teamId } = useParams<{ teamId: string }>();
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
          <PermissionGate
            userId={user?.id ?? ""}
            teamId={teamId ?? ""}
            permissions={["update:kanban_column"]}
          >
            <UpdateKanbanColumnModal column={column} />
          </PermissionGate>

          <PermissionGate
            userId={user?.id ?? ""}
            teamId={teamId ?? ""}
            permissions={["delete:kanban_column"]}
          >
            <DeleteKanbanColumnModal id={column.id} />
          </PermissionGate>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
