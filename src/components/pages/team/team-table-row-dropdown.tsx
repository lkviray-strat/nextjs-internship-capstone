"use client";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import type { RouterOutput } from "@/src/types";
import { useUser } from "@clerk/nextjs";
import { MoreHorizontal } from "lucide-react";
import { DeleteTeamMemberModal } from "../modals/delete-team-member-modal";
import { UpdateTeamPermissionModal } from "../modals/update-team-permission-modal";
import { UpdateTeamTransferModal } from "../modals/update-team-transfer-modal";

type TeamMembersFilterOutput =
  RouterOutput["teamMembers"]["getTeamMembersByFilter"];

type TeamTableRowDropdownProps = {
  member: TeamMembersFilterOutput["members"][number];
};

export function TeamTableRowDropdown({ member }: TeamTableRowDropdownProps) {
  const { user: currentUser } = useUser();
  const { user, role, member: teamMember } = member;

  if (!currentUser) return null;

  const handlePropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className=""
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        onClick={handlePropagation}
      >
        <DropdownMenuGroup>
          {currentUser.id === user.id ? (
            <DeleteTeamMemberModal
              userId={currentUser.id as string}
              teamId={teamMember.teamId as string}
              isCurrentUser
            />
          ) : (
            <>
              <UpdateTeamPermissionModal member={member} />
              <UpdateTeamTransferModal
                userId={teamMember.userId as string}
                teamId={teamMember.teamId as string}
              />
              <DeleteTeamMemberModal
                userId={teamMember.userId as string}
                teamId={teamMember.teamId as string}
              />
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
