"use client";

import { hasTrueValue } from "@/src/lib/utils";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createProjectRequestSchema } from "../../../lib/validations";
import { type CreateProjectRequestInput } from "../../../types";
import { useProjects } from "../../../use/hooks/use-projects";
import { NavigationBlocker } from "../../navigation-blocker";
import { Button } from "../../ui/button";
import { Form } from "../../ui/form";
import { ProjectFormDate } from "./project-form-date";
import { ProjectFormDetails } from "./project-form-details";
import { ProjectFormStatus } from "./project-form-status";

export function ProjectCreateForm() {
  const route = useRouter();
  const projectHooks = useProjects();
  const pathName = usePathname();
  const { user } = useUser();
  const { teamId } = useParams();

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

      projectHooks.clearProjectErrors();

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

  return (
    <Form {...form}>
      <NavigationBlocker block={hasTrueValue(form.formState.dirtyFields)} />
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        onReset={onReset}
        onKeyDown={onKeyDown}
        className="space-y-8 w-full"
      >
        <div className="flex flex-col gap-5">
          <ProjectFormDetails control={form.control} />
          <div className="flex flex-col lphone:flex-row gap-5">
            <ProjectFormDate
              control={form.control}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <ProjectFormStatus control={form.control} />

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
