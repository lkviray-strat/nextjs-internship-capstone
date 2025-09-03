import { DashboardQuickActions } from "@/src/components/pages/dashboard/dashboard-quick-actions";
import { DashboardRecentProjects } from "@/src/components/pages/dashboard/dashboard-recent-projects";
import { DashboardStats } from "@/src/components/pages/dashboard/dashboard-stats";
import { RecentProjectsSkeleton } from "@/src/components/states/skeleton-states";
import { Suspense } from "react";

export default function DashboardPage() {
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
        <DashboardStats />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-card flex flex-col rounded-lg border p-6">
          <Suspense fallback={<RecentProjectsSkeleton />}>
            <DashboardRecentProjects />
          </Suspense>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-lg border p-6">
          <DashboardQuickActions />
        </div>
      </div>
    </div>
  );
}
