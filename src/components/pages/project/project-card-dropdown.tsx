"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

export function ProjectCardDropdown() {
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
          <DropdownMenuItem>
            <Edit />
            Edit Project
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            <Trash className="text-red-600" />
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
