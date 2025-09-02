"use client";

import { usePathname } from "next/navigation";
import { projectFiltersToSearchParams } from "../../../lib/utils";
import type { ProjectFilters } from "../../../types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";

type ProjectPaginationProps = {
  filters: Omit<ProjectFilters, "teamId">;
  totalPages: number;
};

export function ProjectPagination({
  filters,
  totalPages,
}: ProjectPaginationProps) {
  const { page, ...otherFilters } = filters;
  const pathname = usePathname();

  const buildHref = (targetPage: number) => {
    const params = projectFiltersToSearchParams({
      ...otherFilters,
      page: targetPage,
    });
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination className="my-10">
      <PaginationContent>
        {page > 1 && (
          <>
            <PaginationItem>
              <PaginationPrevious href={buildHref(page - 1)} />
            </PaginationItem>

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

            <PaginationItem>
              <PaginationNext href={buildHref(page + 1)} />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}
