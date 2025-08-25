"use client";

import { PROJECT_STATUS_ENUM } from "@/src/lib/db/enums";
import { Filter } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { ProjectFilters } from "../../../types";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { ProjectFilterCheckboxes } from "./project-filter-checkboxes";
import { ProjectFilterDate } from "./project-filter-date";
import { ProjectFilterSelects } from "./project-filter-selects";

export function ProjectFilterDropdown() {
  const form = useFormContext<Omit<ProjectFilters, "teamId">>();
  const [resetKey, setResetKey] = useState(0);

  const start = form.watch("start") as Date;
  const end = form.watch("end") as Date;

  function handleOpenChange(open: boolean) {
    if (!open && form.formState.isDirty) {
      form.resetField("start");
      form.resetField("end");
      form.resetField("status");
      form.resetField("order");
    }
  }

  function handleResetButtonClick() {
    form.reset({
      start: undefined,
      end: undefined,
      status: undefined,
      order: undefined,
    });

    setResetKey((prev) => prev + 1);
    triggerFormSubmission();
  }

  function triggerFormSubmission() {
    const parentForm = document.querySelector("form");
    if (parentForm) {
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      parentForm.dispatchEvent(submitEvent);
    }
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="!px-4 !py-[20px] !inline-flex !items-center text-[15px]"
        >
          <Filter className="size-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="mt-1 max-w-[350px]"
      >
        <DropdownMenuLabel className="flex justify-between px-3">
          Filter Projects
          <Button
            type="button"
            variant="link"
            onClick={() => handleResetButtonClick()}
            size="icon"
            className="!py-0 !h-fit"
          >
            Reset
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex flex-col px-3 py-3 gap-4 pb-4">
          <ProjectFilterSelects
            key={`sort-${resetKey}`}
            control={form.control}
            items={["asc", "desc"]}
            itemsBeingShown={["Ascending", "Descending"]}
            label="Sort By"
            name="order"
          />
          <ProjectFilterCheckboxes
            key={`status-${resetKey}`}
            control={form.control}
            items={[...PROJECT_STATUS_ENUM]}
            name="status"
          />
          <ProjectFilterDate
            key={`date-${resetKey}`}
            startDate={start}
            endDate={end}
            control={form.control}
          />
          <Button
            type="button"
            onClick={triggerFormSubmission}
            className="!py-3 w-full"
          >
            Apply Filters
          </Button>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
