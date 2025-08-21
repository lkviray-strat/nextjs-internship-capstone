import { CreateProjectModal } from "@/src/components/modals/create-project-modal";
import { ProjectGrid } from "@/src/components/project-grid";
import { Filter, Search } from "lucide-react";
import { Suspense } from "react";

export default function ProjectsPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="w-full sm:w-fit mb-8 sm:mb-0">
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-2">Manage and organize your team projects</p>
        </div>
        <CreateProjectModal />
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            size={16}
          />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-hidden focus:ring-2 "
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 border rounded-lg">
          <Filter
            size={16}
            className="mr-2"
          />
          Filter
        </button>
      </div>

      {/* Projects Grid Placeholder */}
      <Suspense>
        <ProjectGrid />
      </Suspense>
    </div>
  );
}
