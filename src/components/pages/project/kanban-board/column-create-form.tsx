"use client";

import { NavigationBlocker } from "@/src/components/navigation-blocker";
import { hasTrueValue } from "@/src/lib/utils";
import { createKanbanColumnRequestSchema } from "@/src/lib/validations";
import { useBoardStore } from "@/src/stores/board";
import type { CreateKanbanColumnRequestInput } from "@/src/types";
import { useFetch } from "@/src/use/hooks/use-fetch";
import { useKanbanColumns } from "@/src/use/hooks/use-kanban-columns";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import Color from "color";
import { KanbanColumnCreateDetails } from "./column-create-details";

type KanbanColumnCreateFormProps = {
  setOpen: (open: boolean) => void;
};

export function KanbanColumnCreateForm({
  setOpen,
}: KanbanColumnCreateFormProps) {
  const columnHooks = useKanbanColumns();
  const params = useParams();
  const fetch = useFetch();
  const { currentBoardId } = useBoardStore();
  const { user } = useUser();

  const teamId = params.teamId!.toString();
  const projectId = params.projectId!.toString();

  const { data: projects } = fetch.projects.useGetMyCurrentProject(
    projectId,
    teamId
  );

  const form = useForm<CreateKanbanColumnRequestInput>({
    resolver: zodResolver(createKanbanColumnRequestSchema),
    defaultValues: {
      name: "",
      order: 0,
      boardId: "",
      color: "#FFFFFF",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  function onReset() {
    form.reset();
    form.clearErrors();
    columnHooks.clearKanbanColumnErrors();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  function onError(error: unknown) {
    console.log("Submission error:", error);
  }

  async function onSubmit(values: CreateKanbanColumnRequestInput) {
    if (isSubmitting) return;

    try {
      const color = new Color(values.color || "#000000");

      await columnHooks.createKanbanColumn({
        ...values,
        teamId,
        projectId,
        color: color.hex().toString(),
      });

      columnHooks.clearKanbanColumnErrors();

      form.reset({
        name: values.name,
        order: values.order,
        boardId: values.boardId,
        color: values.color,
      });

      setOpen(false);
      toast.success("Kanban column created successfully!");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
        console.log("Submission error:", error);
      } else {
        toast.error("Unknown Error. Failed to create kanban column");
        console.log("Submission error:", error);
      }
    }
  }

  useEffect(() => {
    if (currentBoardId) {
      form.setValue("boardId", currentBoardId);
    } else {
      form.setValue("boardId", projects[0].defaultBoardId ?? "");
    }
  }, [user, teamId, form, currentBoardId, projects]);

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
          <KanbanColumnCreateDetails control={form.control} />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2"
          >
            Create Column
          </Button>
        </div>
      </form>
    </Form>
  );
}
