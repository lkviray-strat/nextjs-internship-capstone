import { ProjectUpdateForm } from "@/src/components/pages/project/project-update-form";
import { queries } from "@/src/lib/db/queries";
import { notFound } from "next/navigation";

type SettingsPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { projectId } = await params;
  const project = (await queries.projects.getProjectsById(projectId)).at(0);

  if (!project) notFound();

  return (
    <div className="flex flex-col space-y-9 h-full overflow-y-auto">
      <div className="flex flex-col space-x-4">
        <h1 className="text-[25px] sm:text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
          Project {project?.name}
        </h1>
      </div>
      <ProjectUpdateForm project={project} />
    </div>
  );
}
