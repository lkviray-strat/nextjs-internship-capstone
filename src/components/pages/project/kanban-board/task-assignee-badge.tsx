"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { getUserInitials } from "@/src/lib/utils";
import { useUIStore } from "@/src/stores/ui-store";
import { useFetch } from "@/src/use/hooks/use-fetch";
import { X } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect } from "react";

type TaskAssigneeBadgeProps = {
  userId: string;
  removeHandler: () => void;
};

export function TaskAssigneeBadge({
  userId,
  removeHandler,
}: TaskAssigneeBadgeProps) {
  const { data, isFetching } = useFetch().users.useGetUserById(userId);
  const { setIsTeamMembersLoading } = useUIStore();
  const user = data[0];

  useEffect(() => {
    setIsTeamMembersLoading(isFetching);
  }, [isFetching, setIsTeamMembersLoading]);

  if (!user || !user.firstName || !user.lastName) {
    return notFound();
  }

  return (
    <div className="flex flex-row justify-between items-center w-fit bg-accent py-2 px-4 rounded-md">
      <div className="flex flex-row gap-4">
        <div className="relative size-10 rounded-full overflow-clip shrink-0">
          <Avatar className="size-full">
            <AvatarImage
              src={user.profileImageUrl as string}
              alt={`${user.firstName}'s Profile Picture`}
              content={`${user.firstName} ${user.lastName}`}
            />
            <AvatarFallback>
              {getUserInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="overflow-ellipsis flex flex-col">
          <span>
            {user.firstName} {user.lastName}
          </span>
        </div>
      </div>
      <Button
        type="button"
        onClick={removeHandler}
        variant="ghostDestructive"
        size="icon"
        className="!rounded-full"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
