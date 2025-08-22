import type { useForm } from "react-hook-form";
import type { CreateProjectRequestInput } from "../../../types";
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

type ProjectFormDetailsProps = {
  control: ReturnType<typeof useForm<CreateProjectRequestInput>>["control"];
};

export function ProjectFormDetails({ control }: ProjectFormDetailsProps) {
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="space-y-0">
            <FormLabel>
              <RequiredLabel>Project Name</RequiredLabel>
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
        name="description"
        render={({ field }) => (
          <FormItem>
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
