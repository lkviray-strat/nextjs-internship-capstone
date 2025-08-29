import { useProjects } from "@/src/use/hooks/use-projects";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
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

type DeleteProjectModalProps = {
  id?: string;
  buttonLabel?: string;
  buttonVariant?: "archive" | "destructive";
};

export function DeleteProjectModal({
  id,
  buttonLabel,
  buttonVariant,
}: DeleteProjectModalProps) {
  const router = useRouter();
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

      const deleteValue = {
        id: projectId.toString(),
        teamId: teamId.toString(),
      };

      if (buttonVariant) router.push(`/${teamId}/projects`);
      await projectHooks.deleteProject(deleteValue);
      setOpen(false);
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
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
            variant="destructive"
            onSelect={handlePropagation}
          >
            <Trash />
            Delete Project
          </DropdownMenuItem>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <ClientOnly fallback={<Loader />}>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              project and all associated data.
            </DialogDescription>
          </ClientOnly>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row">
          <ClientOnly>
            <Button
              className="order-2 sm:order-1"
              variant="outline"
              disabled={projectHooks.isDeletingProject}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="order-1 sm:order-2"
              variant="destructive"
              disabled={projectHooks.isDeletingProject}
              onClick={handleSubmit}
            >
              Delete
            </Button>
          </ClientOnly>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
