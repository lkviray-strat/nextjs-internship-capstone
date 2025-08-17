"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Plus, Users } from "lucide-react";
import { useParams } from "next/navigation";
import type { Teams } from "../types";
import { SidebarMenuButton } from "./ui/sidebar";

type MainSidebarDropdownProps = {
  teams: Teams[];
  isOpen?: boolean;
};

export function MainSidebarDropdown({
  teams,
  isOpen,
}: MainSidebarDropdownProps) {
  const { teamId } = useParams();
  const selectedTeam = teams.find((team) => team.id === teamId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          variant="outline"
          className={`flex hover:bg-secondary hover:text-foreground items-center !text-[16px] !h-full !w-full -mt-1 border-2 
            ${isOpen ? "!p-4 !py-2 justify-start" : "justify-center"}
            `}
        >
          {isOpen ? (
            <>
              {selectedTeam ? selectedTeam.name : "Select Team"}
              <ChevronDown className="ml-auto" />
            </>
          ) : (
            <Users className="!size-[22px] ml-auto" />
          )}
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side={`${isOpen ? "bottom" : "right"}`}
        className={`${isOpen ? "w-[var(--radix-dropdown-menu-trigger-width)]" : "w-50 ml-3"}`}
      >
        <DropdownMenuLabel className="text-[12px] text-muted-foreground pl-2 pt-1 pb-2">
          Teams
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {teams.map((team) => (
            <DropdownMenuItem
              key={team.id}
              className={`${team.id === teamId ? "bg-accent" : ""}`}
            >
              <span>{team.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-primary">
          <div className="bg-primary/40 rounded-md p-1">
            <Plus className="size-4" />
          </div>
          <span>Create New Team</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
