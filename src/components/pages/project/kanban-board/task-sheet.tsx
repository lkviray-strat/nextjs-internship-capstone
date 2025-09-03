import { Viewer } from "@/src/components/blocks/editor-00/viewer";
import { PermissionGate } from "@/src/components/permission-gate";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import {
  getTimeCreated,
  getUserInitials,
  sanitizeSerializedEditorState,
  type WithRelations,
} from "@/src/lib/utils";
import type { Tasks, User } from "@/src/types";
import { useFetch } from "@/src/use/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import type { SerializedEditorState } from "lexical";
import { X } from "lucide-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { TaskSheetComments } from "./task-sheet-comments";
import { TaskSheetDetails } from "./task-sheet-details";
import { TaskSheetDropdown } from "./task-sheet-dropdown";

type TaskSheetProps = {
  task: WithRelations<Tasks, { assignee: User | null }>;
  column: {
    name: string;
    color: string;
  };
};

export function TaskSheet({ task, column }: TaskSheetProps) {
  const { user } = useUser();
  const { teamId } = useParams<{ teamId: string }>();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fetch = useFetch();

  const open = !!task;
  const sanitized = sanitizeSerializedEditorState(
    task.description as SerializedEditorState
  );
  const isEditorEmpty = sanitized.root.children.length === 0;

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
      <SheetContent className="py-5 sm:pb-7 w-full sm:max-w-3/4 md:max-w-1/2 overflow-y-auto">
        <SheetHeader className="flex flex-col sm:flex-row px-4 sm:px-9 w-full items-start justify-between">
          <SheetTitle className="flex flex-col gap-1 order-2 sm:order-1 w-full">
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
                  />
                  {taskCreatedBy[0]?.firstName &&
                    taskCreatedBy[0]?.lastName && (
                      <AvatarFallback
                        className="!text-[12px]"
                        content={taskCreatedBy[0]?.email}
                      >
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
                {getTimeCreated(task.createdAt)}
              </span>
            </div>
          </SheetTitle>
          <SheetDescription></SheetDescription>
          <div className="flex gap-1 sm:gap-2 order-1 sm:order-2 mb-3 sm:mb-0">
            <PermissionGate
              userId={user?.id ?? ""}
              teamId={teamId ?? ""}
              permissions={["update:task"]}
              ownerIds={[task.createdById ?? "", task.assigneeId ?? ""]}
            >
              <TaskSheetDropdown task={task} />
            </PermissionGate>
            <SheetClose asChild>
              <Button
                variant="ghostDestructive"
                size="icon"
                className="rounded-full mt-2"
              >
                <X className="size-5" />
              </Button>
            </SheetClose>
          </div>
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
              {isEditorEmpty ? (
                <p className="text-muted-foreground italic">
                  No description available
                </p>
              ) : (
                <Viewer
                  key={JSON.stringify(task.description)}
                  editorSerializedState={
                    task.description as SerializedEditorState
                  }
                />
              )}
            </div>
          </div>
          <Separator />
          <TaskSheetComments taskId={task.id} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
