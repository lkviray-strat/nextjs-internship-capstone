import { useComments } from "@/src/use/hooks/use-comments";
import { TRPCClientError } from "@trpc/client";
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

type DeleteCommentModalProps = {
  id: string;
};

export function DeleteCommentModal({ id }: DeleteCommentModalProps) {
  const params = useParams<{ teamId: string; projectId: string }>();
  const commentHooks = useComments();
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

  const handleSubmit = async (e: React.MouseEvent) => {
    try {
      if (!projectId || !teamId) return;

      const deleteValue = {
        id,
        teamId,
        projectId,
      };

      await commentHooks.deleteComment(deleteValue);
      handleClose(e);
      toast.success("Comment deleted successfully");
    } catch (error) {
      if (error instanceof Error || error instanceof TRPCClientError) {
        toast.error(`Failed to delete comment: ${error.message}`);
      } else {
        toast.error("Failed to delete column");
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
          Delete Comment
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <ClientOnly fallback={<Loader />}>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              comment and all associated data. Please proceed with caution.
            </DialogDescription>
          </ClientOnly>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row">
          <ClientOnly>
            <Button
              className="order-2 sm:order-1"
              variant="outline"
              disabled={commentHooks.isDeletingComment}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="order-1 sm:order-2"
              variant="destructive"
              disabled={commentHooks.isDeletingComment}
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
