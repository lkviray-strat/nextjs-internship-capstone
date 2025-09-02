import { CalendarPicker } from "@/src/components/calendar-picker";
import { RequiredLabel } from "@/src/components/required-label";
import { Calendar } from "@/src/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import type { UpdateTaskRequestInput } from "@/src/types";
import { format } from "date-fns";
import type { useForm } from "react-hook-form";

type TaskUpdateDateProps = {
  startDate: Date;
  endDate: Date;
  control: ReturnType<typeof useForm<UpdateTaskRequestInput>>["control"];
};

export function TaskUpdateDate({
  control,
  startDate,
  endDate,
}: TaskUpdateDateProps) {
  return (
    <div className="flex flex-col lphone:flex-row gap-5">
      <FormField
        control={control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>
              <RequiredLabel>Start Date</RequiredLabel>
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
        name="endDate"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>
              <RequiredLabel>End Date</RequiredLabel>
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
