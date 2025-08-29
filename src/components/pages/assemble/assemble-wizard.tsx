"use client";

import { Form } from "@/src/components/ui/form";
import { hasTrueValue } from "@/src/lib/utils";
import { fullWizardSchema } from "@/src/lib/validations";
import type { CreateFullWizardRequestInput } from "@/src/types";
import { useTeamMembers } from "@/src/use/hooks/use-team-members";
import { useTeams } from "@/src/use/hooks/use-teams";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ClientOnly } from "../../client-only";
import { Loader } from "../../loader";
import { NavigationBlocker } from "../../navigation-blocker";
import { AssembleButtons } from "./assemble-buttons";
import { AssembleDetails } from "./assemble-details";
import { AssembleMembers } from "./assemble-members";

export function AssembleWizard() {
  const { user } = useUser();
  const route = useRouter();
  const teamHooks = useTeams();
  const teamMemberHooks = useTeamMembers();
  const [step, setStep] = useState(1);

  const form = useForm<CreateFullWizardRequestInput>({
    resolver: zodResolver(fullWizardSchema),
    defaultValues: {
      name: "",
      description: "",
      leaderId: "",
      teamMembers: [],
    },
  });

  const isSubmitting =
    teamHooks.isCreatingTeam ||
    teamMemberHooks.isCreatingTeamMember ||
    form.formState.isSubmitting;

  function onReset() {
    form.reset();
    form.clearErrors();
    teamHooks.clearTeamErrors();
    teamMemberHooks.clearTeamMemberErrors();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }
  function onBackStep() {
    setStep((prev) => prev - 1);
  }

  async function onNextStep() {
    if (step === 1) {
      const result = await form.trigger(["name", "description"]);
      if (!result) return;
    }
    setStep((prev) => prev + 1);
  }

  async function onSubmit(values: CreateFullWizardRequestInput) {
    if (isSubmitting) return;

    try {
      const { name, description, leaderId } = values;
      const teamData = { name, description, leaderId };

      const team = await teamHooks.createTeam(teamData);
      if (!team.data[0].id) throw new Error("Failed to create team");
      const teamId = team.data[0].id;

      if (values.teamMembers.length > 0) {
        try {
          for (const member of values.teamMembers) {
            await teamMemberHooks.createTeamMember({
              roleId: member.roleId,
              userId: member.userId,
              teamId,
            });
          }
        } catch (error) {
          await teamHooks.deleteTeam(teamId);
          throw error;
        }
      }

      form.reset(structuredClone(values), { keepDirty: false });
      toast.success("Team created successfully!");
      route.push(`${team.data[0].id}/dashboard`);
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
        console.log("Submission error:", error);
      } else {
        toast.error("Unknown Error. Failed to create project");
        console.log("Submission error:", error);
      }
    }
  }

  function onError(error: unknown) {
    console.log("Submission error:", error);
  }

  useEffect(() => {
    if (user?.id) {
      form.setValue("leaderId", user.id);
    }
  }, [user, form]);

  const canLeave = isSubmitting || !hasTrueValue(form.formState.dirtyFields);

  console.log("is Submitted?:", form.formState.isSubmitted);
  console.log("can Leave?:", canLeave);
  return (
    <ClientOnly fallback={<Loader />}>
      <NavigationBlocker block={!canLeave} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          onReset={onReset}
          onKeyDown={onKeyDown}
          className="space-y-8 w-full"
        >
          <div className="flex flex-col gap-5">
            <div className={`${step === 1 ? "block" : "hidden"}`}>
              <AssembleDetails control={form.control} />
            </div>
            <div className={`${step === 2 ? "block" : "hidden"}`}>
              <AssembleMembers control={form.control} />
            </div>
          </div>

          <AssembleButtons
            currentStep={step}
            totalSteps={2}
            isSubmitting={isSubmitting}
            onNext={onNextStep}
            onBack={onBackStep}
            submitLabel={
              isSubmitting
                ? "Creating..."
                : form.watch("teamMembers").length === 0
                  ? "Skip"
                  : "Create Team"
            }
          />
        </form>
      </Form>
    </ClientOnly>
  );
}
