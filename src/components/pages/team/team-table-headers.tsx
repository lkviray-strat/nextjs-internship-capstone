import { TableHead, TableHeader, TableRow } from "../../ui/table";
import { TeamTableHeaderDropdown } from "./team-table-header-dropdown";

export function TeamTableHeaders() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[380px] pl-2">
          <TeamTableHeaderDropdown
            label="Name"
            paramKey="name"
          />
        </TableHead>
        <TableHead className="w-[150px]">
          <TeamTableHeaderDropdown
            label="Role"
            paramKey="role"
          />
        </TableHead>
        <TableHead className="w-[150px]">
          <TeamTableHeaderDropdown
            label="Last Active"
            paramKey="lastActive"
          />
        </TableHead>
        <TableHead className="w-[150px]">
          <TeamTableHeaderDropdown
            label="Date added"
            paramKey="dateAdded"
          />
        </TableHead>
        <TableHead className="w-[100px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
}
