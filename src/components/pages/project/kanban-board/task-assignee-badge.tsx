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
    <div className="flex flex-row items-center h-full py-1.5">
      <div className="flex flex-row justify-between items-center h-full w-fit bg-accent rounded-2xl py-1 px-2 gap-2">
        <div className="flex flex-row gap-2 items-center justify-center">
          <div className="flex size-6 rounded-full overflow-clip shrink-0">
            <Avatar className="size-full">
              <AvatarImage
                src={user.profileImageUrl as string}
                alt={`${user.firstName}'s Profile Picture`}
                content={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback className="!text-[12px]">
                {getUserInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
          </div>

          <span className="text-[15px]">
            {user.firstName} {user.lastName}
          </span>
        </div>
        <Button
          type="button"
          onClick={removeHandler}
          variant="ghostDestructive"
          size="icon"
          className="!rounded-full !size-fit !p-1"
        >
          <X className="size-[13px]" />
        </Button>
      </div>
    </div>
  );
}
