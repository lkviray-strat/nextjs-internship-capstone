"use client";

import type { Projects, ProjectStatusEnum } from "@/src/types";
import { useProjects } from "@/src/use/hooks/use-projects";
import { ArchiveRestore, MoreHorizontal, Settings } from "lucide-react";
import Link from "next/link";
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

type ProjectCardDropdownProps = {
  project: Projects;
};

export function ProjectCardDropdown({ project }: ProjectCardDropdownProps) {
  const projectHooks = useProjects();
  const { teamId } = useParams<{ teamId: string }>();

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
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handlePropagation}
        >
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
        onClick={handlePropagation}
      >
        <DropdownMenuGroup>
          {project.status !== "archived" ? (
            <>
              <DropdownMenuItem asChild>
                <Link href={`projects/${project.id}/settings`}>
                  <Settings />
                  Settings
                </Link>
              </DropdownMenuItem>
              <ArchiveProjectModal id={project.id} />
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link href={`projects/${project.id}/settings`}>
                  <Settings />
                  Settings
                </Link>
              </DropdownMenuItem>
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
