import { Kanban } from "@/src/components/kanban-board";
import { ProjectHeader } from "@/src/components/pages/project/project-header";

export default function ProjectPage() {
  return (
    <div className="flex flex-col space-y-8">
      <ProjectHeader />
      <Kanban />
    </div>
  );
}
