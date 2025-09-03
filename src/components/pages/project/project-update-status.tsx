import type { ProjectStatusEnum, UpdateProjectRequestInput } from "@/src/types";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Path, useForm } from "react-hook-form";
import { PROJECT_STATUS_UPDATE_ENUM } from "../../../lib/db/enums";
import { snakeToTitleCase } from "../../../lib/utils";
import { PermissionGate } from "../../permission-gate";
import { Button } from "../../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

type ProjectStatus = {
  status?: string;
};

type ProjectUpdateStatusProps<T extends ProjectStatus> = {
  isSubmitting: boolean;
  onSubmit: (value: Omit<UpdateProjectRequestInput, "id">) => Promise<void>;
  control: ReturnType<typeof useForm<T>>["control"];
};

export function ProjectUpdateStatus<T extends ProjectStatus>({
  isSubmitting,
  onSubmit,
  control,
}: ProjectUpdateStatusProps<T>) {
  const { user } = useUser();
  const { teamId } = useParams<{ teamId: string }>();
  const [statusDisable, setStatusDisable] = useState(true);

  const handleDisable = (
    disable: boolean,
    setDisable: Dispatch<SetStateAction<boolean>>,
    value: Omit<UpdateProjectRequestInput, "id">
  ) => {
    if (!disable) onSubmit(value);
    setDisable((prev) => !prev);
  };

  return (
    <FormField
      control={control}
      name={"status" as Path<T>}
      render={({ field }) => (
        <FormItem className="project-setting-grid">
          <FormLabel className="text-sm flex flex-col items-start gap-1">
            Status
            <div className="text-muted-foreground">
              This would appear as the project status (e.g. In Progress,
              Completed, etc..)
            </div>
          </FormLabel>
          <div className="flex flex-col">
            <div className="flex flex-row gap-2">
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    className="w-[200px]"
                    disabled={statusDisable}
                  >
                    <SelectValue placeholder="Select project status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-[200px]">
                  {PROJECT_STATUS_UPDATE_ENUM.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                    >
                      {snakeToTitleCase(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    handleDisable(statusDisable, setStatusDisable, {
                      status: field.value as ProjectStatusEnum | undefined,
                    })
                  }
                >
                  {statusDisable ? "Edit" : "Save"}
                </Button>
              </PermissionGate>
            </div>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
