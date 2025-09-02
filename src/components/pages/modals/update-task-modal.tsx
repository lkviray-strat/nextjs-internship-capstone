"use client";

import type { Tasks } from "@/src/types";
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
import { TaskUpdateForm } from "../project/kanban-board/task-update-form";

type UpdateTaskModalProps = {
  task: Tasks;
};

export function UpdateTaskModal({ task }: UpdateTaskModalProps) {
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
          Edit Task
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px] overflow-y-scroll max-h-[calc(100vh-100px)]">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-semibold">
            Edit Task
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <TaskUpdateForm
          task={task}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
