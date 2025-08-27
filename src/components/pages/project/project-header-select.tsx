import { useBoardStore } from "@/src/stores/board";
import type { KanbanBoards, Projects } from "@/src/types";
import { useRouter } from "next/navigation";
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
  const { currentBoardId, setCurrentBoardId } = useBoardStore();

  const value = currentBoardId ?? project.defaultBoardId ?? undefined;

  const handleValueChange = (newValue: string) => {
    setCurrentBoardId(newValue);
    if (newValue !== project.defaultBoardId) {
      router.push(`?board=${newValue}`);
    } else {
      router.push(`?`);
    }
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
