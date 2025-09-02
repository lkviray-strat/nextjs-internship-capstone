import { useTasks } from "@/src/use/hooks/use-tasks";
import { TRPCClientError } from "@trpc/client";
import { Trash } from "lucide-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
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

type DeleteTaskModalProps = {
  id: number;
};

export function DeleteTaskModal({ id }: DeleteTaskModalProps) {
  const params = useParams<{ teamId: string; projectId: string }>();
  const searchParams = useSearchParams();
  const taskHooks = useTasks();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const teamId = params.teamId;
  const projectId = params.projectId;

  const handlePropagation = (e: Event | React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleClose = (e: React.MouseEvent) => {
    handlePropagation(e);
    setOpen(false);
  };

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl);
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    try {
      if (!projectId || !teamId) return;

      const deleteValue = {
        id,
        teamId,
        projectId,
      };

      await taskHooks.deleteTask(deleteValue);
      removeParam("task");
      handleClose(e);
      toast.success("Task deleted successfully");
    } catch (error) {
      if (error instanceof Error || error instanceof TRPCClientError) {
        toast.error(`Failed to delete task: ${error.message}`);
      } else {
        toast.error("Failed to delete task");
      }
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
          Delete Task
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <ClientOnly fallback={<Loader />}>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              task and all associated data. Please confirm if you want to
              proceed.
            </DialogDescription>
          </ClientOnly>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row">
          <ClientOnly>
            <Button
              className="order-2 sm:order-1"
              variant="outline"
              disabled={taskHooks.isDeletingTask}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="order-1 sm:order-2"
              variant="destructive"
              disabled={taskHooks.isDeletingTask}
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
