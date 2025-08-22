import { queries } from "@/src/lib/db/queries";
import { Calendar, MoreHorizontal, Settings, Users } from "lucide-react";

type ProjectHeaderProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function ProjectHeader({ params }: ProjectHeaderProps) {
  const { projectId } = await params;
  const project = (await queries.projects.getProjectsById(projectId)).at(0);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
            Project {project?.name}
          </h1>
          <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-1">
            {project?.description || "No description available."}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
          <Users size={20} />
        </button>
        <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
          <Calendar size={20} />
        </button>
        <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
          <Settings size={20} />
        </button>
        <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}
