import { ProjectHeader } from "@/src/components/pages/project/project-header";
import { ProjectUpdateForm } from "@/src/components/pages/project/project-update-form";

export default function SettingsPage() {
  return (
    <div className="flex flex-col space-y-9 h-full overflow-y-auto">
      <ProjectHeader showOptions={false} />
      <ProjectUpdateForm />
    </div>
  );
}
