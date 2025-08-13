"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";

type ThemeToggleProps = {
  showFull?: boolean;
};

export function ThemeToggle({ showFull = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      {showFull ? (
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
          asChild
        >
          {theme === "light" ? (
            <span
              className="
            flex items-center text-[18px] !p-4 !py-5.5 w-full justify-start"
            >
              <Sun
                fill="foreground"
                className="size-5.5 mr-3"
              />
              Light Mode
            </span>
          ) : (
            <span
              className="
            flex items-center text-[18px] !p-4 !py-5.5 w-full justify-start"
            >
              <Moon
                fill="foreground"
                className="size-5.5 mr-3"
              />
              Dark Mode
            </span>
          )}
        </Button>
      ) : (
        <Button
          variant="secondaryGhost"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="text-foreground rounded-full !p-2"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Sun
              fill="foreground"
              className="size-5.5"
            />
          ) : (
            <Moon
              fill="foreground"
              className="size-5.5"
            />
          )}
        </Button>
      )}
    </>
  );
}
