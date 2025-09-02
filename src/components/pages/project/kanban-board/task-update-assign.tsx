import { RequiredLabel } from "@/src/components/required-label";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";

import type { UpdateTaskRequestInput } from "@/src/types";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import type { useForm } from "react-hook-form";
import { TaskAssigneeBadge } from "./task-assignee-badge";
import { TaskUpdateSearch } from "./task-update-search";

type TaskUpdateAssignProps = {
  control: ReturnType<typeof useForm<UpdateTaskRequestInput>>["control"];
};

export function TaskUpdateAssign({ control }: TaskUpdateAssignProps) {
  return (
    <>
      <FormField
        control={control}
        name="assigneeId"
        render={({ field }) => (
          <FormItem className="sm:w-[400px]">
            <FormLabel>
              <RequiredLabel>Assignee</RequiredLabel>
            </FormLabel>

            <FormControl>
              <div className="relative">
                <TaskUpdateSearch field={field} />
                {field.value && (
                  <div className="absolute left-3 top-0 flex items-center bottom-0">
                    <Suspense fallback={<Loader2 className="animate-spin" />}>
                      <TaskAssigneeBadge
                        userId={field.value}
                        removeHandler={() => field.onChange(null)}
                      />
                    </Suspense>
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
