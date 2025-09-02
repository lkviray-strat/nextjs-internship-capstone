import { useBoardStore } from "@/src/stores/board";
import type { KanbanBoards, Projects } from "@/src/types";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
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
  const searchParams = useSearchParams();
  const { currentBoardIds, setCurrentBoardId } = useBoardStore();

  const boardParam = searchParams.get("board");
  const currentBoardId = currentBoardIds[project.id] ?? project.defaultBoardId;

  // Set initial board
  useEffect(() => {
    if (boardParam) {
      setCurrentBoardId(project.id, boardParam);
    } else if (!currentBoardIds[project.id]) {
      setCurrentBoardId(project.id, project.defaultBoardId as string);
    }
  }, [
    boardParam,
    currentBoardIds,
    project.id,
    project.defaultBoardId,
    setCurrentBoardId,
  ]);

  const handleValueChange = (newValue: string) => {
    setCurrentBoardId(project.id, newValue);
    router.push(
      newValue !== project.defaultBoardId ? `?board=${newValue}` : `?`
    );
  };

  return (
    <>
      {currentBoardId ? (
        <Select
          value={currentBoardId}
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
      ) : (
        <Loader2 className="animate-spin mt-1" />
      )}
    </>
  );
}
