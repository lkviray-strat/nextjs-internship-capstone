"use client";

import { useIsMobile } from "../hooks/use-mobile";
import { SidebarTrigger } from "./ui/sidebar";

export function MainNavbarTrigger() {
  const isMobile = useIsMobile();

  return <>{isMobile && <SidebarTrigger />}</>;
}
