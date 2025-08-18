"use client";

import { X } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { useUIStore } from "../stores/ui-store";
import { useFetch } from "../use/hooks/use-fetch";
import { ImageHandler } from "./Image-handler";
import { Button } from "./ui/button";

type AssembleUserCard = {
  userId: string;
  removeHandler: () => void;
};

export function AssembleUserCard({ userId, removeHandler }: AssembleUserCard) {
  const { data, isFetching } = useFetch().users.useGetUserById(userId);
  const { setIsTeamMembersLoading } = useUIStore();
  const user = data[0];

  useEffect(() => {
    setIsTeamMembersLoading(isFetching);
  }, [isFetching, setIsTeamMembersLoading]);

  if (!user) {
    return notFound();
  }

  return (
    <div className="flex flex-row justify-between items-center w-full hover:bg-secondary py-2 px-4 rounded-md">
      <div className="flex flex-row gap-4">
        <div className="relative size-10 rounded-full overflow-clip shrink-0">
          <ImageHandler
            imageUrl={user.profileImageUrl as string}
            title="Profile Picture"
            fallbackUrl="/images/user-fallback.png"
          />
        </div>

        <div className="overflow-ellipsis flex flex-col">
          <span>{user.firstName}</span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
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
