"use client";

import { Form } from "@/src/components/ui/form";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { fullWizardSchema } from "../lib/validations";
import type { CreateFullWizardRequestInput } from "../types";
import { useTeamMembers } from "../use/hooks/use-team-members";
import { useTeams } from "../use/hooks/use-teams";
import { AssembleButtons } from "./assemble-buttons";
import { AssembleDetails } from "./assemble-details";
import { AssembleMembers } from "./assemble-members";

export function AssembleWizard() {
  const { user } = useUser();
  const teamHooks = useTeams();
  const teamMemberHooks = useTeamMembers();
  const [step, setStep] = useState(1);
  const [mounted, setMounted] = useState(false);
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
    teamHooks.clearTeamErrors();
    teamMemberHooks.clearTeamMemberErrors();
    form.clearErrors();
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
    if (isSubmitting) {
      return;
    }
    try {
      const { name, description, leaderId } = values;
      const teamData = { name, description, leaderId };

      const team = await teamHooks.createTeam(teamData);

      if (!team.data[0].id) throw new Error("Failed to create team");

      if (values.teamMembers.length > 0) {
        const teamId = team.data[0].id;
        for (const member of values.teamMembers) {
          await teamMemberHooks.createTeamMember({
            roleId: member.roleId,
            userId: member.userId,
            teamId,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  function onError(error: unknown) {
    console.log("Submission error:", error);
    // Create Toast
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-11rem)] -mt-16 w-full">
        <Loader2 className="animate-spin size-20 text-muted-foreground" />
      </div>
    );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        onReset={onReset}
        className="space-y-8 w-full"
      >
        <div className="flex flex-col gap-5">
          {step === 1 && <AssembleDetails control={form.control} />}
          {step === 2 && <AssembleMembers control={form.control} />}
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
  );
}
