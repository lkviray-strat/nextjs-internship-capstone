"use client";

import { NavigationBlocker } from "@/src/components/navigation-blocker";
import {
  $isEmpty,
  getUserInitials,
  hasTrueValue,
  sanitizeSerializedEditorState,
} from "@/src/lib/utils";
import { createCommentRequestSchema } from "@/src/lib/validations";
import type { CreateCommentRequestInput } from "@/src/types";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Comment,
  commentInitialValue,
} from "@/src/components/blocks/editor-00/comment";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { useComments } from "@/src/use/hooks/use-comments";
import type { EditorState, SerializedEditorState } from "lexical";

type CommentCreateFormProps = {
  taskId: number;
};

export function CommentCreateForm({ taskId }: CommentCreateFormProps) {
  const commentHooks = useComments();
  const { user } = useUser();

  const [nextId, setNextId] = useState<string>("");
  const [editorState, setEditorState] = useState<EditorState | null>(null);

  const { teamId, projectId } = useParams<{
    teamId: string;
    projectId: string;
  }>();

  const form = useForm<CreateCommentRequestInput>({
    resolver: zodResolver(createCommentRequestSchema),
    defaultValues: {
      content: commentInitialValue,
      taskId: taskId,
      authorId: user?.id ?? "",
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
    console.log("Submission error:", error);
  }

  async function onSubmit(values: CreateCommentRequestInput) {
    if (editorState && (isSubmitting || $isEmpty(editorState))) return;

    try {
      const sanitized = sanitizeSerializedEditorState(
        values.content as SerializedEditorState
      );
      await commentHooks.createComment({
        ...values,
        teamId,
        projectId,
        content: sanitized,
      });

      commentHooks.clearCommentErrors();

      setNextId(Date.now().toString());
      form.reset({
        content: commentInitialValue,
        taskId: values.taskId,
        authorId: values.authorId,
      });
      form.resetField("content");

      toast.success("You have commented successfully!");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
        console.log("Submission error:", error);
      } else {
        toast.error("Unknown Error. Failed to create comment");
        console.log("Submission error:", error);
      }
    }
  }

  useEffect(() => {
    if (user) {
      form.setValue("authorId", user.id);
    }
  }, [user, form]);

  return (
    <Form {...form}>
      <NavigationBlocker block={hasTrueValue(form.formState.dirtyFields)} />
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        onReset={onReset}
        onKeyDown={onKeyDown}
        className="space-y-8 w-full"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-4 w-full">
                <Avatar className="size-10 mt-2 shrink-0 hidden sm:block">
                  <AvatarImage
                    src={user?.imageUrl as string}
                    alt={`${user?.firstName}'s Profile Picture`}
                    content={`${user?.firstName} ${user?.lastName}`}
                  />
                  {user?.firstName && user?.lastName && (
                    <AvatarFallback className="!text-[12px]">
                      {getUserInitials(user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col w-full">
                  <FormControl>
                    <Comment
                      key={nextId}
                      onChange={setEditorState}
                      editorSerializedState={
                        field.value as SerializedEditorState
                      }
                      onSerializedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
