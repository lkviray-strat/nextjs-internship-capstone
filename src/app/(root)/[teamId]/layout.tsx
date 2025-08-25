import { MainNavbar } from "@/src/components/pages/main-layout/main-navbar";
import { MainSidebar } from "@/src/components/pages/main-layout/main-sidebar";
import { ResetProvider } from "@/src/components/reset-provider";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import { queries } from "@/src/lib/db/queries";
import { auth } from "@clerk/nextjs/server";
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
  const { userId } = await auth();
  const { teamId } = await params;
  const team = await queries.teams.getTeamsById(teamId);
  const teamMember = await queries.teamMembers.getTeamMembersByIds(
    userId!,
    teamId
  );
  const isValid = team.length > 0 && teamMember.length > 0;

  if (!isValid) {
    return notFound();
  }

  return (
    <ResetProvider initialTeamId={teamId}>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <MainSidebar />
          {/* py-3 pr-3 if use inset variant */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            <MainNavbar />
            {/* Add min-h-[calc(100vh-4rem)] if use inset variant */}
            <main className="flex-1 pt-8 px-4 sm:px-6 lg:px-8">
              <Suspense>{children}</Suspense>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ResetProvider>
  );
}
