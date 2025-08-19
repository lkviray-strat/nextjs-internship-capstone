import { FolderPlus } from "lucide-react";

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
    <div className="flex text-center text-muted-foreground  flex-col items-center justify-center mt-20 sm:mt-0 sm:min-h-[calc(100vh-28rem)] py-3 gap-1">
      <div className="w-[300px] sm:w-[350px] flex flex-col h-full justify-center items-center">
        <FolderPlus
          strokeWidth={1}
          className="size-25 sm:size-30"
        />
        <h1 className="text-[18px] sm:text-[20px] font-semibold ">
          Create your first project
        </h1>
        <p className="text-[12px] sm:text-[14px]">
          Start organizing your tasks and collaborate with your team by creating
          a new project.
        </p>
      </div>
    </div>
  );
}
