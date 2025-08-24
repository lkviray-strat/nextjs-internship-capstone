"use client";

import { PROJECT_STATUS_TW_COLORS } from "@/src/lib/db/enums";
import { extractEveryMember, extractNonNullableFrom } from "@/src/lib/utils";
import { useFetch } from "@/src/use/hooks/use-fetch";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AvatarGroup } from "../../avatar-group";
import { buttonVariants } from "../../ui/button";
import { ProjectHeaderDropdown } from "./project-header-dropdown";
import { ProjectStatus } from "./project-status";

type ProjectHeaderProps = {
  showOptions?: boolean;
};

export function ProjectHeader({ showOptions = true }: ProjectHeaderProps) {
  const params = useParams();
  const fetch = useFetch();

  const projectId = params.projectId!.toString();
  const teamId = params.teamId!.toString();

  const project = fetch.projects.useGetMyCurrentProject(projectId, teamId);
  const projectTeams =
    fetch.projectTeams.useGetProjectTeamsByProjectIdWithTeamMembers(
      projectId,
      teamId
    );

  const everyMember = extractEveryMember(projectTeams.data);
  const filteredMembers = extractNonNullableFrom(everyMember);

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center sm:justify-between gap-3">
      <div className="flex flex-row gap-5 items-center">
        <h1 className="text-[25px] sm:text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
          {project.data[0].name}
        </h1>
        <ProjectStatus
          status={project.data[0].status}
          color={PROJECT_STATUS_TW_COLORS[project.data[0].status]}
        />
      </div>

      {showOptions && (
        <div className="flex items-center gap-3 shrink-0 sm:pl-10">
          <AvatarGroup users={filteredMembers} />
          <Link
            href={`${projectId}/settings`}
            className={`${buttonVariants({ variant: "secondary" })} >`}
          >
            <Settings className="size-5" />
            Settings
          </Link>
          <ProjectHeaderDropdown project={project.data[0]} />
        </div>
      )}
    </div>
  );
}
