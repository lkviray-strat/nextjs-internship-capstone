import type { UpdateProjectRequestInput } from "@/src/types";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Path, useForm } from "react-hook-form";
import { PermissionGate } from "../../permission-gate";
import { Button } from "../../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";

type ProjectFields = {
  name?: string;
  description?: string;
};

type ProjectUpdateDetailsProps<T extends ProjectFields> = {
  isSubmitting: boolean;
  onSubmit: (value: Omit<UpdateProjectRequestInput, "id">) => Promise<void>;
  control: ReturnType<typeof useForm<T>>["control"];
};

export function ProjectUpdateDetails<T extends ProjectFields>({
  isSubmitting,
  onSubmit,
  control,
}: ProjectUpdateDetailsProps<T>) {
  const { user } = useUser();
  const { teamId } = useParams<{ teamId: string }>();
  const [nameDisable, setNameDisable] = useState(true);
  const [descriptionDisable, setDescriptionDisable] = useState(true);

  const handleDisable = (
    disable: boolean,
    setDisable: Dispatch<SetStateAction<boolean>>,
    value: Omit<UpdateProjectRequestInput, "id">
  ) => {
    if (!disable) onSubmit(value);
    setDisable((prev) => !prev);
  };

  return (
    <>
      <FormField
        control={control}
        name={"name" as Path<T>}
        render={({ field }) => (
          <FormItem className="project-setting-grid">
            <FormLabel className="text-sm flex flex-col items-start gap-1">
              Name
              <div className="text-muted-foreground">
                This would appear as the project name (e.g. Website Redesign)
              </div>
            </FormLabel>

            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <FormControl>
                  <Input
                    disabled={nameDisable}
                    placeholder="Enter project name (e.g. Website Redesign)"
                    {...field}
                  />
                </FormControl>
                <PermissionGate
                  userId={user?.id ?? ""}
                  teamId={teamId ?? ""}
                  permissions={["update:project"]}
                >
                  <Button
                    disabled={isSubmitting}
                    type="button"
                    variant="link"
                    onClick={() =>
                      handleDisable(nameDisable, setNameDisable, {
                        name: field.value,
                      })
                    }
                  >
                    {nameDisable ? "Edit" : "Save"}
                  </Button>
                </PermissionGate>
              </div>

              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={"description" as Path<T>}
        render={({ field }) => (
          <FormItem className="project-setting-grid">
            <FormLabel className="text-sm flex flex-col items-start gap-1">
              Description
              <div className="text-muted-foreground">
                This would appear as the project description (e.g. This project
                aims to redesign the company website)
              </div>
            </FormLabel>
            <div className="flex flex-col">
              <div className="flex flex-row h-full gap-2">
                <FormControl>
                  <Textarea
                    rows={4}
                    disabled={descriptionDisable}
                    placeholder="Enter project description (e.g. This project aims to redesign the company website)"
                    {...field}
                  />
                </FormControl>
                <PermissionGate
                  userId={user?.id ?? ""}
                  teamId={teamId ?? ""}
                  permissions={["update:project"]}
                >
                  <Button
                    disabled={isSubmitting}
                    type="button"
                    variant="link"
                    onClick={() =>
                      handleDisable(descriptionDisable, setDescriptionDisable, {
                        description: field.value,
                      })
                    }
                  >
                    {descriptionDisable ? "Edit" : "Save"}
                  </Button>
                </PermissionGate>
              </div>
            </div>
          </FormItem>
        )}
      />
    </>
  );
}
