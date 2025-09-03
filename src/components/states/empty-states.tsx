import { Columns, FolderPlus, Users2 } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";

export function DashboardRecentProjectsEmpty() {
  return (
    <>
      <h3 className="text-lg font-semibold">Recent Projects</h3>
      <div className="text-muted-foreground flex items-center justify-center h-full py-6">
        You have no recent projects
      </div>
    </>
  );
}

export function ProjectGridEmpty() {
  return (
    <div className="col-span-3 flex text-center text-muted-foreground  flex-col items-center justify-center mt-28 sm:mt-0 sm:min-h-[calc(100vh-25rem)] py-3 gap-1">
      <div className="w-[300px] sm:w-[350px] flex flex-col h-full justify-center items-center">
        <FolderPlus
          strokeWidth={1}
          className="size-25 sm:size-30"
        />
        <h1 className="text-[18px] sm:text-[20px] font-semibold mb-3 ">
          No Projects Found
        </h1>
        <p className="text-[12px] sm:text-[14px]">
          Start organizing your tasks and collaborate with your team by creating
          a new project.
        </p>
      </div>
    </div>
  );
}

export function KanbanColumnsEmpty() {
  return (
    <div className="col-span-3 flex text-center text-muted-foreground  flex-col items-center justify-center mt-28 sm:mt-0 sm:min-h-[calc(100vh-25rem)] py-3 gap-1">
      <div className="w-[300px] sm:w-[350px] flex flex-col h-full justify-center items-center">
        <Columns
          strokeWidth={1}
          className="size-25 sm:size-30"
        />
        <h1 className="text-[18px] sm:text-[20px] font-semibold mb-3 ">
          No Columns Found
        </h1>
        <p className="text-[12px] sm:text-[14px]">
          Add a new column to structure your workflow — create stages like To
          Do, In Progress, and Done, then move tasks between them.
        </p>
      </div>
    </div>
  );
}

export function CommentsEmpty() {
  return (
    <div className="flex mt-8 text-center flex-col items-center justify-center gap-1">
      <h1 className="text-[18px] sm:text-[20px] font-semibold text-muted-foreground ">
        No Comments Found
      </h1>
      <p className="text-[12px] sm:text-[14px] mb-7 text-muted-foreground">
        Start the conversation by adding a comment.
      </p>
    </div>
  );
}

export function TeamMemberSearchEmpty() {
  return (
    <div className="flex h-full w-[230px] m-auto text-center flex-col items-center justify-center gap-1">
      <Users2
        className="size-12 sm:size-20"
        strokeWidth={1}
      />
      <h1 className="text-[18px] sm:text-[20px] font-semibold text-muted-foreground ">
        No Users Found
      </h1>
      <p className="text-[12px] sm:text-[14px] mb-7 text-muted-foreground">
        Search for users by name or email to add them to your team.
      </p>
    </div>
  );
}

export function TeamTableEmpty() {
  return (
    <TableRow>
      <TableCell colSpan={5}>
        <div className="flex h-full w-[230px] mt-18 m-auto text-center flex-col items-center justify-center gap-1">
          <Users2
            className="size-12 sm:size-20"
            strokeWidth={1}
          />
          <h1 className="text-[18px] sm:text-[20px] font-semibold text-muted-foreground ">
            No Team Members
          </h1>
          <p className="text-[12px] sm:text-[14px] mb-7 text-muted-foreground">
            Adjust your search to find users by name or email.
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}
