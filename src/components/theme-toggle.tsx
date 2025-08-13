"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="secondaryGhost"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="text-foreground rounded-full !p-2"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon
          fill="foreground"
          className="size-5.5"
        />
      ) : (
        <Sun
          fill="foreground"
          className="size-5.5"
        />
      )}
    </Button>
  );
}
