"use client";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import type { Tasks } from "@/src/types";
import { MoreHorizontal } from "lucide-react";
import { UpdateTaskModal } from "../../modals/update-task-modal";

type TaskSheetDropdownProps = {
  task: Tasks;
};

export function TaskSheetDropdown({ task }: TaskSheetDropdownProps) {
  const handlePropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePropagation}
          className="rounded-full mt-2"
        >
          <MoreHorizontal className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        onClick={handlePropagation}
      >
        <DropdownMenuGroup>
          <UpdateTaskModal task={task} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
