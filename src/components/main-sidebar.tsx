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
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/src/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useIsMobile } from "../hooks/use-mobile";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Team", href: "/team", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MainSidebar() {
  const [isOpen, setIsOpen] = useState<boolean>();
  const pathname = usePathname();
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setIsOpen(isMobile);
    } else {
      setIsOpen(open);
    }
  }, [open, isMobile]);

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
    >
      <SidebarContent>
        <SidebarGroup>
          {isOpen && (
            <SidebarHeader className="text-2xl pl-7 font-bold">
              <Link href="/">eStratify</Link>
            </SidebarHeader>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={`mt-3 ${isOpen ? "px-3" : ""}`}>
              <ul className={`${isOpen ? "space-y-1" : "space-y-3"}`}>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link
                        href={item.href}
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

{
  /*  */
}
