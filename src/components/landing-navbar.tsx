import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { HoverUnderline } from "./hover-underline";
import { ThemeToggle } from "./theme-toggle";
import { buttonVariants } from "./ui/button";
import { UserProfileButton } from "./user-profile-button";

export function LandingNavbar() {
  return (
    <div className="hidden sm:flex justify-between items-center gap-10">
      <div className="flex items-center justify-center gap-7">
        <HoverUnderline>
          <Link
            href="/dashboard"
            className={`text-[16px] rounded-lg`}
          >
            Dashboard
          </Link>
        </HoverUnderline>

        <HoverUnderline>
          <Link
            href="/projects"
            className={`text-[16px] rounded-lg`}
          >
            Projects
          </Link>
        </HoverUnderline>
      </div>

      <div className="flex items-center justify-center gap-4">
        <UserProfileButton />

        <SignedOut>
          <Link
            href="/sign-in"
            className={`${buttonVariants({ variant: "default" })} !text-[16px] !rounded-2xl`}
          >
            Sign In
          </Link>
        </SignedOut>

        <ThemeToggle />
      </div>
    </div>
  );
}
