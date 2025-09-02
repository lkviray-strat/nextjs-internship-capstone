import { Viewer } from "@/src/components/blocks/editor-00/viewer";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Separator } from "@/src/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import {
  getTimeLastUpdated,
  getUserInitials,
  type WithRelations,
} from "@/src/lib/utils";
import type { Tasks, User } from "@/src/types";
import { useFetch } from "@/src/use/hooks/use-fetch";
import type { SerializedEditorState } from "lexical";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TaskSheetComments } from "./task-sheet-comments";
import { TaskSheetDetails } from "./task-sheet-details";

type TaskSheetProps = {
  task: WithRelations<Tasks, { assignee: User | null }>;
  column: {
    name: string;
    color: string;
  };
};

export function TaskSheet({ task, column }: TaskSheetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fetch = useFetch();

  const open = !!task;

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("task");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const { data: taskCreatedBy } = fetch.users.useGetUserById(
    task.createdById as string
  );

  if (!task && !taskCreatedBy) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => isOpen || handleClose()}
    >
      <SheetTrigger asChild></SheetTrigger>
      <SheetContent className="py-5 sm:py-7 w-full sm:max-w-3/4 md:max-w-1/2 overflow-y-auto">
        <SheetHeader className="px-4 sm:px-9">
          <SheetTitle className="flex flex-col gap-1">
            <span className="text-[40px] font-semibold">
              {task.title}{" "}
              <span className="text-muted-foreground ml-1">
                #{task.taskNumber}
              </span>
            </span>
            <div className="flex flex-wrap items-center gap-1 text-[15px]">
              <span className="inline-flex gap-1 items-center">
                <Avatar className="size-6 mr-1">
                  <AvatarImage
                    src={taskCreatedBy[0]?.profileImageUrl as string}
                    alt={`${taskCreatedBy[0]?.firstName}'s Profile Picture`}
                    content={`${taskCreatedBy[0]?.firstName} ${taskCreatedBy[0]?.lastName}`}
                  />
                  {taskCreatedBy[0]?.firstName &&
                    taskCreatedBy[0]?.lastName && (
                      <AvatarFallback className="!text-[12px]">
                        {getUserInitials(
                          taskCreatedBy[0]?.firstName,
                          taskCreatedBy[0]?.lastName
                        )}
                      </AvatarFallback>
                    )}
                </Avatar>
              </span>
              {taskCreatedBy[0]?.firstName} {taskCreatedBy[0]?.lastName}
              <span className="text-muted-foreground">&nbsp;•&nbsp;</span>
              <span className="text-muted-foreground">
                {getTimeLastUpdated(task.updatedAt)}
              </span>
            </div>
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-8">
          <TaskSheetDetails
            task={task}
            column={column}
          />
          <Separator />
          <div className="flex flex-col gap-4 px-5 sm:px-10">
            <span className="text-[24px] font-semibold">Description</span>
            <div className="rounded-md w-full -mt-2">
              <Viewer
                editorSerializedState={
                  task.description as SerializedEditorState
                }
              />
            </div>
          </div>
          <Separator />
          <TaskSheetComments taskId={task.id} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
