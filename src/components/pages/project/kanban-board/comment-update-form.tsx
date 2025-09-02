"use client";

import { NavigationBlocker } from "@/src/components/navigation-blocker";
import {
  $isEmpty,
  hasTrueValue,
  sanitizeSerializedEditorState,
} from "@/src/lib/utils";
import { updateCommentRequestSchema } from "@/src/lib/validations";
import type { Comments, UpdateCommentRequestInput } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Comment } from "@/src/components/blocks/editor-00/comment";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { useComments } from "@/src/use/hooks/use-comments";
import type { EditorState, SerializedEditorState } from "lexical";

type CommentUpdateFormProps = {
  comment: Comments;
  setUpdateMode: (mode: boolean) => void;
};

export function CommentUpdateForm({
  comment,
  setUpdateMode,
}: CommentUpdateFormProps) {
  const commentHooks = useComments();
  const [editorState, setEditorState] = useState<EditorState | null>(null);

  const { teamId, projectId } = useParams<{
    teamId: string;
    projectId: string;
  }>();

  const form = useForm<UpdateCommentRequestInput>({
    resolver: zodResolver(updateCommentRequestSchema),
    defaultValues: {
      id: comment.id,
      taskId: comment.taskId as number,
      content: comment.content as SerializedEditorState,
    },
  });

  const isSubmitting =
    commentHooks.isCreatingComment || form.formState.isSubmitting;

  function onReset() {
    form.reset();
    form.clearErrors();
    commentHooks.clearCommentErrors();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  function onError(error: unknown) {
    toast.error("Unknown Error. Failed to update comment");
    console.log("Submission error:", error);
  }

  async function onSubmit(values: UpdateCommentRequestInput) {
    if (editorState && (isSubmitting || $isEmpty(editorState))) return;

    try {
      const sanitized = sanitizeSerializedEditorState(
        values.content as SerializedEditorState
      );

      await commentHooks.updateComment({
        ...values,
        teamId,
        projectId,
        content: sanitized,
      });

      commentHooks.clearCommentErrors();

      form.reset({
        content: sanitized,
        taskId: values.taskId,
        authorId: values.authorId,
      });
      form.resetField("content");

      setUpdateMode(false);
      toast.success("Comment updated successfully!");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
        console.log("Submission error:", error);
      } else {
        toast.error("Unknown Error. Failed to update comment");
        console.log("Submission error:", error);
      }
      setUpdateMode(false);
    }
  }

  return (
    <Form {...form}>
      <NavigationBlocker block={hasTrueValue(form.formState.dirtyFields)} />
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        onReset={onReset}
        onKeyDown={onKeyDown}
        className="space-y-8 w-full mt-2"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Comment
                  onChange={setEditorState}
                  isSubmitting={isSubmitting}
                  editorSerializedState={field.value as SerializedEditorState}
                  onSerializedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
