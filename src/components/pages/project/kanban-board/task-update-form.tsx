"use client";

import { NavigationBlocker } from "@/src/components/navigation-blocker";
import { hasTrueValue } from "@/src/lib/utils";
import { updateTaskRequestSchema } from "@/src/lib/validations";
import type { Tasks, UpdateTaskRequestInput } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { useBoardStore } from "@/src/stores/board";
import { useTasks } from "@/src/use/hooks/use-tasks";
import type { SerializedEditorState } from "lexical";
import { TaskUpdateAssign } from "./task-update-assign";
import { TaskUpdateDate } from "./task-update-date";
import { TaskUpdateDetails } from "./task-update-details";
import { TaskUpdateSelects } from "./task-update-selects";

type TaskUpdateFormProps = {
  task: Tasks;
  setOpen: (open: boolean) => void;
};

export function TaskUpdateForm({ task, setOpen }: TaskUpdateFormProps) {
  const taskHooks = useTasks();
  const { currentBoardIds } = useBoardStore();

  const { teamId, projectId } = useParams<{
    teamId: string;
    projectId: string;
  }>();

  const form = useForm<UpdateTaskRequestInput>({
    resolver: zodResolver(updateTaskRequestSchema),
    defaultValues: {
      ...task,
      startDate: task.startDate,
      endDate: task.endDate,
      assigneeId: task.assigneeId as string,
      createdById: task.createdById as string,
      description: task.description as SerializedEditorState,
    },
  });

  const isSubmitting = taskHooks.isCreatingTask || form.formState.isSubmitting;
  const startDate = form.watch("startDate") ?? task.startDate;
  const endDate = form.watch("endDate") ?? task.endDate;

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
    toast.error("Unknown Error. Failed to update task");
    console.log("Submission error:", error);
  }

  async function onSubmit(values: UpdateTaskRequestInput) {
    if (isSubmitting) return;

    try {
      await taskHooks.updateTask({
        ...values,
        projectId: projectId,
        boardId: currentBoardIds[projectId] as string,
        teamId: teamId,
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
      toast.success("Task updated successfully!");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
        console.log("Submission error:", error);
      } else {
        toast.error("Unknown Error. Failed to update task");
        console.log("Submission error:", error);
      }
    }
  }

  useEffect(() => {
    if (projectId && teamId) {
      form.setValue("projectId", projectId);
    }
  }, [teamId, form, projectId]);

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
          <TaskUpdateDetails control={form.control} />
          <TaskUpdateAssign control={form.control} />

          <div className="flex flex-col lphone:flex-row gap-5 w-full">
            <TaskUpdateSelects control={form.control} />
          </div>
          <div className="flex flex-col lphone:flex-row gap-5">
            <TaskUpdateDate
              control={form.control}
              startDate={startDate}
              endDate={endDate}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2"
          >
            Update Task
          </Button>
        </div>
      </form>
    </Form>
  );
}
