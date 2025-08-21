// TODO: Task 4.5 - Design and implement project cards and layouts

import { MoreHorizontal } from "lucide-react";
import { PROJECT_STATUS_TW_COLORS } from "../lib/db/enums";
import { getTimeLeft } from "../lib/utils";
import type { Projects } from "../types";
import { ProjectStatus } from "./project-status";
import { Button } from "./ui/button";

type ProjectCardProps = {
  project: Projects;
  progress: number;
};

export function ProjectCard({ project, progress }: ProjectCardProps) {
  const barColor =
    progress >= 100
      ? "bg-green-500"
      : project.endDate && new Date(project.endDate) < new Date()
        ? "bg-red-500"
        : progress > 0
          ? "bg-yellow-500"
          : "bg-blue-500";

  return (
    <div className="bg-card flex flex-col gap-3 rounded-lg border p-6 hover:shadow-lg hover:scale-98 transition-transform">
      <div className="flex items-center justify-between">
        <ProjectStatus
          color={PROJECT_STATUS_TW_COLORS[project.status]}
          status={project.status}
        />
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <MoreHorizontal size={16} />
        </Button>
      </div>
      <div className="flex flex-col gap-2 py-4">
        <h3 className="text-[24px] font-semibold line-clamp-1">
          {project.name}
        </h3>
        <p className="text-[15px] line-clamp-3 h-[4rem]">
          {project.description
            ? project.description
            : "This project has no description available."}
        </p>
      </div>

      <div className="flex flex-col">
        <div className="flex text-[16px] items-center justify-between mb-2">
          <span className="">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="w-full rounded-full h-2 bg-muted">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-end text-[16px]">
        <span className="text-muted-foreground">
          {getTimeLeft(project.endDate as Date)}
        </span>
      </div>
    </div>
  );
}
