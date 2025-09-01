import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { KanbanCard } from "@/src/components/ui/shadcn-io/kanban";
import {
  dateFormatter,
  shortDateFormatter,
  type MakeSomeRequired,
  type WithRelations,
} from "@/src/lib/utils";
import type { Tasks, User } from "@/src/types";
import { useRouter, useSearchParams } from "next/navigation";

type TaskCardProps = {
  task: MakeSomeRequired<
    WithRelations<Tasks, { assignee: User }>,
    "id" | "kanbanColumnId"
  >;
  columnId: string;
};

export function TaskCard({ task, columnId }: TaskCardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleOpen = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("task", task.id.toString());
    console.log(params.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <KanbanCard
      id={task.id}
      title={task.title}
      kanbanColumnId={columnId}
      onClick={handleOpen}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <p className="m-0 flex-1 font-semibold text-[16px] line-clamp-1">
            {task.title}
          </p>
        </div>
        {task.assignee && (
          <Avatar
            className="h-6 w-6 shrink-0"
            content={`${task.assignee.firstName} ${task.assignee.lastName}`}
          >
            <AvatarImage src={task.assignee.profileImageUrl as string} />
            <AvatarFallback>
              {`${task.assignee.firstName}${task.assignee.lastName}`}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      {task.startDate && task.endDate && (
        <p className="m-0 text-muted-foreground text-xs">
          {shortDateFormatter.format(new Date(task.startDate))} -{" "}
          {dateFormatter.format(new Date(task.endDate))}
        </p>
      )}
    </KanbanCard>
  );
}
