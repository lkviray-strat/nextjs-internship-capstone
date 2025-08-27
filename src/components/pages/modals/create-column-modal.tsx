"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { KanbanColumnCreateForm } from "../project/kanban-board/column-create-form";

export function CreateColumnModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus />
          New Column
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-semibold">
            Create New Column
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <KanbanColumnCreateForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
