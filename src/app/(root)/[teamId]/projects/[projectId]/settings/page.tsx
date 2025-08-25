import { ProjectSettingsHeader } from "@/src/components/pages/project/project-settings-header";
import { ProjectUpdateForm } from "@/src/components/pages/project/project-update-form";

export default function SettingsPage() {
  return (
    <div className="flex flex-col space-y-9 h-full">
      <ProjectSettingsHeader />
      <ProjectUpdateForm />
    </div>
  );
}
