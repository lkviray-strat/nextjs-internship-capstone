import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { buttonVariants } from "./ui/button";

export function LandingNavbar() {
  return (
    <>
      <Link
        href="/dashboard"
        className={`${buttonVariants({ variant: "ghost" })} !p-3 !text-[16px] !rounded-lg -mr-1`}
      >
        Dashboard
      </Link>
      <Link
        href="/projects"
        className={`${buttonVariants({ variant: "ghost" })} !p-3 !text-[16px] !rounded-lg`}
      >
        Projects
      </Link>

      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "size-8.5 border-black",
            },
          }}
        />
      </SignedIn>

      <SignedOut>
        <Link
          href="/sign-in"
          className={`${buttonVariants({ variant: "default" })} !text-[16px] !rounded-2xl`}
        >
          Sign In
        </Link>
      </SignedOut>

      <ThemeToggle />
    </>
  );
}
