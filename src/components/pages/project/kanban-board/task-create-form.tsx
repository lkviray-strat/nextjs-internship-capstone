"use client";

import { NavigationBlocker } from "@/src/components/navigation-blocker";
import { hasTrueValue } from "@/src/lib/utils";
import { createTaskRequestSchema } from "@/src/lib/validations";
import type { CreateTaskRequestInput, KanbanColumns } from "@/src/types";
import { useFetch } from "@/src/use/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { useTasks } from "@/src/use/hooks/use-tasks";
import { TaskCreateAssign } from "./task-create-assign";
import { TaskCreateDate } from "./task-create-date";
import { TaskCreateDetails } from "./task-create-details";

type TaskCreateFormProps = {
  setOpen: (open: boolean) => void;
  column: KanbanColumns;
};

export function TaskCreateForm({ setOpen, column }: TaskCreateFormProps) {
  const taskHooks = useTasks();
  const params = useParams();
  const fetch = useFetch();

  const { user } = useUser();

  const teamId = params.teamId!.toString();
  const projectId = params.projectId!.toString();

  const form = useForm<CreateTaskRequestInput>({
    resolver: zodResolver(createTaskRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      kanbanColumnId: column.id,
      priority: "low",
      order: 0,
      projectId: projectId,
      createdById: user?.id ?? "",
      assigneeId: undefined,
      startDate: undefined,
      endDate: undefined,
      estimatedHours: undefined,
      taskNumber: 1,
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  function onReset() {
    form.reset();
    form.clearErrors();
    taskHooks.clearTaskErrors();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  function onError(error: unknown) {
    console.log("Submission error:", error);
  }

  async function onSubmit(values: CreateTaskRequestInput) {
    if (isSubmitting) return;

    try {
      await taskHooks.createTask({
        ...values,
        teamId,
      });

      taskHooks.clearTaskErrors();

      form.reset({
        title: values.title,
        description: values.description,
        kanbanColumnId: values.kanbanColumnId,
        priority: values.priority,
        order: values.order,
        projectId: values.projectId,
        createdById: values.createdById,
        assigneeId: values.assigneeId,
        startDate: values.startDate,
        endDate: values.endDate,
        estimatedHours: values.estimatedHours,
        taskNumber: values.taskNumber,
      });

      setOpen(false);
      toast.success("Task created successfully!");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
        console.log("Submission error:", error);
      } else {
        toast.error("Unknown Error. Failed to create task");
        console.log("Submission error:", error);
      }
    }
  }

  useEffect(() => {
    if (projectId && user && teamId) {
      form.setValue("projectId", projectId);
      form.setValue("createdById", user.id);
    }
  }, [user, teamId, form, projectId]);

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
          <TaskCreateDetails control={form.control} />
          <div className="flex flex-col lphone:flex-row gap-5">
            <TaskCreateDate
              control={form.control}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <TaskCreateAssign control={form.control} />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2"
          >
            Create Task
          </Button>
        </div>
      </form>
    </Form>
  );
}
