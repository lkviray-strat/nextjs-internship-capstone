import type { ProjectStatusEnum } from "@/src/types";
import { useProjects } from "@/src/use/hooks/use-projects";
import { TRPCClientError } from "@trpc/client";
import { Trash } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { ClientOnly } from "../../client-only";
import { Loader } from "../../loader";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { DropdownMenuItem } from "../../ui/dropdown-menu";

type ArchiveProjectModalProps = {
  id?: string;
  buttonLabel?: string;
  buttonVariant?: "archive" | "destructive";
};

export function ArchiveProjectModal({
  id,
  buttonLabel,
  buttonVariant,
}: ArchiveProjectModalProps) {
  const projectHooks = useProjects();
  const params = useParams<{ teamId: string; projectId: string }>();
  const [open, setOpen] = useState(false);

  let bVariant: "destructiveSecondary" | "archiveSecondary" | "secondary";

  switch (buttonVariant) {
    case "destructive":
      bVariant = "destructiveSecondary";
      break;
    case "archive":
      bVariant = "archiveSecondary";
      break;
    default:
      bVariant = "secondary";
  }

  const handlePropagation = (e: Event | React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleClose = (e: React.MouseEvent) => {
    handlePropagation(e);
    setOpen(false);
  };

  const handleSubmit = async () => {
    const projectId = id ?? params.projectId;
    const teamId = params.teamId;

    try {
      if (!projectId || !teamId) return;

      const updateValue = {
        id: projectId.toString(),
        teamId: teamId.toString(),
        status: "archived" as ProjectStatusEnum,
      };

      await projectHooks.updateProject(updateValue);
      setOpen(false);
      toast.success("Project archived successfully");
    } catch (error) {
      if (error instanceof Error || error instanceof TRPCClientError) {
        toast.error(`Failed to archive project: ${error.message}`);
      } else {
        toast.error("Failed to archive project");
      }
      setOpen(false);
      console.log(error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {buttonVariant ? (
          <Button
            type="button"
            variant={bVariant}
            className="w-full sm:w-fit"
            disabled={projectHooks.isUpdatingProject}
          >
            {buttonLabel}
          </Button>
        ) : (
          <DropdownMenuItem
            variant="archive"
            onSelect={handlePropagation}
          >
            <Trash />
            Archive Project
          </DropdownMenuItem>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <ClientOnly fallback={<Loader />}>
            <DialogDescription>
              This action can still be undone. This will temporarily archive
              your project and hide your data from the project list.
            </DialogDescription>
          </ClientOnly>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row">
          <ClientOnly>
            <Button
              className="order-2 sm:order-1"
              variant="outline"
              disabled={projectHooks.isUpdatingProject}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="order-1 sm:order-2"
              variant="archiveDestructive"
              disabled={projectHooks.isUpdatingProject}
              onClick={handleSubmit}
            >
              Archive
            </Button>
          </ClientOnly>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
