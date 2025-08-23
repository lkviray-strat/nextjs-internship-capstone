"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

type BackButtonProps = {
  children: React.ReactNode;
  fallbackUrl?: string; // optional URL to navigate if user confirms
};

export function BackButton({ children, fallbackUrl = "/" }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
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
