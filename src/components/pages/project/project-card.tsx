/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { PROJECT_STATUS_TW_COLORS } from "../../../lib/db/enums";
import {
  extractEveryMember,
  extractNonNullableFrom,
  getTimeLeft,
} from "../../../lib/utils";
import type {
  Projects,
  ProjectTeamsWithTeamMembersResult,
} from "../../../types";
import { TooltipHover } from "../../tooltip-hover";
import { Separator } from "../../ui/separator";
import { ProjectAvatar } from "./project-avatar";
import { ProjectCardDropdown } from "./project-card-dropdown";
import { ProjectStatus } from "./project-status";

type ProjectCardProps = {
  project: Projects;
  members: ProjectTeamsWithTeamMembersResult;
  progress: number;
};

export function ProjectCard({ project, members, progress }: ProjectCardProps) {
  const isDoneOrArchived =
    project.status === "completed" || project.status === "archived";
  const isBehind =
    !isDoneOrArchived &&
    project.endDate &&
    new Date(project.endDate) < new Date();

  const everymember = extractEveryMember(members);
  const filteredMembers = extractNonNullableFrom(everymember);

  const barColor =
    progress >= 100
      ? "bg-green-500"
      : project.endDate && new Date(project.endDate) < new Date()
        ? "bg-red-500"
        : progress > 0
          ? "bg-yellow-500"
          : "bg-blue-500";

  return (
    <Link
      href={`projects/${project.id}`}
      className="bg-card flex flex-col gap-3 rounded-lg border hover:shadow-lg hover:scale-98 transition-transform"
    >
      <div className="flex items-start justify-between px-5 pt-5">
        <div className="size-15">
          <ProjectAvatar
            content={`${project.name}`}
            className="text-[24px]"
          >
            {project.name}
          </ProjectAvatar>
        </div>
        <ProjectCardDropdown project={project} />
      </div>

      <div className="flex flex-col gap-2 px-5 mt-2">
        <div className="flex flex-row items-center gap-3">
          <TooltipHover content={project.name}>
            <h3 className="text-[24px] font-semibold text-left line-clamp-1">
              {project.name}
            </h3>
          </TooltipHover>
        </div>

        {project.description ? (
          <p className="text-[15px] text-muted-foreground line-clamp-2 h-[3rem]">
            {project.description}
          </p>
        ) : (
          <p className="text-[15px] text-muted-foreground/70 italic line-clamp-2 h-[3rem]">
            This project has no description available
          </p>
        )}
      </div>

      <Separator />

      <div className="flex flex-col px-5 pt-2">
        <div className="flex text-[15px] items-center justify-between mb-2">
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
      <div
        className={`${isBehind ? "text-red-500" : "text-muted-foreground"} px-5 pb-2 text-[15px] flex items-center justify-end gap-2`}
      >
        <span>
          Due{" "}
          {project.endDate
            ? new Date(project.endDate).toLocaleDateString()
            : "N/A"}
          ,
        </span>
        <span>{getTimeLeft(project.endDate as Date, isDoneOrArchived)}</span>
      </div>

      <div className="flex flex-row items-center justify-end px-5 gap-3 pb-7">
        <div className="scale-">
          <ProjectStatus
            color={PROJECT_STATUS_TW_COLORS[project.status]}
            status={project.status}
          />
        </div>
      </div>
    </Link>
  );
}
