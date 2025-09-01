import { useTRPC } from "@/server/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useComments() {
  const [commentErrors, setCommentErrors] =
    useState<Record<string, string[]>>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createComment = useMutation(
    trpc.comments.createComment.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.comments.pathKey(),
        });
        setCommentErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setCommentErrors(parsed.fieldErrors);
        } catch {
          setCommentErrors({ global: [error.message] });
        }
      },
    })
  );

  const updateComment = useMutation(
    trpc.comments.updateComment.mutationOptions({
      onSuccess: async () => {
        queryClient.invalidateQueries({
          queryKey: trpc.comments.pathKey(),
        });
        setCommentErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setCommentErrors(parsed.fieldErrors);
        } catch {
          setCommentErrors({ global: [error.message] });
        }
      },
    })
  );

  const deleteComment = useMutation(
    trpc.comments.deleteComment.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.comments.pathKey(),
        });
        setCommentErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setCommentErrors(parsed.fieldErrors);
        } catch {
          setCommentErrors({ global: [error.message] });
        }
      },
    })
  );

  return {
    createComment: createComment.mutateAsync,
    isCreatingComment: createComment.isPending,
    updateComment: updateComment.mutateAsync,
    isUpdatingComment: updateComment.isPending,
    deleteComment: deleteComment.mutateAsync,
    isDeletingComment: deleteComment.isPending,
    commentErrors,
    clearCommentErrors: () => setCommentErrors({}),
  };
}
