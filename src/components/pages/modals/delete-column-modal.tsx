import { useKanbanColumns } from "@/src/use/hooks/use-kanban-columns";
import { Trash } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { ClientOnly } from "../../client-only";
import { Loader } from "../../loader";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { DropdownMenuItem } from "../../ui/dropdown-menu";

type DeleteKanbanColumnModalProps = {
  id: string;
};

export function DeleteKanbanColumnModal({ id }: DeleteKanbanColumnModalProps) {
  const params = useParams();
  const columnHooks = useKanbanColumns();
  const [open, setOpen] = useState(false);

  const teamId = params.teamId!.toString();
  const projectId = params.projectId!.toString();

  const handlePropagation = (e: Event | React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleClose = (e: React.MouseEvent) => {
    handlePropagation(e);
    setOpen(false);
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    try {
      if (!projectId || !teamId) return;

      const deleteValue = {
        id,
        teamId,
        projectId,
      };

      await columnHooks.deleteKanbanColumn(deleteValue);
      handleClose(e);
      toast.success("Column deleted successfully");
    } catch (error) {
      toast.error("Failed to delete column");
      setOpen(false);
      console.log(error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <DropdownMenuItem
          variant="destructive"
          onSelect={handlePropagation}
        >
          <Trash />
          Delete Column
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <ClientOnly fallback={<Loader />}>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              column and all associated data. Please move any tasks to another
              column before deleting.
            </DialogDescription>
          </ClientOnly>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row">
          <ClientOnly>
            <Button
              className="order-2 sm:order-1"
              variant="outline"
              disabled={columnHooks.isDeletingKanbanColumn}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="order-1 sm:order-2"
              variant="destructive"
              disabled={columnHooks.isDeletingKanbanColumn}
              onClick={handleSubmit}
            >
              Delete
            </Button>
          </ClientOnly>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
