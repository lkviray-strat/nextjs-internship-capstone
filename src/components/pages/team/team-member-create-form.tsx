"use client";

import { NavigationBlocker } from "@/src/components/navigation-blocker";
import { hasTrueValue } from "@/src/lib/utils";
import { createTeamMemberRequestSchema } from "@/src/lib/validations";
import type { CreateTeamMemberRequestInput } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { useTeamMembers } from "@/src/use/hooks/use-team-members";
import z from "zod";
import { TeamMemberSearchEmpty } from "../../states/empty-states";
import { UserSearchSkeleton } from "../../states/skeleton-states";
import { Button } from "../../ui/button";
import { DialogFooter } from "../../ui/dialog";
import { AssembleUserCard } from "../assemble/assemble-user-card";
import { TeamMemberCreateSearch } from "./team-member-create-search";

type TeamMemberCreateFormProps = {
  setOpen: (open: boolean) => void;
  setCount: (count: number) => void;
};

export function TeamMemberCreateForm({
  setOpen,
  setCount,
}: TeamMemberCreateFormProps) {
  const teamMemberHooks = useTeamMembers();

  const form = useForm<{ teamMembers: CreateTeamMemberRequestInput[] }>({
    resolver: zodResolver(
      z.object({
        teamMembers: z.array(createTeamMemberRequestSchema),
      })
    ),
    defaultValues: {
      teamMembers: [],
    },
  });

  const isSubmitting =
    teamMemberHooks.isCreatingTeamMember ||
    form.formState.isSubmitting ||
    form.formState.isSubmitted;

  function onReset() {
    form.reset();
    form.clearErrors();
    teamMemberHooks.clearTeamMemberErrors();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  function onError(error: unknown) {
    toast.error("Unknown Error. Failed to create team member");
    console.log("Submission error:", error);
  }

  async function onSubmit(values: {
    teamMembers: CreateTeamMemberRequestInput[];
  }) {
    if (isSubmitting) return;

    try {
      for (const member of values.teamMembers) {
        await teamMemberHooks.createTeamMember(member);
      }

      teamMemberHooks.clearTeamMemberErrors();
      form.reset(structuredClone(values), { keepDirty: false });
      setOpen(false);
      toast.success("Team member/s added successfully!");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
        console.log("Submission error:", error);
      } else {
        toast.error("Unknown Error. Failed to add team member");
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
        <div className="flex flex-col gap-7">
          <FormField
            control={form.control}
            name="teamMembers"
            render={({ field }) => (
              <FormItem className="relative flex flex-col gap-2 min-h-[320px] space-y-0 items-start">
                <FormControl>
                  <TeamMemberCreateSearch
                    field={field}
                    setCount={setCount}
                  />
                </FormControl>
                <FormMessage />

                {field.value.length > 0 ? (
                  <div className="flex-1 flex flex-col my-1 gap-1 w-full max-h-[280px] overflow-auto">
                    {field.value.map((member, index) => (
                      <Suspense
                        key={index}
                        fallback={<UserSearchSkeleton count={1} />}
                      >
                        <AssembleUserCard
                          userId={member.userId}
                          removeHandler={() => {
                            field.onChange(
                              field.value.filter((_, i) => i !== index)
                            );
                          }}
                        />
                      </Suspense>
                    ))}
                  </div>
                ) : (
                  <TeamMemberSearchEmpty />
                )}
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <div className="flex flex-col w-full gap-2 self-end">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}
