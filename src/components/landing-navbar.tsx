import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { HoverUnderline } from "./hover-underline";
import { ThemeToggle } from "./theme-toggle";
import { buttonVariants } from "./ui/button";
import { UserProfileButton } from "./user-profile-button";

type LandingNavbar = {
  showNavs?: boolean;
  buttonHref: (path: string) => string;
};

export function LandingNavbar({ buttonHref, showNavs = true }: LandingNavbar) {
  return (
    <div className="hidden sm:flex justify-between items-center gap-10">
      {showNavs && (
        <div className="flex items-center justify-center gap-7">
          <HoverUnderline>
            <Link
              href="/assemble"
              className={`text-[16px] rounded-lg`}
            >
              Assemble
            </Link>
          </HoverUnderline>

          <HoverUnderline>
            <Link
              href={buttonHref("dashboard")}
              className={`text-[16px] rounded-lg`}
            >
              Dashboard
            </Link>
          </HoverUnderline>

          <HoverUnderline>
            <Link
              href={buttonHref("projects")}
              className={`text-[16px] rounded-lg`}
            >
              Projects
            </Link>
          </HoverUnderline>
        </div>
      )}

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
