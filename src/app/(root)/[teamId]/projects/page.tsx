import { CreateProjectModal } from "@/src/components/pages/modals/create-project-modal";
import { ProjectGrid } from "@/src/components/pages/project/project-grid";
import { ProjectSearchFilter } from "@/src/components/pages/project/project-search-filter";

export default function ProjectsPage() {
  return (
    <div className="sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="w-full sm:w-fit mb-8 sm:mb-0">
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-2">Manage and organize your team projects</p>
        </div>
        <div className="hidden sm:block">
          <CreateProjectModal />
        </div>
      </div>

      <ProjectSearchFilter />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectGrid />
      </div>
    </div>
  );
}
