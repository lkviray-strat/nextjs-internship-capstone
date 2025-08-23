import type { Path, useForm } from "react-hook-form";
import { RequiredLabel } from "../../required-label";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";

type ProjectFields = {
  name?: string;
  description?: string;
};

type ProjectFormDetailsProps<T extends ProjectFields> = {
  notRequired?: boolean;
  nameWidth?: string;
  descriptionWidth?: string;
  control: ReturnType<typeof useForm<T>>["control"];
};

export function ProjectFormDetails<T extends ProjectFields>({
  control,
  nameWidth,
  descriptionWidth,
  notRequired,
}: ProjectFormDetailsProps<T>) {
  return (
    <>
      <FormField
        control={control}
        name={"name" as Path<T>}
        render={({ field }) => (
          <FormItem className={`${nameWidth}`}>
            <FormLabel>
              <RequiredLabel turnOff={notRequired}>Project Name</RequiredLabel>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter project name (e.g. Website Redesign)"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={"description" as Path<T>}
        render={({ field }) => (
          <FormItem className={`${descriptionWidth}`}>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter project description (e.g. This project aims to redesign the company website)"
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
