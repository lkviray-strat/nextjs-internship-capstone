"use client";

import { getUserInitials } from "@/src/lib/utils";
import type { CreateTeamMemberRequestInput, User } from "@/src/types";
import { useFetch } from "@/src/use/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { UseControllerReturn } from "react-hook-form";
import { CommandSearch } from "../../search-command";
import { UserSearchSkeleton } from "../../states/skeleton-states";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

type TeamMemberCreateSearchProps = {
  setCount: (count: number) => void;
  field: UseControllerReturn<
    { teamMembers: CreateTeamMemberRequestInput[] },
    "teamMembers"
  >["field"];
};

function SearchRender({ member }: { member: User }) {
  return (
    <div className="flex flex-row gap-4">
      <div className="relative size-10 rounded-full overflow-clip shrink-0">
        <Avatar
          className="size-full"
          content={`${member.firstName} ${member.lastName}`}
        >
          <AvatarImage
            src={member.profileImageUrl as string}
            alt={`${member.firstName}'s Profile Picture`}
          />
          <AvatarFallback>
            {getUserInitials(member.firstName!, member.lastName!)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="overflow-ellipsis flex flex-col">
        <span>{member.firstName}</span>
        <span className="text-sm text-muted-foreground">{member.email}</span>
      </div>
    </div>
  );
}

export function TeamMemberCreateSearch({
  field,
  setCount,
}: TeamMemberCreateSearchProps) {
  const { user } = useUser();
  const fetch = useFetch();
  const { teamId } = useParams<{ teamId: string }>();
  const [search, setSearch] = useState("");

  const { data: teamMembers } = fetch.teamMembers.useGetMyTeamMembers(teamId);
  const { data: role } = fetch.roles.useGetRoleByDescLimitOffset(1, 1);
  const { data: searchResults, isLoading } = fetch.users.useGetUsersBySearch(
    search,
    8
  );

  useEffect(() => {
    setCount(field.value.length);
  }, [field.value.length, setCount]);

  if (!user || !role) return notFound();

  const filteredUsers =
    searchResults?.filter((member) => {
      const isNotInTeam = !teamMembers?.some((m) => m.userId === member.id);
      const isNotCurrentUser = user.id !== member.id;
      const isNotAlreadyAdded = !field.value.some(
        (m) => m.userId === member.id
      );
      return isNotInTeam && isNotCurrentUser && isNotAlreadyAdded;
    }) || [];

  return (
    <CommandSearch
      items={filteredUsers}
      isLoading={isLoading}
      fallback={<UserSearchSkeleton />}
      searchTerm={search}
      onSearchChange={setSearch}
      onItemSelect={(member) => {
        field.onChange([
          ...field.value,
          { userId: member.id, roleId: role[0].id, teamId },
        ]);
      }}
      placeholder="Search for team members..."
      emptyText="No Users Found"
      renderItem={(member) => <SearchRender member={member} />}
    />
  );
}
