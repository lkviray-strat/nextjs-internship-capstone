"use client";

import { NavigationBlocker } from "@/src/components/navigation-blocker";
import { hasTrueValue } from "@/src/lib/utils";
import { updateKanbanColumnRequestSchema } from "@/src/lib/validations";
import type {
  KanbanColumns,
  UpdateKanbanColumnRequestInput,
} from "@/src/types";
import { useKanbanColumns } from "@/src/use/hooks/use-kanban-columns";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import Color from "color";
import { KanbanColumnUpdateDetails } from "./column-update-details";

type KanbanColumnUpdateFormProps = {
  column: KanbanColumns;
  setOpen: (open: boolean) => void;
};

export function KanbanColumnUpdateForm({
  setOpen,
  column,
}: KanbanColumnUpdateFormProps) {
  const columnHooks = useKanbanColumns();
  const { teamId, projectId } = useParams<{
    teamId: string;
    projectId: string;
  }>();

  const form = useForm<UpdateKanbanColumnRequestInput>({
    resolver: zodResolver(updateKanbanColumnRequestSchema),
    defaultValues: {
      id: column.id,
      name: column.name,
      color: column.color ?? "#FFFFFF ",
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

  async function onSubmit(values: UpdateKanbanColumnRequestInput) {
    if (isSubmitting) return;

    try {
      const color = new Color(values.color || "#FFFFFF");

      await columnHooks.updateKanbanColumn({
        ...values,
        teamId,
        projectId,
        color: color.hex().toString(),
      });

      columnHooks.clearKanbanColumnErrors();

      form.reset({
        name: values.name,
        color: values.color,
      });

      setOpen(false);
      toast.success("Kanban column updated successfully!");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
        console.log("Submission error:", error);
      } else {
        toast.error("Unknown Error. Failed to update kanban column");
        console.log("Submission error:", error);
      }
    }
  }

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
          <KanbanColumnUpdateDetails control={form.control} />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2"
          >
            Update Column
          </Button>
        </div>
      </form>
    </Form>
  );
}
