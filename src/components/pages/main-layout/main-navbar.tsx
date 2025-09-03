import { ThemeToggle } from "../../theme-toggle";
import { UserProfileButton } from "../../user-profile-button";
import { MainNavbarTrigger } from "./main-navbar-trigger";

export function MainNavbar() {
  return (
    <nav className="sticky shrink-0 bg-background top-0 z-30 flex h-16 items-center gap-x-4 border-b px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
      <MainNavbarTrigger />
      <div className="flex flex-1 gap-x-4 justify-end lg:gap-x-6">
        <div className="flex items-center gap-x-2 lg:gap-x-4">
          <ThemeToggle />

          <UserProfileButton />
        </div>
      </div>
    </nav>
  );
}
