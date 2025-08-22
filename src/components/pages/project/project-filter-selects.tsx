import type { useForm } from "react-hook-form";
import { snakeToTitleCase } from "../../../lib/utils";
import type { ProjectFilters } from "../../../types";
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

type ProjectFilterSelectsProps = {
  items: readonly string[] | string[];
  name: "order" | "status";
  label: string;
  itemsBeingShown?: string[];
  control: ReturnType<
    typeof useForm<Omit<ProjectFilters, "teamId">>
  >["control"];
};

export function ProjectFilterSelects({
  control,
  items,
  label,
  name,
  itemsBeingShown,
}: ProjectFilterSelectsProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Filter by ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="w-full">
              {items.map((item, idx) => (
                <SelectItem
                  key={item}
                  value={item}
                >
                  {itemsBeingShown
                    ? itemsBeingShown[idx]
                    : snakeToTitleCase(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
