"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

type ProjectCardDropdownProps = {
  projectId: string;
};

export function ProjectCardDropdown({ projectId }: ProjectCardDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`projects/${projectId}/settings`}>
              <Edit />
              Edit Project
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-orange-400">
            <Trash className="text-orange-400" />
            Archive Project
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
