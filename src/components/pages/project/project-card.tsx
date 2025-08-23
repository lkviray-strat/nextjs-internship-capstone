import Link from "next/link";
import { PROJECT_STATUS_TW_COLORS } from "../../../lib/db/enums";
import { getTimeLeft } from "../../../lib/utils";
import type { Projects, User } from "../../../types";
import { AvatarGroup } from "../../avatar-group";
import { ProjectCardDropdown } from "./project-card-dropdown";
import { ProjectStatus } from "./project-status";

type ProjectCardProps = {
  project: Projects;
  members: User[];
  progress: number;
};

export function ProjectCard({ project, members, progress }: ProjectCardProps) {
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
      className="bg-card flex flex-col gap-3 rounded-lg border p-5 hover:shadow-lg hover:scale-98 transition-transform"
    >
      <div className="flex items-center justify-between">
        <ProjectStatus
          color={PROJECT_STATUS_TW_COLORS[project.status]}
          status={project.status}
        />
        <ProjectCardDropdown projectId={project.id} />
      </div>
      <div className="flex flex-col gap-2 py-3">
        <h3 className="text-[24px] font-semibold line-clamp-1">
          {project.name}
        </h3>
        {project.description ? (
          <p className="text-[15px] line-clamp-2 h-[3rem]">
            {project.description}
          </p>
        ) : (
          <p className="text-[15px] text-muted-foreground italic line-clamp-2 h-[3rem]">
            This project has no description available
          </p>
        )}
      </div>

      <div className="flex flex-row items-center justify-between">
        <AvatarGroup users={members} />
      </div>

      <div className="flex flex-col">
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
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground text-[15px]">
          Due{" "}
          {project.endDate
            ? new Date(project.endDate).toLocaleDateString()
            : "N/A"}
        </span>
        <span className="text-muted-foreground text-[15px]">
          {getTimeLeft(project.endDate as Date)}
        </span>
      </div>
    </Link>
  );
}
