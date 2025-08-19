"use client";

import { Form } from "@/src/components/ui/form";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { usePreventForm } from "../hooks/use-preventform";
import { fullWizardSchema } from "../lib/validations";
import { useUIStore } from "../stores/ui-store";
import type { CreateFullWizardRequestInput } from "../types";
import { useTeamMembers } from "../use/hooks/use-team-members";
import { useTeams } from "../use/hooks/use-teams";
import { AssembleButtons } from "./assemble-buttons";
import { AssembleDetails } from "./assemble-details";
import { AssembleMembers } from "./assemble-members";
import { ClientOnly } from "./client-only";
import { Loader } from "./loader";

export function AssembleWizard() {
  const { user } = useUser();
  const route = useRouter();
  const teamHooks = useTeams();
  const teamMemberHooks = useTeamMembers();
  const { setIsCreateTeamDirty } = useUIStore();
  const [step, setStep] = useState(1);

  const isSubmitting =
    teamHooks.isCreatingTeam || teamMemberHooks.isCreatingTeamMember;

  const form = useForm<CreateFullWizardRequestInput>({
    resolver: zodResolver(fullWizardSchema),
    defaultValues: {
      name: "",
      description: "",
      leaderId: "",
      teamMembers: [],
    },
  });

  function onReset() {
    form.reset();
    form.clearErrors();
    teamHooks.clearTeamErrors();
    teamMemberHooks.clearTeamMemberErrors();
    setIsCreateTeamDirty(false);
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
      toast.success("Team created successfully!");
      route.push(`${team.data[0].id}/dashboard`);
    } catch (error) {
      toast.error("Unknown Error. Failed to create team");
      console.log("Submission error:", error);
    }
  }

  function onError(error: unknown) {
    toast.error("Unknown Error. Failed to create team");
    console.log("Submission error:", error);
  }

  useEffect(() => {
    const combinedErrors = {
      ...(teamHooks.teamErrors ?? {}),
      ...(teamMemberHooks.teamMemberErrors ?? {}),
    };

    Object.entries(combinedErrors).forEach(([field, messages]) => {
      messages.forEach((message) => {
        form.setError(field as keyof CreateFullWizardRequestInput, { message });
      });
    });
  }, [teamHooks.teamErrors, teamMemberHooks.teamMemberErrors, form]);

  useEffect(() => {
    if (user?.id) {
      form.setValue("leaderId", user.id);
    }
  }, [user, form]);

  usePreventForm(form, setIsCreateTeamDirty);

  return (
    <ClientOnly fallback={<Loader />}>
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
