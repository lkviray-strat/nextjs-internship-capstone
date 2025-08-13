import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { FolderOpen, Home, LogIn, MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button, buttonVariants } from "./ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, current: true },
  { name: "Projects", href: "/projects", icon: FolderOpen, current: true },
];

export async function LandingNavbarMenu() {
  const user = await currentUser();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <MenuIcon className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="[&>button]:hidden w-full h-full max-w-none overflow-visible z-[100] bg-card">
        <SheetHeader className="flex flex-row justify-between border-b">
          <SheetTitle className="text-2xl">eStratify</SheetTitle>
          <SheetClose className="[&>button]:hidden">
            <X className="h-5 w-5" />
          </SheetClose>
        </SheetHeader>
        <div className="flex flex-col justify-between p-5 px-5 h-full">
          <div className="flex flex-col gap-3">
            <SignedIn>
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
            </SignedIn>

            <SignedOut>
              <Link
                href="/sign-in"
                className={`flex items-center text-[18px] !p-4 !py-5.5 w-full justify-start
                    ${buttonVariants({ variant: "ghost" })}`}
              >
                <LogIn className="mr-3 size-6" /> Sign In
              </Link>
            </SignedOut>

            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center text-[18px] !p-4 !py-5.5 w-full justify-start
                    ${buttonVariants({ variant: "ghost" })}`}
                  >
                    <item.icon className="mr-3 size-6" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <ThemeToggle showFull />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
