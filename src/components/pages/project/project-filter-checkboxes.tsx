import { snakeToTitleCase } from "@/src/lib/utils";
import type { useForm } from "react-hook-form";
import type { ProjectFilters, ProjectStatusEnum } from "../../../types";
import { Checkbox } from "../../ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

type ProjectFilterCheckboxesProps = {
  items: ProjectStatusEnum[];
  name: "status";
  control: ReturnType<
    typeof useForm<Omit<ProjectFilters, "teamId">>
  >["control"];
};

export function ProjectFilterCheckboxes({
  control,
  items,
  name,
}: ProjectFilterCheckboxesProps) {
  return (
    <>
      <FormLabel>Status</FormLabel>
      <div className="grid grid-cols-2 gap-3 ">
        {items.map((item) => (
          <FormField
            key={item}
            control={control}
            name={name}
            render={({ field }) => (
              <FormItem className="flex flex-row">
                <FormControl>
                  <Checkbox
                    checked={
                      Array.isArray(field.value) && field.value.includes(item)
                    }
                    onCheckedChange={(checked) => {
                      const current = Array.isArray(field.value)
                        ? field.value
                        : [];
                      return checked
                        ? field.onChange([...current, item])
                        : field.onChange(current.filter((i) => i !== item));
                    }}
                  ></Checkbox>
                </FormControl>
                <FormLabel>{snakeToTitleCase(item)}</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </>
  );
}
