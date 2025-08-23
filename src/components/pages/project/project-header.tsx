import { queries } from "@/src/lib/db/queries";
import { extractNonNullableFrom } from "@/src/lib/utils";
import { MoreHorizontal, Settings } from "lucide-react";
import Link from "next/link";
import { AvatarGroup } from "../../avatar-group";
import { Button, buttonVariants } from "../../ui/button";

type ProjectHeaderProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function ProjectHeader({ params }: ProjectHeaderProps) {
  const { projectId } = await params;
  const project = (await queries.projects.getProjectsById(projectId)).at(0);
  const projectTeams =
    await queries.projectTeams.getProjectTeamsByProjectIdWithTeamMembers(
      projectId
    );
  const everyMember =
    projectTeams[0].team?.members.flatMap((teamMembers) => teamMembers.user) ??
    [];
  const filteredMembers = extractNonNullableFrom(everyMember);

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center sm:justify-between gap-3">
      <div className="flex flex-col space-x-4">
        <h1 className="text-[25px] sm:text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
          Project {project?.name}
        </h1>
      </div>

      <div className="flex items-center gap-3 shrink-0 sm:pl-10">
        <AvatarGroup users={filteredMembers} />
        <Link
          href={`${projectId}/settings`}
          className={`${buttonVariants({ variant: "secondary" })} >`}
        >
          <Settings className="size-5" />
          Settings
        </Link>
        <Button
          variant="secondary"
          size="icon"
        >
          <MoreHorizontal className="size-5" />
        </Button>
      </div>
    </div>
  );
}
