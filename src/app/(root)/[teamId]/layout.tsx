import { MainNavbar } from "@/src/components/main-navbar";
import { MainSidebar } from "@/src/components/main-sidebar";
import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import { queries } from "@/src/lib/db/queries";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type MainLayoutProps = {
  params: Promise<{
    teamId: string;
  }>;
  children: React.ReactNode;
};

export default async function MainLayout({
  params,
  children,
}: MainLayoutProps) {
  const { teamId } = await params;
  const existingTeam = await queries.teams.getTeamsById(teamId);

  if (existingTeam.length === 0) {
    return notFound();
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MainSidebar />
        {/* py-3 pr-3 if use inset variant */}
        <div className="flex-1 py-3">
          <SidebarInset>
            <MainNavbar />
            {/* Add min-h-[calc(100vh-4rem)] if use inset variant */}
            <main className="py-8 px-4 sm:px-6 lg:px-8 ">
              <Suspense>{children}</Suspense>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
