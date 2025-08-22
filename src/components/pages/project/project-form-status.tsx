import type { useForm } from "react-hook-form";
import { PROJECT_STATUS_CREATE_ENUM } from "../../../lib/db/enums";
import { snakeToTitleCase } from "../../../lib/utils";
import type { CreateProjectRequestInput } from "../../../types";
import { RequiredLabel } from "../../required-label";
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

type ProjectFormStatusProps = {
  control: ReturnType<typeof useForm<CreateProjectRequestInput>>["control"];
};

export function ProjectFormStatus({ control }: ProjectFormStatusProps) {
  return (
    <FormField
      control={control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <RequiredLabel>Initial Status</RequiredLabel>
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={undefined}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select project status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="w-full">
              {PROJECT_STATUS_CREATE_ENUM.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                >
                  {snakeToTitleCase(status)}
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
