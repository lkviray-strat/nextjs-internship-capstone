"use client";

import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { format } from "date-fns";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { usePreventForm } from "../hooks/use-preventform";
import { PROJECT_STATUS_CREATE_ENUM } from "../lib/db/enums";
import { snakeToTitleCase } from "../lib/utils";
import { createProjectRequestSchema } from "../lib/validations";
import { useUIStore } from "../stores/ui-store";
import { type CreateProjectRequestInput } from "../types";
import { useProjects } from "../use/hooks/use-projects";
import { CalendarPicker } from "./calendar-picker";
import { RequiredLabel } from "./required-label";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

export function ProjectCreateForm() {
  const route = useRouter();
  const projectHooks = useProjects();
  const pathName = usePathname();
  const { user } = useUser();
  const { teamId } = useParams();

  const { setIsCreateProjectDirty } = useUIStore();

  const form = useForm<CreateProjectRequestInput>({
    resolver: zodResolver(createProjectRequestSchema),
    defaultValues: {
      name: "",
      description: "",
      status: undefined,
      startDate: undefined,
      endDate: undefined,
      createdById: "",
      createdByTeamId: "",
      defaultBoardId: null,
    },
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const isSubmitting = form.formState.isSubmitting;

  function onReset() {
    form.reset();
    form.clearErrors();
    projectHooks.clearProjectErrors();
    setIsCreateProjectDirty(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  function onError(error: unknown) {
    console.log("Submission error:", error);
  }

  async function onSubmit(values: CreateProjectRequestInput) {
    if (isSubmitting) return;

    try {
      const project = await projectHooks.createProject(values);
      toast.success("Project created successfully!");
      route.push(`${pathName}/${project.data[0].id}`);
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
        console.log("Submission error:", error);
      } else {
        toast.error("Unknown Error. Failed to create project");
        console.log("Submission error:", error);
      }
    }
  }

  useEffect(() => {
    if (user?.id && teamId) {
      form.setValue("createdById", user?.id);
      form.setValue("createdByTeamId", teamId as string);
    }
  }, [user, teamId, form]);

  usePreventForm(form, setIsCreateProjectDirty);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        onReset={onReset}
        onKeyDown={onKeyDown}
        className="space-y-8 w-full"
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
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
            control={form.control}
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
          <div className="flex flex-col lphone:flex-row gap-5">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <RequiredLabel>Start Date</RequiredLabel>
                  </FormLabel>
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
                        value={
                          field.value ? format(field.value, "MM/dd/yyyy") : ""
                        }
                      />
                      <Calendar autoFocus />
                    </CalendarPicker>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <RequiredLabel>End Date</RequiredLabel>
                  </FormLabel>
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
                        value={
                          field.value ? format(field.value, "MM/dd/yyyy") : ""
                        }
                      />
                      <Calendar autoFocus />
                    </CalendarPicker>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-5"
          >
            Create Project
          </Button>
        </div>
      </form>
    </Form>
  );
}
