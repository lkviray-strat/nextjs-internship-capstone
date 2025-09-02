"use client";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { MoreHorizontal, Pen } from "lucide-react";
import { DeleteCommentModal } from "../../modals/delete-comment-modal";

type TaskSheetCommentsDropdownProps = {
  id: string;
  setUpdateMode: (mode: boolean) => void;
};

export function TaskSheetCommentsDropdown({
  id,
  setUpdateMode,
}: TaskSheetCommentsDropdownProps) {
  const handlePropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleUpdateMode = () => {
    setUpdateMode(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePropagation}
          className="rounded-full !p-1.5 !h-fit -mt-1"
        >
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        onClick={handlePropagation}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleUpdateMode}>
            <Pen /> Edit Comment
          </DropdownMenuItem>
          <DeleteCommentModal id={id} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
