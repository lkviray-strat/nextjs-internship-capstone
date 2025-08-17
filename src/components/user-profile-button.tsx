"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/server";

type UserProfileButtonProps = {
  user?: User | null;
  isMobile?: boolean;
};

export function UserProfileButton({ user, isMobile }: UserProfileButtonProps) {
  return (
    <SignedIn>
      {isMobile ? (
        <div className="w-full flex mb-3 flex-col shadow-lg bg-muted/90 p-3 pl-6 rounded-lg">
          <div className="relative line-clamp-1 items-center justify-center h-full -mb-2">
            <UserButton
              showName
              appearance={{
                variables: {
                  colorRing: "transparent",
                },
                elements: {
                  userButtonPopoverMain: "z-[10000] pointer-events-auto",
                  button: "z-10 w-[500px] justify-start",
                  userButtonBox: {
                    flexDirection: "row-reverse",
                  },
                  avatarBox: "size-15",
                  userButtonOuterIdentifier: "text-[18px] mb-5 ",
                },
              }}
            />
            <span className="absolute text-sm  z-0 min-w-0 bottom-2 overflow-ellipsis line-clamp-1 left-[75px] text-muted-foreground">
              {user?.emailAddresses[0].emailAddress}
            </span>
          </div>
        </div>
      ) : (
        <UserButton
          appearance={{
            elements: {
              userButtonPopoverCard: "shadow-2xl",
              userButtonAvatarBox: "size-8.5 border-black",
            },
          }}
        />
      )}
    </SignedIn>
  );
}
