import { Kanban } from "@/src/components/pages/project/kanban-board/kanban-board";
import { ProjectHeader } from "@/src/components/pages/project/project-header";

type ProjectPageParams = {
  params: Promise<{
    projectId: string;
  }>;
};
export default async function ProjectPage({ params }: ProjectPageParams) {
  const { projectId } = await params;

  return (
    <div className="flex flex-col space-y-3">
      <ProjectHeader projectId={projectId} />
      <Kanban />
    </div>
  );
}
