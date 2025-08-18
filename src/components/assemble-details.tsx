"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { useForm } from "react-hook-form";
import type { CreateFullWizardRequestInput } from "../types";

type AssembleDetailsProps = {
  control: ReturnType<typeof useForm<CreateFullWizardRequestInput>>["control"];
};

export function AssembleDetails({ control }: AssembleDetailsProps) {
  return (
    <>
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl md:text-5xl font-semibold">
          Setup team details
        </h1>
        <p className="text-md md:text-lg text-muted-foreground -mt-3 mb-5">
          Enter your team name and description to help members understand your
          team&apos;s purpose. You can update these details later.
        </p>
      </div>

      <div className="flex flex-col gap-7">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-col gap-2 space-y-0 items-start">
              <FormLabel className="flex text-[20px] shrink-0">
                Team Name<span className="-ml-1 text-red-500">*</span>
              </FormLabel>

              <FormControl>
                <div className="relative w-full">
                  <Input
                    key="text-input-0"
                    placeholder="Enter team name (e.g. 'Frontend Wizards')"
                    type="text"
                    id="name"
                    {...field}
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-col gap-2 space-y-0 items-start">
              <FormLabel className="flex text-[20px] shrink-0">
                Description
              </FormLabel>

              <FormControl>
                <Textarea
                  key="textarea-0"
                  id="description"
                  placeholder="Enter team description (e.g. 'We build awesome web apps')"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
