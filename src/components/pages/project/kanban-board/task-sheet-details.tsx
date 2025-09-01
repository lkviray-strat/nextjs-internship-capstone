import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { TASK_PRIORITY_TW_COLORS } from "@/src/lib/db/enums";
import {
  dateFormatter,
  getUserInitials,
  snakeToTitleCase,
  type WithRelations,
} from "@/src/lib/utils";
import type { Tasks, User } from "@/src/types";
import {
  Calendar,
  CalendarCheck,
  CheckCircle,
  Tag,
  Users,
  type LucideIcon,
} from "lucide-react";

type TaskSheetProps = {
  task: WithRelations<Tasks, { assignee: User | null }>;
  column: {
    name: string;
    color: string;
  };
};

export function TaskSheetDetails({ task, column }: TaskSheetProps) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-5 px-5 sm:px-10 w-fit items-center text-[15px]">
      <TaskSheetItem
        label="Date Created"
        labelIcon={Calendar}
      >
        {task.startDate
          ? dateFormatter.format(new Date(task.createdAt))
          : "Unknown"}
      </TaskSheetItem>

      <TaskSheetItem
        label="Assignee"
        labelIcon={Users}
      >
        {task.assignee ? (
          <div className="flex gap-2 items-center">
            <Avatar className="size-6">
              <AvatarImage
                src={task.assignee.profileImageUrl as string}
                alt={`${task.assignee.firstName}'s Profile Picture`}
                content={`${task.assignee.firstName} ${task.assignee.lastName}`}
              />
              {task.assignee.firstName && task.assignee.lastName && (
                <AvatarFallback className="!text-[12px]">
                  {getUserInitials(
                    task.assignee.firstName,
                    task.assignee.lastName
                  )}
                </AvatarFallback>
              )}
            </Avatar>
            {task.assignee.firstName} {task.assignee.lastName}
          </div>
        ) : (
          <span className="text-[15px]">Unassigned</span>
        )}
      </TaskSheetItem>

      <TaskSheetItem
        label="Status"
        labelIcon={CheckCircle}
      >
        <div className="flex text-[15px] gap-2 items-center">
          <div
            className="size-3.5 rounded-full border-1 border-black"
            style={{ backgroundColor: column.color || "#FFFFFF" }}
          />
          <span>{column.name}</span>
        </div>
      </TaskSheetItem>

      <TaskSheetItem
        label="Due Date"
        labelIcon={CalendarCheck}
      >
        {task.endDate
          ? dateFormatter.format(new Date(task.endDate))
          : "Unknown"}
      </TaskSheetItem>

      <TaskSheetItem
        label="Priority"
        labelIcon={Tag}
      >
        {task.priority ? (
          <div
            className={`flex py-0.5 px-3 rounded-lg border-1 w-fit ${TASK_PRIORITY_TW_COLORS[task.priority]}`}
          >
            <span>{snakeToTitleCase(task.priority)}</span>
          </div>
        ) : (
          <span className="text-[14px]">Unassigned</span>
        )}
      </TaskSheetItem>
    </div>
  );
}

type TaskSheetItemProps = {
  label: string;
  labelIcon: LucideIcon;
  children: React.ReactNode;
};

function TaskSheetItem({
  label,
  labelIcon: LabelIcon,
  children,
}: TaskSheetItemProps) {
  return (
    <>
      <div className="flex gap-3 text-muted-foreground items-center text-[15px]">
        <LabelIcon className="size-5" /> {label}
      </div>
      {children}
    </>
  );
}
