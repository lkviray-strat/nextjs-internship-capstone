import type { JSX } from "react";
import { Button } from "../../ui/button";
import { ArchiveProjectModal } from "../modals/archive-project-modal";
import { DeleteProjectModal } from "../modals/delete-project-modal";

type ProjectDangerProps = {
  label: string;
  description: string;
  id?: string;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  modal?: boolean;
  variant?: "default" | "destructive" | "archive";
};

export function ProjectUpdateDanger({
  label,
  description,
  onSubmit,
  isSubmitting,
  id,
  modal = true,
  variant,
}: ProjectDangerProps) {
  let buttonVariant: "destructiveSecondary" | "archiveSecondary" | "secondary";
  let borderColor: string;

  switch (variant) {
    case "destructive":
      buttonVariant = "destructiveSecondary";
      borderColor = "border-red-800";
      break;
    case "archive":
      buttonVariant = "archiveSecondary";
      borderColor = "border-orange-800";
      break;
    default:
      buttonVariant = "secondary";
      borderColor = "border-border";
  }

  let projectModal: JSX.Element | null = null;

  switch (variant) {
    case "destructive":
      projectModal = (
        <DeleteProjectModal
          buttonVariant="destructive"
          buttonLabel={label}
          id={id}
        />
      );
      break;
    case "archive":
      projectModal = (
        <ArchiveProjectModal
          buttonVariant="archive"
          buttonLabel={label}
          id={id}
        />
      );
      break;
  }

  return (
    <>
      <div
        className={`flex flex-col justify-between sm:flex-row max-w-[1100px] items-center gap-6 !${borderColor} border-1 p-7 rounded-lg`}
      >
        <div className="flex flex-col ">
          <span className="font-medium">{label}?</span>
          <span className="text-muted-foreground">{description}</span>
        </div>

        {modal && projectModal ? (
          <>{projectModal}</>
        ) : (
          <Button
            type="button"
            variant={buttonVariant}
            className="w-full sm:w-fit"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {label}
          </Button>
        )}
      </div>
    </>
  );
}
