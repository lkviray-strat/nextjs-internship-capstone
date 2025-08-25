import type { UpdateProjectRequestInput } from "@/src/types";
import { format } from "date-fns";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Path, useForm } from "react-hook-form";
import { CalendarPicker } from "../../calendar-picker";
import { Button } from "../../ui/button";
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

type ProjectUpdateDatesProps<T extends ProjectDates> = {
  isSubmitting: boolean;
  startDate?: Date;
  endDate?: Date;
  onSubmit: (value: Omit<UpdateProjectRequestInput, "id">) => Promise<void>;
  control: ReturnType<typeof useForm<T>>["control"];
};

export function ProjectUpdateDates<T extends ProjectDates>({
  isSubmitting,
  control,
  onSubmit,
  startDate,
  endDate,
}: ProjectUpdateDatesProps<T>) {
  const [startDateDisable, setStartDateDisable] = useState(true);
  const [endDateDisable, setEndDateDisable] = useState(true);

  const handleDisable = (
    disable: boolean,
    setDisable: Dispatch<SetStateAction<boolean>>,
    value: Omit<UpdateProjectRequestInput, "id">
  ) => {
    if (!disable) onSubmit(value);
    setDisable((prev) => !prev);
  };

  return (
    <>
      <FormField
        control={control}
        name={"startDate" as Path<T>}
        render={({ field }) => (
          <FormItem className="project-setting-grid">
            <FormLabel className="text-sm flex flex-col items-start gap-1">
              Start Date
              <div className="text-muted-foreground">
                This would appear as the project start date (e.g. 01/01/2023)
              </div>
            </FormLabel>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <FormControl>
                  <CalendarPicker
                    disable={startDateDisable}
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
                      disabled={startDateDisable}
                      autoComplete="off"
                      placeholder="DD/MM/YYYY"
                      value={
                        field.value ? format(field.value, "MM/dd/yyyy") : ""
                      }
                    />
                    <Calendar autoFocus />
                  </CalendarPicker>
                </FormControl>
                <Button
                  disabled={isSubmitting}
                  type="button"
                  variant="link"
                  onClick={() =>
                    handleDisable(startDateDisable, setStartDateDisable, {
                      startDate: field.value,
                    })
                  }
                >
                  {startDateDisable ? "Edit" : "Save"}
                </Button>
              </div>

              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={"endDate" as Path<T>}
        render={({ field }) => (
          <FormItem className="project-setting-grid">
            <FormLabel className="text-sm flex flex-col items-start gap-1">
              End Date
              <div className="text-muted-foreground">
                This would appear as the project end date (e.g. 12/01/2023)
              </div>
            </FormLabel>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <FormControl>
                  <CalendarPicker
                    disable={endDateDisable}
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
                      disabled={endDateDisable}
                      autoComplete="off"
                      placeholder="DD/MM/YYYY"
                      value={
                        field.value ? format(field.value, "MM/dd/yyyy") : ""
                      }
                    />
                    <Calendar autoFocus />
                  </CalendarPicker>
                </FormControl>
                <Button
                  disabled={isSubmitting}
                  type="button"
                  variant="link"
                  onClick={() =>
                    handleDisable(endDateDisable, setEndDateDisable, {
                      endDate: field.value,
                    })
                  }
                >
                  {endDateDisable ? "Edit" : "Save"}
                </Button>
              </div>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </>
  );
}
