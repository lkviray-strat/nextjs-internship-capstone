"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import type { CreateFullWizardRequestInput } from "../types";
import { AssembleSearch } from "./assemble-search";
import { AssembleUserCard } from "./assemble-user-card";
import { UserSearchSkeleton } from "./states/skeleton/user-search-skeleton";

type AssembleMembersProps = {
  control: ReturnType<typeof useForm<CreateFullWizardRequestInput>>["control"];
};

export function AssembleMembers({ control }: AssembleMembersProps) {
  return (
    <>
      <div className="flex flex-col gap-5">
        <h1 className="text-5xl font-semibold">Assemble the team</h1>
        <p className="text-lg text-muted-foreground -mt-3 mb-5">
          Invite your teammates by entering their email addresses. Assign roles
          to each member to define their responsibilities.
        </p>
      </div>

      <div className="flex flex-col gap-7">
        <FormField
          control={control}
          name="teamMembers"
          render={({ field }) => (
            <FormItem className="relative flex-col gap-2 space-y-0 items-start">
              <FormLabel className="flex text-[20px] shrink-0">
                Team Members
              </FormLabel>

              <FormControl>
                <AssembleSearch field={field} />
              </FormControl>
              <FormMessage />

              {field.value.length > 0 && (
                <div className="flex flex-col my-1 gap-1 w-full max-h-[280px] overflow-auto">
                  {field.value.map((member, index) => (
                    <Suspense
                      key={member.userId}
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
              )}
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
