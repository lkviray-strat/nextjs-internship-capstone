"use client";

import {
  dateFormatter,
  getTimeAgo,
  getUserInitials,
  searchParamsToTeamMemberFilters,
  snakeToTitleCase,
} from "@/src/lib/utils";
import type { TeamMemberFilters } from "@/src/types";
import { useFetch } from "@/src/use/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { PermissionGate } from "../../permission-gate";
import { TeamTableEmpty } from "../../states/empty-states";
import { TeamTableError } from "../../states/error-states";
import { TeamTableSkeleton } from "../../states/skeleton-states";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { TableCell, TableRow } from "../../ui/table";
import { TeamTableRowDropdown } from "./team-table-row-dropdown";

type TeamTableRowListProps = {
  setFilters: (filters: Omit<TeamMemberFilters, "teamId">) => void;
  setTotalPages: (total: number) => void;
};

export function TeamTableRowList({
  setFilters,
  setTotalPages,
}: TeamTableRowListProps) {
  const fetch = useFetch();
  const { user: currentUser } = useUser();
  const { teamId } = useParams<{ teamId: string }>();

  const searchParams = useSearchParams();
  const teamMemberFilters = searchParamsToTeamMemberFilters(searchParams);

  const {
    data: teamMembers,
    isError,
    isLoading,
  } = fetch.teamMembers.useGetTeamMembersByFilter({
    ...teamMemberFilters,
    teamId,
  });

  const { pagesCount, perPage } = teamMembers?.pagination ?? {
    pagesCount: 0,
    perPage: 1,
  };

  const totalPages = Math.ceil(pagesCount / perPage);

  const withoutSelf = teamMembers?.members.filter(
    (member) => member.user.id !== (currentUser?.id as string)
  );

  const onlySelf = teamMembers?.members.filter(
    (member) => member.user.id === (currentUser?.id as string)
  );

  useEffect(() => {
    if (!isLoading) {
      setTotalPages(totalPages);
      setFilters(teamMemberFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (!teamId) return notFound();
  if (isLoading) return <TeamTableSkeleton />;
  if (isError) return <TeamTableError />;
  if (
    !teamMembers ||
    teamMembers.members.length === 0 ||
    !onlySelf ||
    onlySelf.length === 0
  )
    return <TeamTableEmpty />;

  return (
    <>
      <TableRow className="hover:bg-muted/50 bg-secondary/70 rounded-lg">
        <TableCell className="pl-4 py-3 flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage
              src={onlySelf[0].user.profileImageUrl as string}
              alt={`${onlySelf[0].user.firstName}`}
            />
            <AvatarFallback content={onlySelf[0].user.email}>
              {getUserInitials(
                onlySelf[0].user.firstName ?? "",
                onlySelf[0].user.lastName ?? ""
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col line-clamp-1">
            <span>
              {onlySelf[0].user.firstName} {onlySelf[0].user.lastName}
            </span>
            <span className="text-sm text-muted-foreground">
              {onlySelf[0].user.email}
            </span>
          </div>
        </TableCell>
        <TableCell className="px-4 py-3">
          {snakeToTitleCase(onlySelf[0].role?.name ?? "")}
        </TableCell>
        <TableCell className="px-4 py-3">
          {onlySelf[0].user.isActive ? (
            <span className="inline-flex gap-2 items-center">
              <div className="h-3 w-3 rounded-full bg-green-600" />
              Active
            </span>
          ) : (
            <p className="text-muted-foreground">
              {getTimeAgo(onlySelf[0].user.lastSeen)}
            </p>
          )}
        </TableCell>
        <TableCell className="px-4 py-3 text-muted-foreground">
          {dateFormatter.format(new Date(onlySelf[0].member.createdAt))}
        </TableCell>
        <TableCell className="px-4 py-3 text-right">
          <TeamTableRowDropdown member={onlySelf[0]} />
        </TableCell>
      </TableRow>

      {withoutSelf?.map((member) => {
        const { user, role, member: teamMember } = member;
        return (
          <TableRow
            key={teamMember.userId}
            className="hover:bg-muted/50"
          >
            <TableCell className="pl-4 py-3 flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage
                  src={user.profileImageUrl as string}
                  alt={`${user.firstName}`}
                />
                <AvatarFallback content={user.email}>
                  {getUserInitials(user.firstName ?? "", user.lastName ?? "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col line-clamp-1">
                <span>
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </TableCell>
            <TableCell className="px-4 py-3">
              {snakeToTitleCase(role?.name ?? "")}
            </TableCell>
            <TableCell className="px-4 py-3">
              {user.isActive ? (
                <span className="inline-flex gap-2 items-center">
                  <div className="h-3 w-3 rounded-full bg-green-600" />
                  Active
                </span>
              ) : (
                <p className="text-muted-foreground">
                  {getTimeAgo(user.lastSeen)}
                </p>
              )}
            </TableCell>
            <TableCell className="px-4 py-3 text-muted-foreground">
              {dateFormatter.format(new Date(teamMember.createdAt))}
            </TableCell>
            <TableCell className="px-4 py-3 text-right">
              <Suspense fallback={<Loader2 className="animate-spin" />}>
                <PermissionGate
                  userId={currentUser?.id ?? ""}
                  teamId={teamId ?? ""}
                  permissions={["delete:team_member"]}
                >
                  <TeamTableRowDropdown member={member} />
                </PermissionGate>
              </Suspense>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
}
