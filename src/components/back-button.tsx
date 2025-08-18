"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

type BackButtonProps = {
  children: React.ReactNode;
};

export function BackButton({ children }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={() => router.back()}
    >
      {children}
    </Button>
  );
}
