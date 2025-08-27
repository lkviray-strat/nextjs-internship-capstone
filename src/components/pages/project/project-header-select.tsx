import type { KanbanBoards, Projects } from "@/src/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

type ProjectHeaderSelectProps = {
  kanbanBoards: KanbanBoards[];
  project: Projects;
};

export function ProjectHeaderSelect({
  kanbanBoards,
  project,
}: ProjectHeaderSelectProps) {
  const router = useRouter();
  const [value, setValue] = useState<string | undefined>(
    project.defaultBoardId ?? undefined
  );

  const handleValueChange = (newValue: string) => {
    setValue((prev) => (prev === newValue ? undefined : newValue));
    if (value === project.defaultBoardId) return;
    router.push(`?board=${newValue}`);
  };

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-full sm:w-[200px] justify-center sm:justify-between">
        <SelectValue placeholder="Select a board" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Kanban Boards</SelectLabel>
          {kanbanBoards.map((board) => (
            <SelectItem
              key={board.id}
              value={board.id}
            >
              {board.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
