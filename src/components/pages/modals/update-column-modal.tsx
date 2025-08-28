"use client";

import type { KanbanColumns } from "@/src/types";
import { Pencil } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { DropdownMenuItem } from "../../ui/dropdown-menu";
import { KanbanColumnUpdateForm } from "../project/kanban-board/column-update-form";

type UpdateKanbanColumnModalProps = {
  column: KanbanColumns;
};

export function UpdateKanbanColumnModal({
  column,
}: UpdateKanbanColumnModalProps) {
  const [open, setOpen] = useState(false);

  const handlePropagation = (e: Event | React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={handlePropagation}>
          <Pencil />
          Edit Column
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-semibold">
            Edit Column
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <KanbanColumnUpdateForm
          setOpen={setOpen}
          column={column}
        />
      </DialogContent>
    </Dialog>
  );
}
