"use client";

import { useState } from "react";
import type { UseControllerReturn } from "react-hook-form";
import type { CreateFullWizardRequestInput, User } from "../types";
import { useFetch } from "../use/hooks/use-fetch";
import { ImageHandler } from "./Image-handler";
import { CommandSearch } from "./search-command";
import { UserSearchSkeleton } from "./states/skeleton/user-search-skeleton";

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
        <ImageHandler
          imageUrl={member.profileImageUrl as string}
          title="Profile Picture"
          fallbackUrl="/images/user-fallback.png"
        />
      </div>

      <div className="overflow-ellipsis flex flex-col">
        <span>{member.firstName}</span>
        <span className="text-sm text-muted-foreground">{member.email}</span>
      </div>
    </div>
  );
}

export function AssembleSearch({ field }: AssembleSearchProps) {
  const [search, setSearch] = useState("");
  const { data: searchResults, isLoading } =
    useFetch().users.useGetUsersBySearch(search, 8);
  const { data: role } = useFetch().roles.useGetRoleByDescLimitOffset(1, 1);

  return (
    <CommandSearch
      items={
        searchResults?.filter(
          (member) => !field.value.some((m) => m.userId === member.id)
        ) || []
      }
      isLoading={isLoading}
      fallback={<UserSearchSkeleton />}
      searchTerm={search}
      onSearchChange={setSearch}
      onItemSelect={(member) => {
        field.onChange([
          ...field.value,
          { userId: member.id, roleId: role[0]?.id || "" },
        ]);
      }}
      placeholder="Search for team members..."
      emptyText="No Users Found"
      renderItem={(member) => <SearchRender member={member} />}
    />
  );
}
