import { format } from "date-fns";
import type { Path, useForm } from "react-hook-form";
import { CalendarPicker } from "../../calendar-picker";
import { RequiredLabel } from "../../required-label";
import { Calendar } from "../../ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";

type ProjectDates = {
  startDate?: Date;
  endDate?: Date;
};

type ProjectFormDateProps<T extends ProjectDates> = {
  startDate?: Date;
  endDate?: Date;
  notRequired?: boolean;
  control: ReturnType<typeof useForm<T>>["control"];
};

export function ProjectFormDate<T extends ProjectDates>({
  control,
  startDate,
  endDate,
  notRequired,
}: ProjectFormDateProps<T>) {
  return (
    <div className="flex flex-col lphone:flex-row gap-5">
      <FormField
        control={control}
        name={"startDate" as Path<T>}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>
              <RequiredLabel turnOff={notRequired}>Start Date</RequiredLabel>
            </FormLabel>
            <FormControl>
              <CalendarPicker
                disabled={(date) =>
                  date < new Date("2010-01-01") || date > endDate!
                }
                value={field.value}
                onChange={field.onChange}
                formatStr="MM/dd/yyyy"
              >
                <Input
                  {...field}
                  maxLength={10}
                  autoComplete="off"
                  placeholder="DD/MM/YYYY"
                  value={field.value ? format(field.value, "MM/dd/yyyy") : ""}
                />
                <Calendar autoFocus />
              </CalendarPicker>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={"endDate" as Path<T>}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>
              <RequiredLabel turnOff={notRequired}>End Date</RequiredLabel>
            </FormLabel>
            <FormControl>
              <CalendarPicker
                disabled={(date) =>
                  date < new Date("2010-01-01") || date < startDate!
                }
                value={field.value}
                onChange={field.onChange}
                formatStr="MM/dd/yyyy"
              >
                <Input
                  {...field}
                  maxLength={10}
                  autoComplete="off"
                  placeholder="DD/MM/YYYY"
                  value={field.value ? format(field.value, "MM/dd/yyyy") : ""}
                />
                <Calendar autoFocus />
              </CalendarPicker>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
