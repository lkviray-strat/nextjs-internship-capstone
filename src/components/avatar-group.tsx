import { getUserInitials } from "../lib/utils";
import type { User } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type AvatarGroupProps = {
  users: User[];
  limit?: number;
};

export function AvatarGroup({ users, limit = 6 }: AvatarGroupProps) {
  const displayedUsers = users.slice(0, limit);
  const extraCount = users.length - limit;

  return (
    <div className="shrink-0 *:data-[slot=avatar]:ring-background flex -space-x-4 gap-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
      {displayedUsers.map((user) => (
        <Avatar key={user.id}>
          <AvatarImage
            src={user.profileImageUrl!}
            alt={`Profile picture of ${user.firstName}`}
          />
          <AvatarFallback>
            {getUserInitials(user.firstName!, user.lastName!)}
          </AvatarFallback>
        </Avatar>
      ))}

      {extraCount > 0 && (
        <Avatar>
          <AvatarFallback>+{extraCount}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
