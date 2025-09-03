"use client";

import { usePathname } from "next/navigation";
import { teamMemberFiltersToSearchParams } from "../../../lib/utils";
import type { TeamMemberFilters } from "../../../types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";

type TeamTablePaginationProps = {
  filters: Omit<TeamMemberFilters, "teamId">;
  totalPages: number;
};

export function TeamTablePagination({
  filters,
  totalPages,
}: TeamTablePaginationProps) {
  const { page, ...otherFilters } = filters;
  const pathname = usePathname();

  const buildHref = (targetPage: number) => {
    const params = teamMemberFiltersToSearchParams({
      ...otherFilters,
      page: targetPage,
    });
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination className="my-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildHref(page - 1)}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {page > 1 && (
          <>
            {page > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink
                isActive={false}
                href={buildHref(page - 1)}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationLink
            isActive
            href={buildHref(page)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>

        {page < totalPages && (
          <>
            <PaginationItem>
              <PaginationLink href={buildHref(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>

            {page < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href={buildHref(page + 1)}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
