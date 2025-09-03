"use client";

import { useQuickActions } from "@/src/hooks/use-quickactions";
import { Plus } from "lucide-react";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  useQuickActions(setOpen);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="w-full !py-[21px] text-[15px] sm:w-fit">
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
        <ProjectCreateForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
