import { RequiredLabel } from "@/src/components/required-label";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import type { Path, useForm } from "react-hook-form";

type TaskFields = {
  title: string;
  description?: string;
};

type TaskCreateDetailsProps<T extends TaskFields> = {
  control: ReturnType<typeof useForm<T>>["control"];
};

export function TaskCreateDetails<T extends TaskFields>({
  control,
}: TaskCreateDetailsProps<T>) {
  return (
    <>
      <FormField
        control={control}
        name={"title" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <RequiredLabel>Task Name</RequiredLabel>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter task name  (e.g. Design Landing Page)"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={"description" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter task description (e.g. This task involves creating a landing page)"
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
