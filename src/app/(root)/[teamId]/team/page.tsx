import { CreateTeamMemberModal } from "@/src/components/pages/modals/create-team-member-modal";
import { TeamTable } from "@/src/components/pages/team/team-table";
import { PermissionGate } from "@/src/components/permission-gate";
import { auth } from "@clerk/nextjs/server";

type TeamPageProps = {
  params: Promise<{ teamId: string }>;
};

export default async function TeamPage({ params }: TeamPageProps) {
  const { userId } = await auth();
  const { teamId } = await params;

  return (
    <div className="sm:space-y-6 px-4 sm:px-6 lg:px-8 h-full">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="w-full sm:w-fit mb-8 sm:mb-0">
          <h1 className="text-3xl font-bold">Team Settings</h1>
          <p className="mt-2">
            Manage your team members and their permissions here.
          </p>
        </div>
        <div className="hidden sm:block">
          <PermissionGate
            userId={userId ?? ""}
            teamId={teamId}
            permissions={["create:team_member"]}
          >
            <CreateTeamMemberModal />
          </PermissionGate>
        </div>
      </div>

      <TeamTable />
    </div>
  );
}
