"use client";

import { getUserInitials } from "@/src/lib/utils";
import type { CreateFullWizardRequestInput, User } from "@/src/types";
import { useFetch } from "@/src/use/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { useState } from "react";
import type { UseControllerReturn } from "react-hook-form";
import { CommandSearch } from "../../search-command";
import { UserSearchSkeleton } from "../../states/skeleton-states";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

type AssembleSearchProps = {
  field: UseControllerReturn<
    CreateFullWizardRequestInput,
    "teamMembers"
  >["field"];
};

function SearchRender({ member }: { member: User }) {
  return (
    <div className="flex flex-row gap-4">
      <div className="relative size-10 rounded-full overflow-clip shrink-0">
        <Avatar className="size-full">
          <AvatarImage
            src={member.profileImageUrl as string}
            alt={`${member.firstName}'s Profile Picture`}
          />
          <AvatarFallback content={member.email}>
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

export function AssembleSearch({ field }: AssembleSearchProps) {
  const { user } = useUser();
  const [search, setSearch] = useState("");

  const { data: role } = useFetch().roles.useGetRoleByDescLimitOffset(1, 1);
  const { data: searchResults, isLoading } =
    useFetch().users.useGetUsersBySearch(search, 8);

  if (!user || !role) return notFound();

  const filteredUsers =
    searchResults?.filter((member) => {
      const isNotCurrentUser = user.id !== member.id;
      const isNotAlreadyAdded = !field.value.some(
        (m) => m.userId === member.id
      );
      return isNotCurrentUser && isNotAlreadyAdded;
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
          { userId: member.id, roleId: role[0].id },
        ]);
      }}
      placeholder="Search for team members..."
      emptyText="No Users Found"
      renderItem={(member) => <SearchRender member={member} />}
    />
  );
}
