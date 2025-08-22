import { Plus } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { ProjectCreateForm } from "../project/project-create-form";

export function CreateProjectModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-fit">
          <Plus className="size-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[630px] pb-10">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-semibold">
            Create New Project
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ProjectCreateForm />
      </DialogContent>
    </Dialog>
  );
}
