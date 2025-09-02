import { CreateTeamMemberModal } from "@/src/components/pages/modals/create-team-member-modal";

export default function TeamPage() {
  return (
    <div className="sm:space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="w-full sm:w-fit mb-8 sm:mb-0">
          <h1 className="text-3xl font-bold">Team Settings</h1>
          <p className="mt-2">
            Manage your team members and their permissions here.
          </p>
        </div>
        <div className="hidden sm:block">
          <CreateTeamMemberModal />
        </div>
      </div>

      {/* <ProjectSearchFilter /> */}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] lg:grid-cols-3 gap-6">
        {/* <ProjectGrid /> */}
      </div>
    </div>
  );
}
