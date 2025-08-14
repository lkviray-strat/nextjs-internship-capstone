import { Bell, Search } from "lucide-react";
import { MainNavbarTrigger } from "./main-navbar-trigger";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { UserProfileButton } from "./user-profile-button";

export function MainNavbar() {
  return (
    <nav className="sticky bg-background top-0 z-30 flex h-16 items-center gap-x-4 border-b px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
      <MainNavbarTrigger />
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search bar placeholder */}
        <div className="flex flex-1 items-center">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              size={16}
            />
            <input
              type="text"
              placeholder="Search projects, tasks..."
              className="pl-10 pr-4 py-2 w-full line-clamp-1 rounded-lg ring-ring focus:outline-hidden focus:ring-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-x-2 lg:gap-x-4">
          <Button
            variant="secondaryGhost"
            className="text-foreground rounded-full !p-2"
          >
            <Bell className="size-6" />
          </Button>

          <ThemeToggle />

          <UserProfileButton />
        </div>
      </div>
    </nav>
  );
}
