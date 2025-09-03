"use client";

import type { TeamMemberFilters } from "@/src/types";
import { useState } from "react";
import { Table, TableBody } from "../../ui/table";
import { TeamTableHeaders } from "./team-table-headers";
import { TeamTablePagination } from "./team-table-pagination";
import { TeamTableRowList } from "./team-table-row-list";

export function TeamTable() {
  const [filters, setFilters] = useState<Omit<TeamMemberFilters, "teamId">>();
  const [totalPages, setTotalPages] = useState(0);

  return (
    <>
      <Table className="h-full">
        <TeamTableHeaders />
        <TableBody>
          <TeamTableRowList
            setFilters={setFilters}
            setTotalPages={setTotalPages}
          />
        </TableBody>
      </Table>
      {filters && (
        <TeamTablePagination
          filters={filters}
          totalPages={totalPages}
        />
      )}
    </>
  );
}
