import { useTeamMembers } from "@/src/use/hooks/use-team-members";
import { TRPCClientError } from "@trpc/client";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
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

type DeleteTeamMemberModalProps = {
  userId: string;
  teamId: string;
  isCurrentUser?: boolean;
};

export function DeleteTeamMemberModal({
  userId,
  teamId,
  isCurrentUser = false,
}: DeleteTeamMemberModalProps) {
  const router = useRouter();
  const teamMemberHooks = useTeamMembers();
  const [open, setOpen] = useState(false);

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
      if (!userId || !teamId) return;

      const deleteValue = {
        userId,
        teamId,
      };

      await teamMemberHooks.deleteTeamMember(deleteValue);
      handleClose(e);
      if (isCurrentUser) {
        toast.success("You left the team successfully");
        router.replace("/");
      } else {
        toast.success("Team member removed successfully");
      }
    } catch (error) {
      if (error instanceof Error || error instanceof TRPCClientError) {
        toast.error(`Failed to remove team member: ${error.message}`);
      } else {
        toast.error("Failed to remove team member");
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
          {isCurrentUser ? "Leave Team" : "Remove Member"}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <ClientOnly fallback={<Loader />}>
            <DialogDescription>
              This action cannot be undone. This will permanently remove this
              team member and all associated data. Please confirm if you want to
              proceed.
            </DialogDescription>
          </ClientOnly>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row">
          <ClientOnly>
            <Button
              className="order-2 sm:order-1"
              variant="outline"
              disabled={teamMemberHooks.isDeletingTeamMember}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="order-1 sm:order-2"
              variant="destructive"
              disabled={teamMemberHooks.isDeletingTeamMember}
              onClick={handleSubmit}
            >
              {isCurrentUser ? "Leave" : "Remove"}
            </Button>
          </ClientOnly>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
