import { DashboardQuickActions } from "@/src/components/pages/dashboard/dashboard-quick-actions";
import { DashboardRecentProjects } from "@/src/components/pages/dashboard/dashboard-recent-projects";
import { DashboardStats } from "@/src/components/pages/dashboard/dashboard-stats";
import { PermissionGate } from "@/src/components/permission-gate";
import {
  DashboardStatsSkeleton,
  RecentProjectsSkeleton,
} from "@/src/components/states/skeleton-states";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

type DashboardProps = {
  params: Promise<{ teamId: string }>;
};

export default async function DashboardPage({ params }: DashboardProps) {
  const { teamId } = await params;
  const { userId } = await auth();

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2">
          Welcome back! Here&apos;s an overview of your projects and tasks.
        </p>
      </div>

      {/* Stats Grid - Placeholder */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<DashboardStatsSkeleton />}>
          <DashboardStats />
        </Suspense>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Recent Projects */}
        <div className="bg-card flex-1 flex flex-col rounded-lg border p-6">
          <Suspense fallback={<RecentProjectsSkeleton />}>
            <DashboardRecentProjects />
          </Suspense>
        </div>

        {/* Quick Actions */}
        <PermissionGate
          userId={userId ?? ""}
          teamId={teamId ?? ""}
          permissions={["create:project"]}
        >
          <div className="bg-card flex-1 rounded-lg border p-6">
            <DashboardQuickActions />
          </div>
        </PermissionGate>
      </div>
    </div>
  );
}
