import { useFetch } from "@/src/use/hooks/use-fetch";
import { useTeamMembers } from "@/src/use/hooks/use-team-members";
import { useTeams } from "@/src/use/hooks/use-teams";
import { useUser } from "@clerk/nextjs";
import { TRPCClientError } from "@trpc/client";
import { Repeat } from "lucide-react";
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

type UpdateTeamTransferModalProps = {
  userId: string;
  teamId: string;
};

export function UpdateTeamTransferModal({
  userId,
  teamId,
}: UpdateTeamTransferModalProps) {
  const fetch = useFetch();
  const { user } = useUser();
  const teamHooks = useTeams();
  const teamMemberHooks = useTeamMembers();
  const [open, setOpen] = useState(false);
  const { data: highRole } = fetch.roles.useGetRoleByAscLimitOffset();
  const { data: lowRole } = fetch.roles.useGetRoleByDescLimitOffset(1, 1);

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
      if (!userId || !teamId || !highRole || !user) return;

      await teamMemberHooks.updateTeamMember({
        userId,
        teamId,
        roleId: highRole?.[0]?.id,
      });

      await teamHooks.updateTeam({
        id: teamId,
        leaderId: userId,
      });

      try {
        await teamMemberHooks.updateTeamMember({
          userId: user.id,
          teamId,
          roleId: lowRole?.[0]?.id,
        });
      } catch (error) {
        if (error instanceof Error || error instanceof TRPCClientError) {
          toast.error(`Failed to transfer ownership: ${error.message}`);
        } else {
          toast.error("Failed to transfer ownership");
        }

        await teamMemberHooks.updateTeamMember({
          userId,
          teamId,
          roleId: lowRole?.[0]?.id,
        });
        await teamHooks.updateTeam({
          id: teamId,
          leaderId: user.id,
        });

        setOpen(false);
        console.log(error);
      }

      handleClose(e);
      toast.success("Transferred ownership successfully");
    } catch (error) {
      if (error instanceof Error || error instanceof TRPCClientError) {
        toast.error(`Failed to transfer ownership: ${error.message}`);
      } else {
        toast.error("Failed to transfer ownership");
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
          variant="archive"
          onSelect={handlePropagation}
        >
          <Repeat />
          Transfer Ownership
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <ClientOnly fallback={<Loader />}>
            <DialogDescription>
              This action will transfer ownership of the team to this member.
              You will lose your current ownership privileges. Please confirm if
              you want to proceed.
            </DialogDescription>
          </ClientOnly>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row">
          <ClientOnly>
            <Button
              className="order-2 sm:order-1"
              variant="outline"
              disabled={teamMemberHooks.isUpdatingTeamMember}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="order-1 sm:order-2"
              variant="archiveDestructive"
              disabled={teamMemberHooks.isUpdatingTeamMember}
              onClick={handleSubmit}
            >
              Transfer
            </Button>
          </ClientOnly>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
