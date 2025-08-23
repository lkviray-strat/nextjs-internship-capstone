"use client";

import { hasTrueValue } from "@/src/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateProjectRequestSchema } from "../../../lib/validations";
import { type Projects, type UpdateProjectRequestInput } from "../../../types";
import { useProjects } from "../../../use/hooks/use-projects";
import { ClientOnly } from "../../client-only";
import { Loader } from "../../loader";
import { NavigationBlocker } from "../../navigation-blocker";
import { Button } from "../../ui/button";
import { Form } from "../../ui/form";
import { ProjectFormDate } from "./project-form-date";
import { ProjectFormDetails } from "./project-form-details";
import { ProjectFormStatus } from "./project-form-status";

type ProjectUpdateFormProps = {
  project: Projects;
};

export function ProjectUpdateForm({ project }: ProjectUpdateFormProps) {
  const projectHooks = useProjects();
  const { teamId } = useParams();

  const form = useForm<UpdateProjectRequestInput>({
    resolver: zodResolver(updateProjectRequestSchema),
    defaultValues: {
      id: project.id,
      name: project.name,
      description: project.description ?? undefined,
      status: project.status,
      startDate: project.startDate!,
      endDate: project.endDate!,
    },
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const isSubmitting = form.formState.isSubmitting;
  console.log("dirty fields: ", form.formState.dirtyFields);
  console.log("isdirty", form.formState.isDirty);
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

  async function onSubmit(values: UpdateProjectRequestInput) {
    if (isSubmitting) return;
    const id = teamId as string;

    try {
      const newProject = await projectHooks.updateProject({
        teamId: id,
        ...values,
      });

      form.reset({
        id: newProject.data[0].id,
        name: newProject.data[0].name,
        description: newProject.data[0].description ?? undefined,
        status: newProject.data[0].status,
        startDate: newProject.data[0].startDate!,
        endDate: newProject.data[0].endDate!,
      });

      projectHooks.clearProjectErrors();

      toast.success("Project updated successfully!");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
        console.log("Submission error:", error);
      } else {
        toast.error("Unknown Error. Failed to update project");
        console.log("Submission error:", error);
      }
    }
  }

  useEffect(() => {
    if (teamId) {
      form.setValue("createdByTeamId", teamId as string);
    }
  }, [teamId, form]);

  return (
    <ClientOnly fallback={<Loader />}>
      <Form {...form}>
        <NavigationBlocker block={hasTrueValue(form.formState.dirtyFields)} />
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          onReset={onReset}
          onKeyDown={onKeyDown}
          className="space-y-8 w-full pl-1"
        >
          <div className="flex flex-col gap-5">
            <ProjectFormDetails
              control={form.control}
              nameWidth="w-full sm:w-[400px]"
              descriptionWidth="w-full sm:w-[600px]"
              notRequired={true}
            />
            <div className="flex flex-col lphone:flex-row gap-5">
              <ProjectFormDate
                control={form.control}
                startDate={startDate}
                endDate={endDate}
                notRequired={true}
              />
            </div>
            <ProjectFormStatus
              control={form.control}
              selectWidth="w-full sm:w-[300px]"
              notRequired={true}
            />

            <div className="flex w-full sm:w-fit">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-5"
              >
                Update Project
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </ClientOnly>
  );
}
