"use client";

import type { Projects, ProjectStatusEnum } from "@/src/types";
import { useProjects } from "@/src/use/hooks/use-projects";
import { ArchiveRestore, MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { ArchiveProjectModal } from "../modals/archive-project-modal";
import { DeleteProjectModal } from "../modals/delete-project-modal";

type ProjectHeaderDropdownProps = {
  project: Projects;
};

export function ProjectHeaderDropdown({ project }: ProjectHeaderDropdownProps) {
  const projectHooks = useProjects();
  const { teamId } = useParams();

  const handlePropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleRestoreProject = async () => {
    if (!teamId || !project.id) return;

    try {
      const updateValue = {
        id: project.id,
        teamId: teamId.toString(),
        status: "active" as ProjectStatusEnum,
      };

      await projectHooks.updateProject(updateValue);
      toast.success("Project restored successfully");
    } catch (error) {
      toast.error("Failed to restore project");
      console.log(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          onClick={handlePropagation}
        >
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        onClick={handlePropagation}
        className="mt-2"
      >
        <DropdownMenuGroup>
          {project.status !== "archived" ? (
            <>
              <ArchiveProjectModal id={project.id} />
            </>
          ) : (
            <>
              <DropdownMenuItem onSelect={handleRestoreProject}>
                <ArchiveRestore />
                Restore Project
              </DropdownMenuItem>
              <DeleteProjectModal id={project.id} />
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
