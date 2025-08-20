"use client";

import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { usePreventForm } from "../hooks/use-preventform";
import { createProjectRequestSchema } from "../lib/validations";
import { useUIStore } from "../stores/ui-store";
import { type CreateProjectRequestInput } from "../types";
import { useProjects } from "../use/hooks/use-projects";
import { CalendarPicker } from "./calendar-picker";
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
      status: "planning",
      startDate: undefined,
      endDate: undefined,
      createdById: "",
      createdByTeamId: "",
      defaultBoardId: null,
    },
  });

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
    toast.error("Unknown Error. Failed to create project");
    console.log("Submission error:", error);
  }

  const isSubmitting = true;

  async function onSubmit(values: CreateProjectRequestInput) {
    if (isSubmitting) return;

    try {
      const project = await projectHooks.createProject(values);
      toast.success("Project created successfully!");
      route.push(`${pathName}/projects/${project.data[0].id}`);
    } catch (error) {
      toast.error("Unknown Error. Failed to create project");
      console.log("Submission error:", error);
    }
  }

  useEffect(() => {
    if (user?.id && teamId) {
      form.setValue("createdById", user?.id);
      form.setValue("createdByTeamId", teamId as string);
    }
  }, [user, teamId, form]);

  usePreventForm(form, setIsCreateProjectDirty);

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

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
                  Project Name <span className="-ml-1 text-red-500">*</span>
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
          <div className="flex flex-row gap-5">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
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
                <FormItem>
                  <FormLabel>End Date</FormLabel>
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
        </div>
      </form>
    </Form>
  );
}
