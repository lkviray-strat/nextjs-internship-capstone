"use client";

import type { KanbanColumns } from "@/src/types";
import { Plus } from "lucide-react";
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
import { TaskCreateForm } from "../project/kanban-board/task-create-form";

type CreateTaskModalProps = {
  column: KanbanColumns;
};
export function CreateTaskModal({ column }: CreateTaskModalProps) {
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
          <Plus />
          New Task
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px] overflow-y-scroll max-h-[calc(100vh-100px)]">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-semibold">
            Create New Task
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <TaskCreateForm
          setOpen={setOpen}
          column={column}
        />
      </DialogContent>
    </Dialog>
  );
}
