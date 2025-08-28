import { RequiredLabel } from "@/src/components/required-label";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";

import type { CreateTaskRequestInput } from "@/src/types";
import type { useForm } from "react-hook-form";
import { TaskCreateSearch } from "./task-create-search";

type TaskCreateAssignProps = {
  control: ReturnType<typeof useForm<CreateTaskRequestInput>>["control"];
};

export function TaskCreateAssign({ control }: TaskCreateAssignProps) {
  return (
    <>
      <FormField
        control={control}
        name="assigneeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <RequiredLabel>Assignee</RequiredLabel>
            </FormLabel>
            <FormControl>
              <TaskCreateSearch field={field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
