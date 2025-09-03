"use client";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import type { orderType, TeamMemberFilters } from "@/src/types";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type TeamTableHeaderDropdownProps = {
  label: string;
  paramKey: keyof TeamMemberFilters;
};

export function TeamTableHeaderDropdown({
  label,
  paramKey,
}: TeamTableHeaderDropdownProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSortingChange = (
    key: keyof TeamMemberFilters,
    order: orderType
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.forEach((_, key) => {
      if (key !== "search" && key !== "page") {
        params.delete(key);
      }
    });
    if (searchParams.get(key) === order) {
      params.delete(key);
    } else {
      params.set(key, order);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="w-fit -ml-1"
          size="sm"
          variant="none"
        >
          <span>{label}</span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="bottom"
        onClick={handlePropagation}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={`${searchParams.get(paramKey) === "asc" ? "bg-accent" : ""}`}
            onClick={() => handleSortingChange(paramKey, "asc")}
          >
            <ArrowUpIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
            Ascending
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`${searchParams.get(paramKey) === "desc" ? "bg-accent" : ""}`}
            onClick={() => handleSortingChange(paramKey, "desc")}
          >
            <ArrowDownIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
            Descending
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
