"use client";

import { PROJECT_STATUS_TW_COLORS } from "@/src/lib/db/enums";
import { extractEveryMember, extractNonNullableFrom } from "@/src/lib/utils";
import { useUIStore } from "@/src/stores/ui-store";
import { useFetch } from "@/src/use/hooks/use-fetch";
import { GripVertical, Settings, View } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { AvatarGroup } from "../../avatar-group";
import { TooltipHover } from "../../tooltip-hover";
import { Button, buttonVariants } from "../../ui/button";
import { CreateColumnModal } from "../modals/create-column-modal";
import { ProjectAvatar } from "./project-avatar";
import { ProjectHeaderDropdown } from "./project-header-dropdown";
import { ProjectHeaderSelect } from "./project-header-select";
import { ProjectStatus } from "./project-status";

type ProjectHeaderProps = {
  showOptions?: boolean;
};

export function ProjectHeader({ showOptions = true }: ProjectHeaderProps) {
  const params = useParams();
  const fetch = useFetch();
  const { isEditingMode, setIsEditingMode } = useUIStore();

  const projectId = params.projectId!.toString();
  const teamId = params.teamId!.toString();

  const project = fetch.projects.useGetMyCurrentProject(projectId, teamId);
  const projectTeams =
    fetch.projectTeams.useGetProjectTeamsByProjectIdWithTeamMembers(
      projectId,
      teamId
    );

  const kanbanBoards = fetch.kanbanBoards.useGetMyKanbanBoards(projectId);

  const everyMember = extractEveryMember(projectTeams.data);
  const filteredMembers = extractNonNullableFrom(everyMember);

  const handleEditingMode = () => setIsEditingMode();

  useEffect(() => {
    return setIsEditingMode(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-end gap-4">
      <div className="flex w-full flex-col sm:flex-row justify-center items-start sm:justify-between sm:items-center gap-3 -mt-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex size-22 sm:size-12 shrink-0">
            <ProjectAvatar
              content={`${project.data[0].name}`}
              className="text-[36px] sm:text-[20px]"
            >
              {project.data[0].name}
            </ProjectAvatar>
          </div>

          <TooltipHover content={project.data[0].name}>
            <h1 className="text-left align-bottom sm:line-clamp-1 text-[25px] sm:text-3xl font-bold space-x-2">
              {project.data[0].name}{" "}
              <div className="inline-flex align-middle sm:scale-85 -mt-0.5">
                <ProjectStatus
                  status={project.data[0].status}
                  color={PROJECT_STATUS_TW_COLORS[project.data[0].status]}
                />
              </div>
            </h1>
          </TooltipHover>
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
      <div className="flex border-y-1 py-3 w-full flex-col sm:flex-row justify-end gap-3 px-4 sm:px-6 lg:px-8">
        <ProjectHeaderSelect
          kanbanBoards={kanbanBoards.data}
          project={project.data[0]}
        />
        <Button
          variant="outline"
          onClick={handleEditingMode}
        >
          {isEditingMode ? (
            <span className="text-yellow-500 flex gap-2 items-center ">
              <GripVertical /> Dragging Mode
            </span>
          ) : (
            <>
              <View /> Viewing Mode
            </>
          )}
        </Button>
        {kanbanBoards.data.length > 0 && <CreateColumnModal />}
      </div>
    </div>
  );
}
