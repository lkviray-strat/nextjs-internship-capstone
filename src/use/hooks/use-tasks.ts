import { useTRPC } from "@/server/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useTasks() {
  const [taskErrors, setTaskErrors] = useState<Record<string, string[]>>();
  const trpc = useTRPC();

  const createTask = useMutation(
    trpc.tasks.createTask.mutationOptions({
      onSuccess: () => {
        setTaskErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setTaskErrors(parsed.fieldErrors);
        } catch {
          setTaskErrors({ global: [error.message] });
        }
      },
    })
  );

  const updateTask = useMutation(
    trpc.tasks.updateTask.mutationOptions({
      onSuccess: async () => {
        setTaskErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setTaskErrors(parsed.fieldErrors);
        } catch {
          setTaskErrors({ global: [error.message] });
        }
      },
    })
  );

  const deleteTask = useMutation(
    trpc.tasks.deleteTask.mutationOptions({
      onSuccess: () => {
        setTaskErrors({});
      },
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message) as {
            fieldErrors?: Record<string, string[]>;
          };
          setTaskErrors(parsed.fieldErrors);
        } catch {
          setTaskErrors({ global: [error.message] });
        }
      },
    })
  );

  return {
    createTask: createTask.mutateAsync,
    isCreatingTask: createTask.isPending,
    updateTask: updateTask.mutateAsync,
    isUpdatingTask: updateTask.isPending,
    deleteTask: deleteTask.mutateAsync,
    isDeletingTask: deleteTask.isPending,
    taskErrors,
    clearTaskErrors: () => setTaskErrors({}),
  };
}
