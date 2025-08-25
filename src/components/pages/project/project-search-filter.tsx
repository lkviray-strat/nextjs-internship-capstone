"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  projectFiltersToSearchParams,
  searchParamsToProjectFilters,
} from "../../../lib/utils";
import type { ProjectFilters } from "../../../types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { CreateProjectModal } from "../modals/create-project-modal";
import { ProjectFilterDropdown } from "./project-filter-dropdown";

export function ProjectSearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<Omit<ProjectFilters, "teamId">>({
    defaultValues: {
      search: "",
      page: 1,
      start: undefined,
      end: undefined,
      status: undefined,
      order: undefined,
    },
  });

  function onReset() {
    form.clearErrors();
  }

  function onError(error: unknown) {
    console.log("Submission error:", error);
  }

  function onSubmit(values: Omit<ProjectFilters, "teamId">) {
    const params = projectFiltersToSearchParams(values);
    router.push("?" + params.toString());
  }

  useEffect(() => {
    if (searchParams) {
      const filters = searchParamsToProjectFilters(searchParams);
      form.reset(filters);
    }
  }, [searchParams, form]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col sm:flex-row gap-x-2 gap-y-3 mb-10 sm:mb-8"
        onSubmit={form.handleSubmit(onSubmit, onError)}
        onReset={onReset}
      >
        <div className="sm:hidden">
          <CreateProjectModal />
        </div>

        <div className="relative flex-1">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="h-full">
                <FormControl>
                  <Input
                    placeholder="Search projects..."
                    className="w-full pl-11 pr-4 !py-2.5 h-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Search className="absolute size-5 left-3 top-1/2 -translate-y-1/2 z-10" />
        </div>

        <FormProvider {...form}>
          <ProjectFilterDropdown />
        </FormProvider>
      </form>
    </Form>
  );
}
