import { getUserInitials, snakeToTitleCase } from "@/src/lib/utils";
import type { RouterOutput } from "@/src/types";
import { useFetch } from "@/src/use/hooks/use-fetch";
import { useTeamMembers } from "@/src/use/hooks/use-team-members";
import { TRPCClientError } from "@trpc/client";
import { ShieldCheck } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { ClientOnly } from "../../client-only";
import { Loader } from "../../loader";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

type TeamMembersFilterOutput =
  RouterOutput["teamMembers"]["getTeamMembersByFilter"];

type UpdateTeamPermissionModalProps = {
  member: TeamMembersFilterOutput["members"][number];
};

export function UpdateTeamPermissionModal({
  member,
}: UpdateTeamPermissionModalProps) {
  const fetch = useFetch();
  const teamMemberHooks = useTeamMembers();
  const { user, role, member: teamMember } = member;
  const [open, setOpen] = useState(false);
  const { data: roles } = fetch.roles.useGetAllRoles();
  const [newRole, setNewRole] = useState<string>(role?.id ?? "");

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
      if (!member || !roles || !user) return;

      await teamMemberHooks.updateTeamMember({
        userId: teamMember.userId as string,
        teamId: teamMember.teamId as string,
        roleId: newRole,
      });

      handleClose(e);
      toast.success("Permission updated successfully");
    } catch (error) {
      if (error instanceof Error || error instanceof TRPCClientError) {
        toast.error(`Failed to update permission: ${error.message}`);
      } else {
        toast.error("Failed to update permission");
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
        <DropdownMenuItem onSelect={handlePropagation}>
          <ShieldCheck />
          Update Permission
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Permission</DialogTitle>
          <ClientOnly fallback={<Loader />}>
            <DialogDescription>
              This action will update the permission for this team member.
              Please confirm if you want to proceed with changing their role.
            </DialogDescription>
          </ClientOnly>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-5 justify-between items-center">
          <div className="flex gap-3 items-center">
            <Avatar className="size-10">
              <AvatarImage
                src={user.profileImageUrl as string}
                alt={`${user.firstName}`}
              />
              <AvatarFallback content={user.email}>
                {getUserInitials(user.firstName ?? "", user.lastName ?? "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col line-clamp-1">
              <span>
                {user.firstName} {user.lastName}
              </span>
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>

          <Select
            value={newRole}
            onValueChange={setNewRole}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {roles
                  ?.filter((role) => role.priority !== 0)
                  .map((role) => (
                    <SelectItem
                      key={role.id}
                      value={role.id}
                    >
                      {snakeToTitleCase(role.name)}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

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
              variant="default"
              disabled={teamMemberHooks.isUpdatingTeamMember}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </ClientOnly>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
