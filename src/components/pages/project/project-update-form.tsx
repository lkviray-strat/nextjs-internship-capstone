"use client";

import { hasTrueValue } from "@/src/lib/utils";
import { useFetch } from "@/src/use/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateProjectRequestSchema } from "../../../lib/validations";
import { type UpdateProjectRequestInput } from "../../../types";
import { useProjects } from "../../../use/hooks/use-projects";
import { ClientOnly } from "../../client-only";
import { Loader } from "../../loader";
import { NavigationBlocker } from "../../navigation-blocker";
import { Form } from "../../ui/form";
import { ProjectUpdateDanger } from "./project-update-danger";
import { ProjectUpdateDates } from "./project-update-date";
import { ProjectUpdateDetails } from "./project-update-details";
import { ProjectUpdateStatus } from "./project-update-status";

export function ProjectUpdateForm() {
  const projectHooks = useProjects();
  const router = useRouter();
  const fetch = useFetch();
  const { teamId, projectId } = useParams<{
    teamId: string;
    projectId: string;
  }>();

  const { data: project } = fetch.projects.useGetMyCurrentProject(
    projectId,
    teamId
  );

  const form = useForm<UpdateProjectRequestInput>({
    resolver: zodResolver(updateProjectRequestSchema),
    defaultValues: {
      id: project[0].id,
      name: project[0].name,
      description: project[0].description ?? undefined,
      status: project[0].status,
      startDate: project[0].startDate!,
      endDate: project[0].endDate!,
    },
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const isSubmitting = projectHooks.isUpdatingProject;
  const isProjectArchived = project[0].status === "archived";

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

  async function onSubmit(values: Omit<UpdateProjectRequestInput, "id">) {
    if (isSubmitting) return;
    const id = teamId;

    try {
      const newValues = { ...values, id: projectId };
      const newProject = await projectHooks.updateProject({
        teamId: id,
        ...newValues,
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

  const handleRestore = () => {
    onSubmit({ status: "active" });
    router.refresh();
  };

  return (
    <ClientOnly fallback={<Loader />}>
      <Form {...form}>
        <NavigationBlocker block={hasTrueValue(form.formState.dirtyFields)} />
        <form
          onError={onError}
          onReset={onReset}
          onKeyDown={onKeyDown}
          className="space-y-8 w-full pl-1 pb-20"
        >
          <fieldset disabled={isProjectArchived}>
            <div className="grid grid-cols-1 divide-y divide-y-border items-start">
              <span className="pb-2 font-bold">Project Details</span>
              <ProjectUpdateDetails
                control={form.control}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
              />
              <ProjectUpdateDates
                control={form.control}
                onSubmit={onSubmit}
                startDate={startDate}
                endDate={endDate}
                isSubmitting={isSubmitting}
              />
              <ProjectUpdateStatus
                control={form.control}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </fieldset>

          {isProjectArchived ? (
            <div className="flex flex-col gap-3">
              <ProjectUpdateDanger
                modal={false}
                label="Restore this project"
                description="Restoring an archived project will move it back to your
                    active projects list. You can always archive it again later
                    if needed. No data will be lost, and this action is
                    reversible at any time."
                onSubmit={handleRestore}
                isSubmitting={isSubmitting}
                variant="default"
              />
              <ProjectUpdateDanger
                id={projectId}
                label="Delete this project"
                description=" Deleting a project will permanently remove it from your
                    account and cannot be undone. All associated data will be
                    lost. Please confirm that you want to delete this project."
                variant="destructive"
              />
            </div>
          ) : (
            <ProjectUpdateDanger
              id={projectId}
              label="Archive this project?"
              description="Archiving a project will remove it from your active projects list. You can still view archived projects, and restore them. This action does not delete any data and can be reversed at any time."
              variant="archive"
            />
          )}
        </form>
      </Form>
    </ClientOnly>
  );
}
