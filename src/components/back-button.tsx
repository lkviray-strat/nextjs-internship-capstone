"use client";

import { useRouter } from "next/navigation";
import { useUIStore } from "../stores/ui-store";
import { Button } from "./ui/button";

type BackButtonProps = {
  children: React.ReactNode;
  fallbackUrl?: string; // optional URL to navigate if user confirms
};

export function BackButton({ children, fallbackUrl = "/" }: BackButtonProps) {
  const router = useRouter();
  const { isCreateTeamDirty, setIsCreateTeamDirty } = useUIStore();

  const handleClick = () => {
    if (isCreateTeamDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
      setIsCreateTeamDirty(false);
    }

    router.push(fallbackUrl);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}
