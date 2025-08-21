import type { AppRouter } from "@/src/types";
import type { TRPCClientErrorLike } from "@trpc/client";
import { FolderX } from "lucide-react";

export function DashboardRecentProjectsError() {
  return (
    <>
      <h3 className="text-lg font-semibold">Recent Projects</h3>
      <div className="text-red-500 flex items-center justify-center h-full py-3">
        Error loading recent projects, please contact support.
      </div>
    </>
  );
}

export function ProjectGridError(e: TRPCClientErrorLike<AppRouter>) {
  console.log(e.shape?.message);

  return (
    <div className="col-span-3 flex text-center text-red-500 flex-col items-center justify-center mt-30 sm:mt-0 sm:min-h-[calc(100vh-26rem)] py-3 gap-1">
      <div className="w-[300px] sm:w-[350px] flex flex-col h-full justify-center items-center">
        <FolderX
          strokeWidth={1}
          className="size-25 sm:size-30"
        />
        <h1 className="text-[18px] sm:text-[20px] font-semibold ">
          404 Unknown Error
        </h1>
        <p className="text-[12px] sm:text-[14px]">
          An unexpected error occurred while loading your projects. Please try
          again later or contact support.
        </p>
      </div>
    </div>
  );
}
