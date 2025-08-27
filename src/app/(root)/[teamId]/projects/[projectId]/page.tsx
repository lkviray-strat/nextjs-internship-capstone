import { Kanban } from "@/src/components/pages/project/kanban-board/kanban-board";
import { ProjectHeader } from "@/src/components/pages/project/project-header";

export default function ProjectPage() {
  return (
    <div className="flex flex-col space-y-3">
      <ProjectHeader />
      <Kanban />
    </div>
  );
}
