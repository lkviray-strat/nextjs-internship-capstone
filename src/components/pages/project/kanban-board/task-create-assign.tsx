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
import { TaskAssigneeBadge } from "./task-assignee-badge";
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
              <div className="relative">
                <TaskCreateSearch field={field} />
                {field.value && (
                  <div className="absolute left-3 top-1/2">
                    <TaskAssigneeBadge
                      userId={field.value}
                      removeHandler={() => field.onChange(null)}
                    />
                  </div>
                )}
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
