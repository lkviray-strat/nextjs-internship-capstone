import { ColorPicker } from "@/src/components/color-picker";
import { RequiredLabel } from "@/src/components/required-label";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import type { Path, useForm } from "react-hook-form";

type KanbanColumnFields = {
  name: string;
  color?: string;
};

type KanbanColumnCreateDetailsProps<T extends KanbanColumnFields> = {
  control: ReturnType<typeof useForm<T>>["control"];
};

export function KanbanColumnCreateDetails<T extends KanbanColumnFields>({
  control,
}: KanbanColumnCreateDetailsProps<T>) {
  return (
    <>
      <FormField
        control={control}
        name={"name" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <RequiredLabel>Name</RequiredLabel>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. To Do, In Progress, Done"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={"color" as Path<T>}
        render={({ field }) => (
          <FormItem className="size-5 w-full h-full">
            <FormLabel>Color</FormLabel>
            <FormControl>
              <div className="w-full flex flex-row gap-3">
                <Input
                  {...field}
                  className="w-full"
                  value={field.value ?? "#FFFFFF"}
                  maxLength={7}
                />
                <ColorPicker
                  className="w-10"
                  onChange={field.onChange}
                  value={field.value ?? "#FFFFFF"}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
