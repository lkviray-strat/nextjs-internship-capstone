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
import { useParams, useRouter } from "next/navigation";
import type { Teams } from "../../../types";
import { buttonVariants } from "../../ui/button";
import { SidebarMenuButton } from "../../ui/sidebar";

type MainSidebarDropdownProps = {
  teams: Teams[];
  isOpen?: boolean;
};

export function MainSidebarDropdown({
  teams,
  isOpen,
}: MainSidebarDropdownProps) {
  const { teamId } = useParams();
  const router = useRouter();

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
        <DropdownMenuLabel className="!px-3.5 text-[12px] text-muted-foreground pl-2 pt-1 pb-2">
          Teams
        </DropdownMenuLabel>
        <DropdownMenuGroup className="space-y-1">
          {teams.map((team) => (
            <DropdownMenuItem
              key={team.id}
              className={`${team.id === teamId ? "bg-accent" : ""} !px-3.5 line-clamp-1 text-[16px]`}
              onSelect={() => {
                router.push(`/${team.id}/dashboard`);
              }}
            >
              {team.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => {
            router.push(`/assemble`);
          }}
          className={`${buttonVariants({ variant: "inverseDefault" })} justify-start w-full`}
        >
          <div className="bg-primary/40 hover:bg-primary/50 rounded-md p-1">
            <Plus className="size-4" />
          </div>
          <span className="line-clamp-1 text-[16px] h-full items-center -mb-0.5">
            New Team
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
