import { ProjectHeader } from "@/src/components/pages/project/project-header";

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <div className="flex flex-col space-y-6 h-full overflow-y-auto">
      <ProjectHeader params={params} />
    </div>
  );
}
