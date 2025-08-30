import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { TASK_PRIORITY_ENUM } from "@/src/lib/db/enums";
import { snakeToTitleCase } from "@/src/lib/utils";
import type { CreateTaskRequestInput } from "@/src/types";

import type { useForm } from "react-hook-form";

type TaskCreateSelectsProps = {
  control: ReturnType<typeof useForm<CreateTaskRequestInput>>["control"];
};

export function TaskCreateSelects({ control }: TaskCreateSelectsProps) {
  return (
    <>
      <FormField
        control={control}
        name="priority"
        render={({ field }) => (
          <FormItem className="flex-2/4">
            <FormLabel>Priority</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Filter by priority`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="w-full">
                {TASK_PRIORITY_ENUM.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {snakeToTitleCase(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="estimatedHours"
        render={({ field }) => (
          <FormItem className="flex-1/4">
            <FormLabel>Est. Hours </FormLabel>

            <FormControl>
              <Input
                {...field}
                type="number"
                min={0}
                max={999}
                step={1}
                placeholder="Est. hours"
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
