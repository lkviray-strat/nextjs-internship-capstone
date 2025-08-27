import { ProjectSettingsHeader } from "@/src/components/pages/project/project-settings-header";
import { ProjectUpdateForm } from "@/src/components/pages/project/project-update-form";

export default function SettingsPage() {
  return (
    <div className="flex flex-col space-y-9 h-full px-4 sm:px-6 lg:px-8">
      <ProjectSettingsHeader />
      <ProjectUpdateForm />
    </div>
  );
}
