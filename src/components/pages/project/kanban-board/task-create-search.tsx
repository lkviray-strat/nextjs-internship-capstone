"use client";

import { CommandSearch } from "@/src/components/search-command";
import { UserSearchSkeleton } from "@/src/components/states/skeleton-states";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { getUserInitials } from "@/src/lib/utils";
import type { CreateTaskRequestInput, User } from "@/src/types";
import { useFetch } from "@/src/use/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import type { UseControllerReturn } from "react-hook-form";

type TaskCreateSearchProps = {
  field: UseControllerReturn<CreateTaskRequestInput, "assigneeId">["field"];
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

export function TaskCreateSearch({ field }: TaskCreateSearchProps) {
  const { user } = useUser();
  const { teamId } = useParams<{ teamId: string }>();
  const [search, setSearch] = useState("");

  const { data: searchResults, isLoading } =
    useFetch().users.useGetUsersBySearchWithinTeamMembers(search, teamId, 8);

  if (!user || !teamId) return notFound();

  return (
    <CommandSearch
      items={searchResults || []}
      isLoading={isLoading}
      fallback={<UserSearchSkeleton />}
      searchTerm={search}
      onSearchChange={setSearch}
      limit={1}
      selectedItems={field.value ? [field.value] : []}
      onItemSelect={(member) => {
        field.onChange(member.id);
      }}
      placeholder="Search for assignees..."
      emptyText="No Users Found"
      renderItem={(member) => <SearchRender member={member} />}
    />
  );
}
