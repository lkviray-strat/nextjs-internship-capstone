"use client";

import {
  BarChart3,
  Calendar,
  FolderOpen,
  Home,
  Settings,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/src/components/ui/sidebar";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useIsMobile } from "../../../hooks/use-mobile";
import { useFetch } from "../../../use/hooks/use-fetch";
import { MainSidebarDropdown } from "./main-sidebar-dropdown";

const navigation = [
  { name: "Dashboard", href: "dashboard", icon: Home },
  { name: "Projects", href: "projects", icon: FolderOpen },
  { name: "Team", href: "team", icon: Users },
  { name: "Analytics", href: "analytics", icon: BarChart3 },
  { name: "Calendar", href: "calendar", icon: Calendar },
  { name: "Settings", href: "settings", icon: Settings },
];

export function MainSidebar() {
  const { teamId } = useParams();
  const { data } = useFetch().teams.useGetMyTeams();
  const { open, setOpenMobile } = useSidebar();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const isMobile = useIsMobile();
  const pathname = usePathname();
  const secondSegment = pathname?.split("/").filter(Boolean)[1];

  useEffect(() => {
    if (isMobile) {
      setIsOpen(isMobile);
      setOpenMobile(isMobile);
    } else {
      setIsOpen(open);
    }
  }, [open, isMobile, setOpenMobile]);

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
    >
      <SidebarContent>
        <SidebarGroup>
          {isOpen ? (
            <SidebarHeader className="flex flex-row justify-between pl-7">
              <Link
                href="/"
                className="text-2xl font-bold"
              >
                eStratify
              </Link>
              <SidebarTrigger />
            </SidebarHeader>
          ) : (
            <SidebarHeader>
              <SidebarTrigger className="-ml-1" />
            </SidebarHeader>
          )}
          <SidebarContent>
            <SidebarSeparator className="my-2.5" />
            <SidebarMenu className={`mt-3 ${isOpen ? "px-3" : ""}`}>
              <SidebarMenuItem className="mb-3">
                <MainSidebarDropdown
                  teams={data}
                  isOpen={isOpen}
                />
              </SidebarMenuItem>
              <ul className={`${isOpen ? "space-y-1" : "space-y-3"}`}>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={secondSegment === item.href}
                    >
                      <Link
                        href={`/${teamId}/${item.href}`}
                        className={`flex items-center !text-[16px] !h-full !w-full  
                          ${isOpen ? "!p-4 !py-1.5 justify-start" : "justify-center"}
                          `}
                      >
                        <item.icon
                          className={`${isOpen ? "mr-3 !size-5" : "!size-[22px]"}`}
                        />
                        {isOpen ? item.name : null}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </ul>
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
