import { SignedIn, UserButton } from "@clerk/nextjs";

export function UserProfileButton() {
  return (
    <SignedIn>
      <UserButton
        appearance={{
          elements: {
            userButtonPopoverCard: "shadow-2xl",
            userButtonAvatarBox: "size-8.5 border-black",
          },
        }}
      />
    </SignedIn>
  );
}
