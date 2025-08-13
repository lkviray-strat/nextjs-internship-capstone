import { CheckCircle, Clock, Plus, TrendingUp, Users } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2">
          Welcome back! Here's an overview of your projects and tasks.
        </p>
      </div>

      {/* Stats Grid - Placeholder */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            name: "Active Projects",
            value: "12",
            icon: TrendingUp,
            change: "+2.5%",
          },
          { name: "Team Members", value: "24", icon: Users, change: "+4.1%" },
          {
            name: "Completed Tasks",
            value: "156",
            icon: CheckCircle,
            change: "+12.3%",
          },
          {
            name: "Pending Tasks",
            value: "43",
            icon: Clock,
            change: "-2.1%",
          },
        ].map((stat) => (
          <div
            key={stat.name}
            className="bg-card overflow-hidden rounded-lg border p-6"
          >
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-outer_space-500 dark:text-platinum-500">
                      {stat.value}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div>
                  <div className="font-medium">Project {i}</div>
                  <div className="text-sm">Last updated 2 hours ago</div>
                </div>
                <div className="w-12 h-2 bg-accent rounded-full">
                  <div className="w-8 h-2 bg-muted-foreground rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 rounded-lg">
              <Plus
                size={20}
                className="mr-2"
              />
              Create New Project
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 border rounded-lg">
              <Plus
                size={20}
                className="mr-2"
              />
              Add Team Member
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 border rounded-lg">
              <Plus
                size={20}
                className="mr-2"
              />
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
