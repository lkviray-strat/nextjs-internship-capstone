import { ProjectHeader } from "@/src/components/pages/project/project-header";
import { ProjectKanbanBoard } from "@/src/components/pages/project/project-kanban-board";

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <div className="flex flex-col space-y-6 h-full overflow-y-auto">
      <ProjectHeader params={params} />
      <ProjectKanbanBoard />
    </div>
  );
}
