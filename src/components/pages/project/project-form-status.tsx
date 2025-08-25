import type { Path, useForm } from "react-hook-form";
import {
  PROJECT_STATUS_CREATE_ENUM,
  PROJECT_STATUS_ENUM,
} from "../../../lib/db/enums";
import { snakeToTitleCase } from "../../../lib/utils";
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

type ProjectFormStatus = {
  status?: string;
};

type ProjectFormStatusProps<T extends ProjectFormStatus> = {
  selectWidth?: string;
  notRequired?: boolean;
  control: ReturnType<typeof useForm<T>>["control"];
};

export function ProjectFormStatus<T extends ProjectFormStatus>({
  control,
  selectWidth,
  notRequired,
}: ProjectFormStatusProps<T>) {
  return (
    <FormField
      control={control}
      name={"status" as Path<T>} // ✅ ensures TS knows it's a valid field
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <RequiredLabel turnOff={notRequired}>
              {notRequired ? "Status" : "Initial Status"}
            </RequiredLabel>
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger className={`w-full ${selectWidth}`}>
                <SelectValue placeholder="Select project status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={`w-full ${selectWidth}`}>
              {notRequired ? (
                <>
                  {PROJECT_STATUS_ENUM.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                    >
                      {snakeToTitleCase(status)}
                    </SelectItem>
                  ))}
                </>
              ) : (
                <>
                  {PROJECT_STATUS_CREATE_ENUM.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                    >
                      {snakeToTitleCase(status)}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
