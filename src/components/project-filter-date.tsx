import { format } from "date-fns";
import type { useForm } from "react-hook-form";
import type { ProjectFilters } from "../types";
import { CalendarPicker } from "./calendar-picker";
import { Calendar } from "./ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

type ProjectFilterDateProps = {
  startDate: Date;
  endDate: Date;
  control: ReturnType<
    typeof useForm<Omit<ProjectFilters, "teamId">>
  >["control"];
};

export function ProjectFilterDate({
  control,
  startDate,
  endDate,
}: ProjectFilterDateProps) {
  return (
    <div className="flex flex-row gap-3">
      <FormField
        control={control}
        name="start"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>From:</FormLabel>
            <FormControl>
              <CalendarPicker
                disabled={(date) =>
                  date < new Date("2010-01-01") || date > endDate
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
        name="end"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Until:</FormLabel>
            <FormControl>
              <CalendarPicker
                disabled={(date) =>
                  date < new Date("2010-01-01") || date < startDate
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
